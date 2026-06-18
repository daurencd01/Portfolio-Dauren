// Vercel Serverless Function — Passive Web Security Scanner
// Делает ТОЛЬКО обычные HTTP-запросы (как securityheaders.com).
// Защита от SSRF: блокирует приватные/loopback/metadata адреса.
//
// GET /api/scan?url=https://example.com
'use strict';

const dns = require('dns').promises;
const net = require('net');

// ---- SSRF guard: приватные диапазоны запрещены ----
function isPrivateIp(ip) {
  if (net.isIPv4(ip)) {
    const p = ip.split('.').map(Number);
    return (
      p[0] === 10 ||
      p[0] === 127 ||
      p[0] === 0 ||
      (p[0] === 169 && p[1] === 254) ||      // link-local / cloud metadata
      (p[0] === 172 && p[1] >= 16 && p[1] <= 31) ||
      (p[0] === 192 && p[1] === 168) ||
      (p[0] === 100 && p[1] >= 64 && p[1] <= 127)
    );
  }
  // IPv6: loopback / unique-local / link-local
  const v = ip.toLowerCase();
  return v === '::1' || v.startsWith('fc') || v.startsWith('fd') || v.startsWith('fe80') || v === '::';
}

async function assertSafeHost(hostname) {
  if (!hostname || hostname === 'localhost') throw new Error('Запрещённый хост');
  const addrs = await dns.lookup(hostname, { all: true });
  for (const a of addrs) {
    if (isPrivateIp(a.address)) throw new Error('Приватный/локальный адрес запрещён (SSRF-защита)');
  }
}

function timeoutFetch(url, opts = {}, ms = 8000) {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), ms);
  return fetch(url, { ...opts, signal: ac.signal, redirect: 'follow' })
    .finally(() => clearTimeout(t));
}

// ---- проверки ----
function analyzeHeaders(h) {
  const get = (k) => h.get(k);
  const checks = [];
  const push = (id, title, status, detail, recommendation) =>
    checks.push({ id, title, status, detail, recommendation });

  // HSTS
  const hsts = get('strict-transport-security');
  push('hsts', 'HSTS (Strict-Transport-Security)', hsts ? 'pass' : 'fail',
    hsts ? hsts : 'Заголовок отсутствует',
    'Добавьте: Strict-Transport-Security: max-age=63072000; includeSubDomains; preload');

  // CSP
  const csp = get('content-security-policy');
  push('csp', 'Content-Security-Policy', csp ? 'pass' : 'fail',
    csp ? 'Политика задана' : 'Заголовок отсутствует',
    'Настройте CSP для защиты от XSS и инъекций.');

  // Clickjacking
  const xfo = get('x-frame-options');
  const frameAncestors = csp && /frame-ancestors/i.test(csp);
  push('clickjacking', 'Защита от clickjacking', (xfo || frameAncestors) ? 'pass' : 'fail',
    xfo ? `X-Frame-Options: ${xfo}` : frameAncestors ? 'CSP frame-ancestors' : 'Нет защиты',
    'Добавьте X-Frame-Options: DENY или CSP frame-ancestors \'none\'.');

  // MIME sniffing
  const xcto = get('x-content-type-options');
  push('nosniff', 'X-Content-Type-Options', /nosniff/i.test(xcto || '') ? 'pass' : 'fail',
    xcto || 'Отсутствует',
    'Добавьте: X-Content-Type-Options: nosniff');

  // Referrer-Policy
  const ref = get('referrer-policy');
  push('referrer', 'Referrer-Policy', ref ? 'pass' : 'warn',
    ref || 'Отсутствует',
    'Добавьте: Referrer-Policy: strict-origin-when-cross-origin');

  // Permissions-Policy
  const perm = get('permissions-policy') || get('feature-policy');
  push('permissions', 'Permissions-Policy', perm ? 'pass' : 'warn',
    perm ? 'Задана' : 'Отсутствует',
    'Ограничьте доступ к камере/гео/микрофону через Permissions-Policy.');

  // CORS
  const acao = get('access-control-allow-origin');
  push('cors', 'CORS-конфигурация', acao === '*' ? 'fail' : 'pass',
    acao ? `Access-Control-Allow-Origin: ${acao}` : 'Не задан (ок)',
    acao === '*' ? 'Не используйте "*" — укажите конкретные origin.' : 'Конфигурация в порядке.');

  // Раскрытие технологий
  const server = get('server');
  const xpb = get('x-powered-by');
  const leak = [];
  if (server && /\d/.test(server)) leak.push(`Server: ${server}`);
  if (xpb) leak.push(`X-Powered-By: ${xpb}`);
  push('disclosure', 'Раскрытие версий ПО', leak.length ? 'warn' : 'pass',
    leak.length ? leak.join(' · ') : 'Версии скрыты',
    'Скройте заголовки Server/X-Powered-By, чтобы не раскрывать стек.');

  // Cookie flags
  const setCookie = h.get('set-cookie');
  if (setCookie) {
    const bad = [];
    if (!/httponly/i.test(setCookie)) bad.push('HttpOnly');
    if (!/secure/i.test(setCookie)) bad.push('Secure');
    if (!/samesite/i.test(setCookie)) bad.push('SameSite');
    push('cookies', 'Флаги cookie', bad.length ? 'warn' : 'pass',
      bad.length ? `Нет флагов: ${bad.join(', ')}` : 'Все флаги установлены',
      'Устанавливайте cookie с HttpOnly; Secure; SameSite=Strict.');
  } else {
    push('cookies', 'Флаги cookie', 'info', 'Cookie не обнаружены', '—');
  }

  return checks;
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
    if (!['http:', 'https:'].includes(target.protocol))
      return res.status(400).json({ error: 'Только http/https' });

    await assertSafeHost(target.hostname);

    // основной запрос
    const start = Date.now();
    const resp = await timeoutFetch(target.href, { method: 'GET', headers: { 'User-Agent': 'KD-SEC-Scanner/1.0' } });
    const headerChecks = analyzeHeaders(resp.headers);

    // HTTPS-проверка
    const httpsCheck = {
      id: 'https', title: 'HTTPS / шифрование',
      status: resp.url.startsWith('https://') ? 'pass' : 'fail',
      detail: resp.url.startsWith('https://') ? 'Соединение защищено TLS' : 'Сайт без HTTPS',
      recommendation: 'Используйте HTTPS и редирект с http на https.'
    };

    // проверка чувствительных файлов (обычные GET к публичным путям)
    const sensitive = ['/.env', '/.git/HEAD', '/.git/config'];
    const exposed = [];
    await Promise.all(sensitive.map(async (path) => {
      try {
        const r = await timeoutFetch(new URL(path, target.origin).href, { method: 'GET' }, 5000);
        const txt = (await r.text()).slice(0, 200);
        if (r.status === 200 && txt && !/<html/i.test(txt)) exposed.push(path);
      } catch { /* недоступно — хорошо */ }
    }));
    const filesCheck = {
      id: 'files', title: 'Открытые чувствительные файлы',
      status: exposed.length ? 'fail' : 'pass',
      detail: exposed.length ? `Доступны: ${exposed.join(', ')}` : 'Не обнаружены',
      recommendation: exposed.length ? 'СРОЧНО закройте доступ к .env/.git — это утечка секретов!' : 'В порядке.'
    };

    const all = [httpsCheck, ...headerChecks, filesCheck];

    // подсчёт оценки
    const weight = { fail: 0, warn: 0.5, pass: 1, info: null };
    let max = 0, got = 0;
    for (const c of all) {
      if (weight[c.status] === null) continue;
      max += 1; got += weight[c.status];
    }
    const pct = max ? Math.round((got / max) * 100) : 0;
    const grade = pct >= 95 ? 'A+' : pct >= 85 ? 'A' : pct >= 70 ? 'B' : pct >= 55 ? 'C' : pct >= 40 ? 'D' : 'F';

    return res.status(200).json({
      target: target.href,
      finalUrl: resp.url,
      scannedAt: new Date().toISOString(),
      durationMs: Date.now() - start,
      grade, score: pct,
      summary: {
        pass: all.filter(c => c.status === 'pass').length,
        warn: all.filter(c => c.status === 'warn').length,
        fail: all.filter(c => c.status === 'fail').length,
      },
      checks: all,
    });
  } catch (e) {
    return res.status(400).json({ error: e.message || 'Ошибка сканирования' });
  }
};
