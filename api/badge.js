// Vercel Serverless Function — встраиваемый бейдж безопасности (SVG, shields-стиль)
// GET /api/badge?url=<домен>  ->  image/svg+xml  («security: A+»)
// Лёгкая проверка заголовков (быстро + кэшируется), чтобы бейдж можно было встроить на любой сайт.
'use strict';

const dns = require('dns').promises;
const net = require('net');

function isPrivateIp(ip) {
  if (net.isIPv4(ip)) {
    const p = ip.split('.').map(Number);
    return (p[0] === 10 || p[0] === 127 || p[0] === 0 || (p[0] === 169 && p[1] === 254) ||
      (p[0] === 172 && p[1] >= 16 && p[1] <= 31) || (p[0] === 192 && p[1] === 168) || (p[0] === 100 && p[1] >= 64 && p[1] <= 127));
  }
  const v = ip.toLowerCase();
  return v === '::1' || v.startsWith('fc') || v.startsWith('fd') || v.startsWith('fe80') || v === '::';
}
async function assertSafeHost(h) {
  if (!h || h === 'localhost') throw new Error('bad host');
  const addrs = await dns.lookup(h, { all: true });
  for (const a of addrs) if (isPrivateIp(a.address)) throw new Error('private');
}
function tf(url, ms = 6000) {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), ms);
  return fetch(url, { redirect: 'follow', signal: ac.signal, headers: { 'User-Agent': 'KD-SEC-Badge/1.0' } }).finally(() => clearTimeout(t));
}

function quickGrade(resp) {
  const h = resp.headers, g = k => h.get(k);
  const csp = g('content-security-policy');
  let max = 0, got = 0;
  const add = (ok) => { max++; if (ok) got++; };
  add(resp.url.startsWith('https://'));
  add(!!g('strict-transport-security'));
  add(!!csp);
  add(!!g('x-frame-options') || (csp && /frame-ancestors/i.test(csp)));
  add(/nosniff/i.test(g('x-content-type-options') || ''));
  add(!!g('referrer-policy'));
  const pct = max ? Math.round(got / max * 100) : 0;
  const grade = pct >= 95 ? 'A+' : pct >= 85 ? 'A' : pct >= 70 ? 'B' : pct >= 55 ? 'C' : pct >= 40 ? 'D' : 'F';
  return { grade, pct };
}

const COLORS = { 'A+': '#00c853', 'A': '#43a047', 'B': '#1e88e5', 'C': '#fdd835', 'D': '#fb8c00', 'F': '#e53935' };

function svg(label, value, color) {
  const lw = 8 + label.length * 6.2;      // ширина левой части
  const vw = 16 + value.length * 8;        // ширина правой части
  const w = Math.round(lw + vw);
  const lx = Math.round(lw / 2) * 10, vx = Math.round((lw + vw / 2)) * 10;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="20" role="img" aria-label="${label}: ${value}">
<title>${label}: ${value}</title>
<linearGradient id="s" x2="0" y2="100%"><stop offset="0" stop-color="#bbb" stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/></linearGradient>
<clipPath id="r"><rect width="${w}" height="20" rx="3" fill="#fff"/></clipPath>
<g clip-path="url(#r)">
<rect width="${lw}" height="20" fill="#555"/>
<rect x="${lw}" width="${vw}" height="20" fill="${color}"/>
<rect width="${w}" height="20" fill="url(#s)"/>
</g>
<g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" font-size="110" text-rendering="geometricPrecision">
<text transform="scale(.1)" x="${lx}" y="150" fill="#010101" fill-opacity=".3">${label}</text>
<text transform="scale(.1)" x="${lx}" y="140">${label}</text>
<text transform="scale(.1)" x="${vx}" y="150" fill="#010101" fill-opacity=".3">${value}</text>
<text transform="scale(.1)" x="${vx}" y="140">${value}</text>
</g></svg>`;
}

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
  // кэш на CDN/в браузере, чтобы встроенный бейдж не дёргал скан постоянно
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400');
  try {
    let raw = (req.query && req.query.url) || '';
    if (Array.isArray(raw)) raw = raw[0];
    if (!raw) { res.status(200).send(svg('security', 'no url', '#9e9e9e')); return; }
    if (!/^https?:\/\//i.test(raw)) raw = 'https://' + raw;
    const target = new URL(raw);
    await assertSafeHost(target.hostname);
    const resp = await tf(target.href);
    const { grade } = quickGrade(resp);
    res.status(200).send(svg('security', grade, COLORS[grade] || '#9e9e9e'));
  } catch (e) {
    res.status(200).send(svg('security', 'n/a', '#9e9e9e'));
  }
};
