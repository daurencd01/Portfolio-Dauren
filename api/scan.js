// Vercel Serverless Function — Passive Web Security Scanner v2
// Делает ТОЛЬКО обычные запросы (как securityheaders.com). Без атак.
// SSRF-защита: блокирует приватные/loopback/metadata адреса.
//
// GET /api/scan?url=https://example.com
'use strict';

const dns = require('dns').promises;
const tls = require('tls');
const guard = require('../lib/guard');
const { domainInfo, dnsQuery } = require('../lib/domain');
const { safeFetch, resolvePublicHost } = require('../lib/network');
const { analyzeCsp, extractMetaCsp } = require('../lib/headers');

// ---------- SSRF guard ----------
async function assertSafeHost(hostname) {
  await resolvePublicHost(hostname);
}

async function timeoutFetch(url, opts = {}, ms = 8000) {
  return safeFetch(url, opts, ms);
}

// ---------- SSL-сертификат ----------
async function getCert(hostname, port = 443, ms = 3500) {
  const address = await resolvePublicHost(hostname);
  return new Promise((resolve) => {
    let done = false;
    const finish = (v) => { if (!done) { done = true; resolve(v); } };
    const socket = tls.connect({ host: address.address, port, servername: hostname, timeout: ms, rejectUnauthorized: false }, () => {
      const c = socket.getPeerCertificate();
      socket.end();
      if (!c || !c.valid_to) return finish(null);
      const days = Math.floor((new Date(c.valid_to).getTime() - Date.now()) / 86400000);
      finish({ issuer: (c.issuer && (c.issuer.O || c.issuer.CN)) || '—', validTo: c.valid_to, days,
        authorized: socket.authorized, authorizationError: socket.authorizationError || null,
        validFrom: c.valid_from || null, subject: c.subject?.CN || null, san: c.subjectaltname || null,
        fingerprint: c.fingerprint256 || null, protocol: socket.getProtocol(), cipher: socket.getCipher()?.name || null,
        host: hostname, port, address: address.address, checkedAt: new Date().toISOString() });
    });
    socket.on('error', () => finish(null));
    socket.on('timeout', () => { socket.destroy(); finish(null); });
  });
}

// ---------- DNS / email ----------
async function dnsChecks(hostname) {
  let d;
  try { d = domainInfo(hostname).domain; } catch { return { domain: hostname, spf: null, dmarc: null, mx: null, statuses: { spf: 'unavailable', dmarc: 'unavailable', mx: 'unavailable' } }; }
  const [spf, dmarc, mx] = await Promise.all([
    dnsQuery(() => dns.resolveTxt(d)), dnsQuery(() => dns.resolveTxt('_dmarc.' + d)), dnsQuery(() => dns.resolveMx(d)),
  ]);
  return { domain: d, spf: spf.values.map(p => p.join('')).find(r => /^v=spf1\b/i.test(r)) || null,
    dmarc: dmarc.values.map(p => p.join('')).find(r => /^v=DMARC1\b/i.test(r)) || null,
    mx: mx.values.map(m => m.exchange), statuses: { spf: spf.status, dmarc: dmarc.status, mx: mx.status } };
}

async function checkRedirect(hostname) {
  try {
    const r = await timeoutFetch('http://' + hostname, { method: 'GET', redirect: 'manual' }, 5000);
    const loc = r.headers.get('location') || '';
    return (r.status >= 300 && r.status < 400 && /^https:/i.test(loc));
  } catch { return null; }
}

// ---------- анализ заголовков ----------
function analyzeHeaders(h, isHttps, metaPolicies = []) {
  const get = (k) => h.get(k);
  const checks = [];
  const push = (id, category, title, status, detail, recommendation) =>
    checks.push({ id, category, title, status, detail, recommendation });

  const csp = get('content-security-policy');
  const hsts = get('strict-transport-security');
  const hstsAge = hsts && /(?:^|;)\s*max-age\s*=\s*(\d+)\s*(?:;|$)/i.exec(hsts);
  push('hsts', 'Transport', 'HSTS (Strict-Transport-Security)', !isHttps ? 'info' : hstsAge && Number(hstsAge[1]) > 0 ? 'pass' : 'warn',
    !isHttps ? 'Проверяется только на HTTPS' : hsts || 'Отсутствует',
    'Strict-Transport-Security: max-age=63072000; includeSubDomains; preload');
  const effectiveCsp = csp || metaPolicies[0];
  const cspInfo = analyzeCsp(effectiveCsp, get('content-security-policy-report-only'));
  push('csp', 'Headers', 'Content-Security-Policy', !effectiveCsp || cspInfo.issues.length ? 'warn' : 'info',
    effectiveCsp ? `${csp ? 'HTTP-заголовок' : 'HTML meta'}: ` + (cspInfo.issues.length ? cspInfo.issues.map(i => i.detail).join(' ') : 'политика найдена; слабые директивы из набора проверок не обнаружены') : cspInfo.reportOnly ? 'Есть только Report-Only: политика не блокирует нарушения' : 'Не найдена в заголовке и проверенном фрагменте HTML',
    'Настройте и проверьте CSP с учётом необходимых приложению источников.');
  const xfo = get('x-frame-options');
  const validXfo = /^(DENY|SAMEORIGIN)$/i.test((xfo || '').trim());
  const frameAncestors = csp && /(?:^|;)\s*frame-ancestors\s+([^;]+)/i.exec(csp);
  const validFrameAncestors = frameAncestors && !/(?:^|\s)(?:\*|https?:)(?:\s|$)/i.test(frameAncestors[1]);
  push('clickjacking', 'Headers', 'Защита от clickjacking', (frameAncestors ? validFrameAncestors : validXfo) ? 'pass' : 'warn',
    xfo ? `X-Frame-Options: ${xfo}` : frameAncestors ? `CSP frame-ancestors ${frameAncestors[1]}` : 'Нет защиты',
    'X-Frame-Options: DENY или CSP frame-ancestors \'none\'.');
  push('nosniff', 'Headers', 'X-Content-Type-Options', /nosniff/i.test(get('x-content-type-options') || '') ? 'pass' : 'fail',
    get('x-content-type-options') || 'Отсутствует', 'X-Content-Type-Options: nosniff');
  push('referrer', 'Headers', 'Referrer-Policy', get('referrer-policy') ? 'pass' : 'warn',
    get('referrer-policy') || 'Отсутствует', 'Referrer-Policy: strict-origin-when-cross-origin');
  push('permissions', 'Headers', 'Permissions-Policy', (get('permissions-policy') || get('feature-policy')) ? 'pass' : 'warn',
    (get('permissions-policy') || get('feature-policy')) ? 'Задана' : 'Отсутствует',
    'Ограничьте камеру/гео/микрофон через Permissions-Policy.');
  const acao = get('access-control-allow-origin');
  push('cors', 'CORS', 'CORS-заголовок главной страницы', 'info',
    acao ? `Access-Control-Allow-Origin: ${acao}` : 'Не задан',
    'Доступность чувствительных API из другого origin требует проверки отдельных эндпоинтов.');
  const leak = [];
  if (get('server') && /\d/.test(get('server'))) leak.push(`Server: ${get('server')}`);
  if (get('x-powered-by')) leak.push(`X-Powered-By: ${get('x-powered-by')}`);
  push('disclosure', 'Disclosure', 'Раскрытие версий ПО', leak.length ? 'warn' : 'pass',
    leak.length ? leak.join(' · ') : 'Версии скрыты', 'Скройте заголовки Server/X-Powered-By.');
  const cookieHeaders = typeof h.getSetCookie === 'function' ? h.getSetCookie() : [];
  if (cookieHeaders.length) {
    const insecure = cookieHeaders.filter(cookie => !/;\s*httponly(?:;|$)/i.test(cookie) ||
      !/;\s*secure(?:;|$)/i.test(cookie) || !/;\s*samesite\s*=\s*(strict|lax|none)(?:;|$)/i.test(cookie));
    push('cookies', 'Cookies', 'Флаги cookie', insecure.length ? 'warn' : 'pass',
      insecure.length ? `${insecure.length} из ${cookieHeaders.length} cookie без полного набора флагов` : `Проверено cookie: ${cookieHeaders.length}`,
      'Проверьте HttpOnly, Secure и SameSite для каждого cookie с учётом его назначения.');
  } else if (h.get('set-cookie')) {
    push('cookies', 'Cookies', 'Флаги cookie', 'info', 'Не удалось проверить каждый Set-Cookie отдельно', '—');
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
    if (!['http:', 'https:'].includes(target.protocol) || target.username || target.password)
      return res.status(400).json({ error: 'Только http/https без учётных данных в URL' });
    await assertSafeHost(target.hostname);

    if (await guard.rateLimited(req)) return res.status(429).json({ error: 'Слишком много запросов. Подождите минуту.' });
    const cacheKey = `scan:v3:${target.href}`;
    const cached = await guard.cacheGet(cacheKey);
    if (cached) return res.status(200).json({ ...cached, cached: true });

    const start = Date.now();
    const [resp, dnsInfo, redirects] = await Promise.all([
      timeoutFetch(target.href, { method: 'GET', headers: { 'User-Agent': 'KD-SEC-Scanner/2.0' } }),
      dnsChecks(target.hostname),
      checkRedirect(target.hostname),
    ]);
    const finalUrl = new URL(resp.url);
    const cert = finalUrl.protocol === 'https:' ? await getCert(finalUrl.hostname, Number(finalUrl.port || 443)) : null;
    const metaPolicies = /html/i.test(resp.headers.get('content-type') || '') ? extractMetaCsp(await resp.text()) : [];

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
      const st = !cert.authorized || cert.days < 0 ? 'fail' : cert.days < 30 ? 'warn' : 'pass';
      all.push({ id: 'ssl', category: 'Transport', title: 'SSL-сертификат',
        status: st, detail: `${cert.authorized ? 'Доверенная цепочка' : 'Ошибка проверки: ' + cert.authorizationError} · Издатель: ${cert.issuer} · истекает через ${cert.days} дн. (${cert.validTo})`,
        recommendation: !cert.authorized ? 'Проверьте имя хоста и цепочку сертификатов.' : cert.days < 30 ? 'Сертификат скоро истекает — обновите.' : 'В порядке.' });
    } else if (resp.url.startsWith('https://')) {
      all.push({ id: 'ssl', category: 'Transport', title: 'SSL-сертификат', status: 'info',
        detail: 'Не удалось проверить сертификат', recommendation: 'Проверьте сертификат отдельно.' });
    }
    all.push(...analyzeHeaders(resp.headers, resp.url.startsWith('https://'), metaPolicies));

    // Email / DNS
    all.push({ id: 'spf', category: 'Email/DNS', title: 'SPF-запись',
      status: dnsInfo.statuses.spf === 'unavailable' ? 'info' : !dnsInfo.spf ? 'warn' : /(?:^|\s)(?:\+)?all(?:\s|$)/i.test(dnsInfo.spf) ? 'fail' : 'info',
      detail: dnsInfo.statuses.spf === 'unavailable' ? 'DNS-источник недоступен' : dnsInfo.spf || 'Отсутствует',
      recommendation: dnsInfo.spf ? 'Проверьте механизмы SPF и итоговую политику; +all разрешает всем отправлять почту.' : 'Добавьте SPF для защиты от подделки писем.' });
    const dmarcPolicy = dnsInfo.dmarc && /(?:^|;)\s*p\s*=\s*(reject|quarantine|none)(?:\s*;|\s*$)/i.exec(dnsInfo.dmarc);
    all.push({ id: 'dmarc', category: 'Email/DNS', title: 'DMARC-запись',
      status: dnsInfo.statuses.dmarc === 'unavailable' ? 'info' : !dnsInfo.dmarc ? 'warn' : dmarcPolicy && /^(reject|quarantine)$/i.test(dmarcPolicy[1]) ? 'pass' : 'warn',
      detail: dnsInfo.statuses.dmarc === 'unavailable' ? 'DNS-источник недоступен' : dnsInfo.dmarc || 'Отсутствует',
      recommendation: dnsInfo.dmarc ? 'Проверьте политику p= и выравнивание SPF/DKIM.' : 'Добавьте _dmarc TXT-запись (v=DMARC1).' });
    all.push({ id: 'mx', category: 'Email/DNS', title: 'MX-записи',
      status: 'info', detail: dnsInfo.statuses.mx === 'unavailable' ? 'DNS-источник недоступен' : dnsInfo.mx?.length ? dnsInfo.mx.join(', ') : 'Нет почтовых серверов', recommendation: '—' });

    // security.txt + чувствительные файлы
    const sensitive = ['/.env', '/.git/HEAD', '/.git/config'];
    const exposed = [];
    let checked = 0;
    await Promise.all(sensitive.map(async (path) => {
      try {
        const r = await timeoutFetch(new URL(path, target.origin).href, { method: 'GET' }, 5000);
        const txt = (await r.text()).slice(0, 200);
        checked++;
        const signature = path === '/.env' ? /^\s*[A-Z_][A-Z0-9_]*\s*=/m.test(txt) : path === '/.git/HEAD' ? /^ref: refs\/|^[a-f0-9]{40}\s*$/i.test(txt.trim()) : /\[core\]/i.test(txt);
        if (r.status === 200 && signature && !/<html/i.test(txt)) exposed.push(path);
      } catch {}
    }));
    all.push({ id: 'files', category: 'Exposure', title: 'Открытые чувствительные файлы',
      status: exposed.length ? 'fail' : 'info',
      detail: exposed.length ? `Возможная экспозиция: ${exposed.join(', ')}` : checked === sensitive.length ? 'В проверенных путях не обнаружены; это не полная проверка' : `Удалось проверить ${checked} из ${sensitive.length} путей`,
      recommendation: exposed.length ? 'Подтвердите содержимое и закройте доступ к чувствительным файлам.' : '—' });
    let stxt = false;
    try {
      const r = await timeoutFetch(new URL('/.well-known/security.txt', target.origin).href, {}, 4000);
      stxt = r.status === 200 && /(?:^|\n)Contact:\s*\S+/im.test((await r.text()).slice(0, 10000));
    } catch {}
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

    const payload = {
      version: 3, target: target.href, finalUrl: resp.url, scannedAt: new Date().toISOString(),
      durationMs: Date.now() - start, grade, score: pct,
      response: { status: resp.status, address: resp.address, redirects: resp.redirects,
        headers: Object.fromEntries([...resp.headers.entries()].filter(([key]) => key !== 'set-cookie').map(([key, value]) => [key, value.slice(0, 2048)])) },
      tls: cert, dns: dnsInfo, csp: { ...analyzeCsp(resp.headers.get('content-security-policy') || metaPolicies[0], resp.headers.get('content-security-policy-report-only')),
        source: resp.headers.get('content-security-policy') ? 'HTTP-заголовок' : metaPolicies.length ? 'HTML meta (первые 32 КБ ответа)' : null,
        headerPolicy: resp.headers.get('content-security-policy'), metaPolicies },
      summary: {
        pass: all.filter(c => c.status === 'pass').length,
        warn: all.filter(c => c.status === 'warn').length,
        fail: all.filter(c => c.status === 'fail').length,
      },
      categories, checks: all,
    };
    await guard.cacheSet(cacheKey, payload, 600);
    return res.status(200).json(payload);
  } catch (e) {
    return res.status(400).json({ error: e.message || 'Ошибка сканирования' });
  }
};
