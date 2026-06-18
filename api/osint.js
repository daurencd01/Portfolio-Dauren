// Vercel Serverless Function — Passive OSINT Lookup
// ТОЛЬКО открытые публичные данные: RDAP/WHOIS, DNS, Certificate Transparency,
// IP-геолокация, Wayback Machine. Никаких атак и сканирования портов.
//
// GET /api/osint?domain=example.com
'use strict';

const dns = require('dns').promises;
const net = require('net');

function isPrivateIp(ip) {
  if (net.isIPv4(ip)) {
    const p = ip.split('.').map(Number);
    return (p[0] === 10 || p[0] === 127 || p[0] === 0 ||
      (p[0] === 169 && p[1] === 254) || (p[0] === 172 && p[1] >= 16 && p[1] <= 31) ||
      (p[0] === 192 && p[1] === 168) || (p[0] === 100 && p[1] >= 64 && p[1] <= 127));
  }
  const v = ip.toLowerCase();
  return v === '::1' || v.startsWith('fc') || v.startsWith('fd') || v.startsWith('fe80') || v === '::';
}
function tf(url, ms = 7000, opts = {}) {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), ms);
  return fetch(url, { ...opts, signal: ac.signal, headers: { 'User-Agent': 'KD-SEC-OSINT/1.0', ...(opts.headers || {}) } })
    .finally(() => clearTimeout(t));
}
function apex(h) { const p = h.split('.'); return p.length > 2 ? p.slice(-2).join('.') : h; }
function daysBetween(a, b) { return Math.round((b - a) / 86400000); }

// ---------- RDAP (современный WHOIS) ----------
async function rdap(domain) {
  try {
    const r = await tf(`https://rdap.org/domain/${domain}`, 8000);
    if (!r.ok) return null;
    const d = await r.json();
    const ev = {};
    (d.events || []).forEach(e => { ev[e.eventAction] = e.eventDate; });
    const registrar = (d.entities || []).find(e => (e.roles || []).includes('registrar'));
    const regName = registrar && registrar.vcardArray && registrar.vcardArray[1]
      ? (registrar.vcardArray[1].find(x => x[0] === 'fn') || [])[3] : null;
    const created = ev.registration ? new Date(ev.registration) : null;
    return {
      registrar: regName || (registrar && registrar.handle) || '—',
      created: ev.registration || null,
      expires: ev.expiration || null,
      updated: ev.lastChanged || ev['last update of RDAP database'] || null,
      ageDays: created ? daysBetween(created.getTime(), Date.now()) : null,
      status: (d.status || []).slice(0, 5),
      nameservers: (d.nameservers || []).map(n => (n.ldhName || '').toLowerCase()),
    };
  } catch { return null; }
}

// ---------- DNS ----------
async function dnsAll(domain) {
  const out = {};
  const grab = async (fn, key) => { try { out[key] = await fn(); } catch { out[key] = null; } };
  await Promise.all([
    grab(() => dns.resolve4(domain), 'A'),
    grab(() => dns.resolve6(domain), 'AAAA'),
    grab(async () => (await dns.resolveMx(domain)).map(m => `${m.exchange} (${m.priority})`), 'MX'),
    grab(() => dns.resolveNs(domain), 'NS'),
    grab(async () => (await dns.resolveTxt(domain)).map(t => t.join('')), 'TXT'),
  ]);
  return out;
}

// ---------- IP / хостинг ----------
async function ipInfo(ip) {
  try {
    const r = await tf(`https://ipinfo.io/${ip}/json`, 6000);
    if (!r.ok) return null;
    const d = await r.json();
    return { ip, org: d.org || '—', city: d.city || '', region: d.region || '', country: d.country || '', hostname: d.hostname || '' };
  } catch { return null; }
}

// ---------- Certificate Transparency (поддомены) ----------
async function subdomains(domain) {
  try {
    const r = await tf(`https://crt.sh/?q=%25.${domain}&output=json`, 9000);
    if (!r.ok) return null;
    const arr = await r.json();
    const set = new Set();
    arr.forEach(x => String(x.name_value || '').split('\n').forEach(n => {
      n = n.trim().toLowerCase().replace(/^\*\./, '');
      if (n && n.endsWith(domain)) set.add(n);
    }));
    return [...set].sort().slice(0, 100);
  } catch { return null; }
}

// ---------- Wayback Machine ----------
async function wayback(domain) {
  try {
    const r = await tf(`https://web.archive.org/cdx/search/cdx?url=${domain}&output=json&fl=timestamp&collapse=timestamp:6&limit=5000`, 8000);
    if (!r.ok) return null;
    const rows = await r.json();
    if (!rows || rows.length < 2) return { snapshots: 0, first: null, last: null };
    const ts = rows.slice(1).map(x => x[0]).filter(Boolean).sort();
    const fmt = (t) => `${t.slice(0, 4)}-${t.slice(4, 6)}-${t.slice(6, 8)}`;
    return { snapshots: ts.length, first: fmt(ts[0]), last: fmt(ts[ts.length - 1]) };
  } catch { return null; }
}

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  try {
    let raw = (req.query && (req.query.domain || req.query.url)) || '';
    if (Array.isArray(raw)) raw = raw[0];
    if (!raw) return res.status(400).json({ error: 'Параметр ?domain= обязателен' });
    raw = raw.replace(/^https?:\/\//i, '').replace(/\/.*$/, '').trim().toLowerCase();
    if (!/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(raw)) return res.status(400).json({ error: 'Некорректный домен' });
    if (raw === 'localhost') return res.status(400).json({ error: 'Запрещённый хост' });

    // защита: домен должен резолвиться в публичный IP
    let firstIp = null;
    try {
      const addrs = await dns.lookup(raw, { all: true });
      for (const a of addrs) if (isPrivateIp(a.address)) return res.status(400).json({ error: 'Приватный адрес запрещён' });
      firstIp = addrs[0] && addrs[0].address;
    } catch { /* домен может не иметь A-записи, продолжаем пассивные источники */ }

    const start = Date.now();
    const d = apex(raw);
    const [whois, dnsRec, sub, wb] = await Promise.all([
      rdap(d), dnsAll(raw), subdomains(d), wayback(raw),
    ]);
    const ip = firstIp ? await ipInfo(firstIp) : null;

    return res.status(200).json({
      domain: raw, apex: d, scannedAt: new Date().toISOString(), durationMs: Date.now() - start,
      whois, dns: dnsRec, ip, subdomains: sub, wayback: wb,
    });
  } catch (e) {
    return res.status(400).json({ error: e.message || 'Ошибка OSINT-запроса' });
  }
};
