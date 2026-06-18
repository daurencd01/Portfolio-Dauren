// Vercel Serverless Function — Passive Web Security Scanner v2
// Делает ТОЛЬКО обычные запросы (как securityheaders.com). Без атак.
// SSRF-защита: блокирует приватные/loopback/metadata адреса.
//
// GET /api/scan?url=https://example.com
'use strict';

const dns = require('dns').promises;
const net = require('net');
const tls = require('tls');

// ---------- SSRF guard ----------
function isPrivateIp(ip) {
  if (net.isIPv4(ip)) {
    const p = ip.split('.').map(Number);
    return (
      p[0] === 10 || p[0] === 127 || p[0] === 0 ||
      (p[0] === 169 && p[1] === 254) ||
      (p[0] === 172 && p[1] >= 16 && p[1] <= 31) ||
      (p[0] === 192 && p[1] === 168) ||
      (p[0] === 100 && p[1] >= 64 && p[1] <= 127)
    );
  }
  const v = ip.toLowerCase();
  return v === '::1' || v.startsWith('fc') || v.startsWith('fd') || v.startsWith('fe80') || v === '::';
}
async function assertSafeHost(hostname) {
  if (!hostname || hostname === 'localhost') throw new Error('Запрещённый хост');
  const addrs = await dns.lookup(hostname, { all: true });
  for (const a of addrs) if (isPrivateIp(a.address)) throw new Error('Приватный/локальный адрес запрещён (SSRF-защита)');
}

function timeoutFetch(url, opts = {}, ms = 8000) {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), ms);
  return fetch(url, { redirect: 'follow', ...opts, signal: ac.signal }).finally(() => clearTimeout(t));
}

// ---------- SSL-сертификат ----------
function getCert(hostname, ms = 6000) {
  return new Promise((resolve) => {
    let done = false;
    const finish = (v) => { if (!done) { done = true; resolve(v); } };
    const socket = tls.connect({ host: hostname, port: 443, servername: hostname, timeout: ms, rejectUnauthorized: false }, () => {
      const c = socket.getPeerCertificate();
      socket.end();
      if (!c || !c.valid_to) return finish(null);
      const days = Math.round((new Date(c.valid_to).getTime() - Date.now()) / 86400000);
      finish({ issuer: (c.issuer && (c.issuer.O || c.issuer.CN)) || '—', validTo: c.valid_to, days });
    });
    socket.on('error', () => finish(null));
    socket.on('timeout', () => { socket.destroy(); finish(null); });
  });
}

// ---------- DNS / email ----------
function apex(hostname) {
  const parts = hostname.split('.');
  return parts.length > 2 ? parts.slice(-2).join('.') : hostname;
}
async function dnsChecks(hostname) {
  const d = apex(hostname);
  const out = { spf: null, dmarc: null, mx: null };
  try { out.spf = (await dns.resolveTxt(d)).flat().find(r => /v=spf1/i.test(r)) || null; } catch {}
  try { out.dmarc = (await dns.resolveTxt('_dmarc.' + d)).flat().find(r => /v=DMARC1/i.test(r)) || null; } catch {}
  try { const mx = await dns.resolveMx(d); out.mx = (mx && mx.length) ? mx.map(m => m.exchange) : null; } catch {}
  return out;
}

async function checkRedirect(hostname) {
  try {
    const r = await timeoutFetch('http://' + hostname, { method: 'GET', redirect: 'manual' }, 5000);
    const loc = r.headers.get('location') || '';
    return (r.status >= 300 && r.status < 400 && /^https:/i.test(loc));
  } catch { return null; }
}

// ---------- анализ заголовков ----------
function analyzeHeaders(h) {
  const get = (k) => h.get(k);
  const checks = [];
  const push = (id, category, title, status, detail, recommendation) =>
    checks.push({ id, category, title, status, detail, recommendation });

  const csp = get('content-security-policy');
  push('hsts', 'Transport', 'HSTS (Strict-Transport-Security)', get('strict-transport-security') ? 'pass' : 'fail',
    get('strict-transport-security') || 'Отсутствует',
    'Strict-Transport-Security: max-age=63072000; includeSubDomains; preload');
  push('csp', 'Headers', 'Content-Security-Policy', csp ? 'pass' : 'fail',
    csp ? 'Политика задана' : 'Отсутствует', 'Настройте CSP против XSS и инъекций.');
  const xfo = get('x-frame-options'); const fa = csp && /frame-ancestors/i.test(csp);
  push('clickjacking', 'Headers', 'Защита от clickjacking', (xfo || fa) ? 'pass' : 'fail',
    xfo ? `X-Frame-Options: ${xfo}` : fa ? 'CSP frame-ancestors' : 'Нет защиты',
    'X-Frame-Options: DENY или CSP frame-ancestors \'none\'.');
  push('nosniff', 'Headers', 'X-Content-Type-Options', /nosniff/i.test(get('x-content-type-options') || '') ? 'pass' : 'fail',
    get('x-content-type-options') || 'Отсутствует', 'X-Content-Type-Options: nosniff');
  push('referrer', 'Headers', 'Referrer-Policy', get('referrer-policy') ? 'pass' : 'warn',
    get('referrer-policy') || 'Отсутствует', 'Referrer-Policy: strict-origin-when-cross-origin');
  push('permissions', 'Headers', 'Permissions-Policy', (get('permissions-policy') || get('feature-policy')) ? 'pass' : 'warn',
    (get('permissions-policy') || get('feature-policy')) ? 'Задана' : 'Отсутствует',
    'Ограничьте камеру/гео/микрофон через Permissions-Policy.');
  const acao = get('access-control-allow-origin');
  push('cors', 'CORS', 'CORS-конфигурация', acao === '*' ? 'fail' : 'pass',
    acao ? `Access-Control-Allow-Origin: ${acao}` : 'Не задан (ок)',
    acao === '*' ? 'Не используйте "*" — укажите конкретные origin.' : 'В порядке.');
  const leak = [];
  if (get('server') && /\d/.test(get('server'))) leak.push(`Server: ${get('server')}`);
  if (get('x-powered-by')) leak.push(`X-Powered-By: ${get('x-powered-by')}`);
  push('disclosure', 'Disclosure', 'Раскрытие версий ПО', leak.length ? 'warn' : 'pass',
    leak.length ? leak.join(' · ') : 'Версии скрыты', 'Скройте заголовки Server/X-Powered-By.');
  const sc = h.get('set-cookie');
  if (sc) {
    const bad = [];
    if (!/httponly/i.test(sc)) bad.push('HttpOnly');
    if (!/secure/i.test(sc)) bad.push('Secure');
    if (!/samesite/i.test(sc)) bad.push('SameSite');
    push('cookies', 'Cookies', 'Флаги cookie', bad.length ? 'warn' : 'pass',
      bad.length ? `Нет: ${bad.join(', ')}` : 'Все флаги установлены', 'HttpOnly; Secure; SameSite=Strict');
  } else push('cookies', 'Cookies', 'Флаги cookie', 'info', 'Cookie не обнаружены', '—');
  return checks;
}

const WEIGHT = { fail: 0, warn: 0.5, pass: 1, info: null };
function scoreOf(list) {
  let max = 0, got = 0;
  for (const c of list) { if (WEIGHT[c.status] === null) continue; max++; got += WEIGHT[c.status]; }
  return max ? Math.round((got / max) * 100) : null;
}

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  try {
    let raw = (req.query && req.query.url) || '';
    if (Array.isArray(raw)) raw = raw[0];
    if (!raw) return res.status(400).json({ error: 'Параметр ?url= обязателен' });
    if (!/^https?:\/\//i.test(raw)) raw = 'https://' + raw;
    let target;
    try { target = new URL(raw); } catch { return res.status(400).json({ error: 'Некорректный URL' }); }
    if (!['http:', 'https:'].includes(target.protocol)) return res.status(400).json({ error: 'Только http/https' });
    await assertSafeHost(target.hostname);

    const start = Date.now();
    const [resp, cert, dnsInfo, redirects] = await Promise.all([
      timeoutFetch(target.href, { method: 'GET', headers: { 'User-Agent': 'KD-SEC-Scanner/2.0' } }),
      getCert(target.hostname),
      dnsChecks(target.hostname),
      checkRedirect(target.hostname),
    ]);

    const all = [];
    // Transport
    all.push({ id: 'https', category: 'Transport', title: 'HTTPS / шифрование',
      status: resp.url.startsWith('https://') ? 'pass' : 'fail',
      detail: resp.url.startsWith('https://') ? 'Соединение защищено TLS' : 'Сайт без HTTPS',
      recommendation: 'Используйте HTTPS на всём сайте.' });
    all.push({ id: 'redirect', category: 'Transport', title: 'Редирект HTTP → HTTPS',
      status: redirects === true ? 'pass' : redirects === false ? 'warn' : 'info',
      detail: redirects === true ? 'http автоматически перенаправляется на https' : redirects === false ? 'Нет редиректа с http' : 'Не удалось проверить',
      recommendation: 'Настройте 301-редирект с http на https.' });
    if (cert) {
      const st = cert.days < 0 ? 'fail' : cert.days < 30 ? 'warn' : 'pass';
      all.push({ id: 'ssl', category: 'Transport', title: 'SSL-сертификат',
        status: st, detail: `Издатель: ${cert.issuer} · истекает через ${cert.days} дн. (${cert.validTo})`,
        recommendation: cert.days < 30 ? 'Сертификат скоро истекает — обновите.' : 'В порядке.' });
    }
    all.push(...analyzeHeaders(resp.headers));

    // Email / DNS
    all.push({ id: 'spf', category: 'Email/DNS', title: 'SPF-запись',
      status: dnsInfo.spf ? 'pass' : 'warn', detail: dnsInfo.spf || 'Отсутствует',
      recommendation: 'Добавьте SPF для защиты от подделки писем.' });
    all.push({ id: 'dmarc', category: 'Email/DNS', title: 'DMARC-запись',
      status: dnsInfo.dmarc ? 'pass' : 'warn', detail: dnsInfo.dmarc || 'Отсутствует',
      recommendation: 'Добавьте _dmarc TXT-запись (v=DMARC1).' });
    all.push({ id: 'mx', category: 'Email/DNS', title: 'MX-записи',
      status: 'info', detail: dnsInfo.mx ? dnsInfo.mx.join(', ') : 'Нет почтовых серверов', recommendation: '—' });

    // security.txt + чувствительные файлы
    const sensitive = ['/.env', '/.git/HEAD', '/.git/config'];
    const exposed = [];
    await Promise.all(sensitive.map(async (path) => {
      try {
        const r = await timeoutFetch(new URL(path, target.origin).href, { method: 'GET' }, 5000);
        const txt = (await r.text()).slice(0, 200);
        if (r.status === 200 && txt && !/<html/i.test(txt)) exposed.push(path);
      } catch {}
    }));
    all.push({ id: 'files', category: 'Exposure', title: 'Открытые чувствительные файлы',
      status: exposed.length ? 'fail' : 'pass', detail: exposed.length ? `Доступны: ${exposed.join(', ')}` : 'Не обнаружены',
      recommendation: exposed.length ? 'СРОЧНО закройте доступ к .env/.git!' : 'В порядке.' });
    let stxt = false;
    try { const r = await timeoutFetch(new URL('/.well-known/security.txt', target.origin).href, {}, 4000); stxt = r.status === 200; } catch {}
    all.push({ id: 'securitytxt', category: 'Disclosure', title: 'security.txt',
      status: stxt ? 'pass' : 'info', detail: stxt ? 'Есть /.well-known/security.txt' : 'Отсутствует (необязательно)',
      recommendation: 'Добавьте security.txt с контактом для отчётов об уязвимостях.' });

    // категории
    const order = ['Transport', 'Headers', 'Cookies', 'CORS', 'Email/DNS', 'Disclosure', 'Exposure'];
    const map = {};
    for (const c of all) (map[c.category] = map[c.category] || []).push(c);
    const categories = order.filter(n => map[n]).map(n => ({ name: n, score: scoreOf(map[n]), checks: map[n] }));

    const pct = scoreOf(all);
    const grade = pct >= 95 ? 'A+' : pct >= 85 ? 'A' : pct >= 70 ? 'B' : pct >= 55 ? 'C' : pct >= 40 ? 'D' : 'F';

    return res.status(200).json({
      target: target.href, finalUrl: resp.url, scannedAt: new Date().toISOString(),
      durationMs: Date.now() - start, grade, score: pct,
      summary: {
        pass: all.filter(c => c.status === 'pass').length,
        warn: all.filter(c => c.status === 'warn').length,
        fail: all.filter(c => c.status === 'fail').length,
      },
      categories, checks: all,
    });
  } catch (e) {
    return res.status(400).json({ error: e.message || 'Ошибка сканирования' });
  }
};
