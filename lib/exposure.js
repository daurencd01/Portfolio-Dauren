'use strict';
const dns = require('node:dns').promises;
const { domainToASCII } = require('node:url');
const { domainInfo, dnsQuery } = require('./domain');
const LIMITS = { matchedBreaches: 60, catalog: 400, responseBytes: 2 * 1024 * 1024 };
const PROVIDERS = new Set(['api.xposedornot.com', 'api.github.com', 'gitlab.com', 'hacker-news.firebaseio.com', 'dev.to', 'keybase.io']);
const text = (value, max = 1600) => typeof value === 'string' ? value.replace(/<[^>]*>/g, '').slice(0, max) : '';
const number = value => value != null && Number.isFinite(Number(value)) && Number(value) >= 0 ? Number(value) : null;
const split = value => (Array.isArray(value) ? value : typeof value === 'string' ? value.split(/[;,]/) : []).map(v => text(v, 120).trim()).filter(Boolean);
const yes = value => value === true || /^yes$/i.test(value);
const timestamp = value => {
  const date = typeof value === 'number' ? new Date(value * 1000) : new Date(value);
  return value != null && !Number.isNaN(date.valueOf()) ? date.toISOString() : null;
};
function normalizeEmail(value) {
  const match = /^([^\s@]{1,64})@([^\s@]+)$/.exec(value);
  if (!match) throw Object.assign(new Error('Введите корректный email.'), { code: 'INVALID_EMAIL' });
  const domain = domainToASCII(match[2].toLowerCase());
  try { domainInfo(domain); } catch { throw Object.assign(new Error('Проверьте домен email.'), { code: 'INVALID_EMAIL' }); }
  if (value.length > 254 || /[\x00-\x1f\x7f]/.test(value)) throw Object.assign(new Error('Введите корректный email.'), { code: 'INVALID_EMAIL' });
  return match[1] + '@' + domain;
}
async function requestJson(url, ms = 6500) {
  const target = new URL(url);
  if (target.protocol !== 'https:' || !PROVIDERS.has(target.hostname)) throw new Error('INVALID_PROVIDER');
  const response = await fetch(target, { redirect: 'error', signal: AbortSignal.timeout(ms),
    headers: { 'User-Agent': 'KOZ-Security/4.0', Accept: 'application/json' } });
  if (response.status === 404) return { status: 404, data: null };
  if (!response.ok) throw Object.assign(new Error('PROVIDER_UNAVAILABLE'), { code: 'HTTP_' + response.status });
  const reader = response.body.getReader(), decoder = new TextDecoder(); let body = '', size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read(); if (done) break;
      size += value.length; if (size > LIMITS.responseBytes) throw new Error('SOURCE_SIZE_LIMIT');
      body += decoder.decode(value, { stream: true });
    }
    return { status: response.status, data: JSON.parse(body + decoder.decode()) };
  } finally { await reader.cancel().catch(() => {}); }
}
function normalizeBreach(row) {
  const date = text(row.breachedDate || row.xposed_date, 40);
  return { name: text(row.breachID || row.breach, 140), domain: text(row.domain, 254), date: date || null,
    year: /^\d{4}/.test(date) ? Number(date.slice(0, 4)) : null, addedAt: text(row.addedDate, 40) || null,
    description: text(row.exposureDescription || row.details), dataClasses: split(row.exposedData || row.xposed_data),
    records: number(row.exposedRecords ?? row.xposed_records), industry: text(row.industry, 120),
    passwordRisk: text(row.passwordRisk || row.password_risk, 40) || 'unknown',
    verified: row.verified == null ? null : yes(row.verified), reference: text(row.referenceURL || row.references, 600) || null };
}
function aggregateBreaches(rows) {
  const years = {}, classes = new Set(); let plain = 0, weak = 0;
  for (const row of rows) {
    row.dataClasses.forEach(c => classes.add(c));
    if (row.year) years[row.year] = (years[row.year] || 0) + 1;
    if (/^plaintext$/i.test(row.passwordRisk)) plain++;
    if (/^easytocrack$/i.test(row.passwordRisk)) weak++;
  }
  return { dataClasses: [...classes].sort(), years, plainTextBreaches: plain, weakHashBreaches: weak };
}
async function emailDomain(email, resolver = dns) {
  const domain = email.split('@')[1], scope = domainInfo(domain).domain;
  const [mx, txt, initialDmarc] = await Promise.all([
    dnsQuery(() => resolver.resolveMx(domain)), dnsQuery(() => resolver.resolveTxt(domain)),
    dnsQuery(() => resolver.resolveTxt('_dmarc.' + domain)),
  ]);
  let dmarc = initialDmarc, policyDomain = domain;
  if (dmarc.status === 'absent' && scope !== domain) {
    dmarc = await dnsQuery(() => resolver.resolveTxt('_dmarc.' + scope)); policyDomain = scope;
  }
  const spf = txt.values.map(chunks => chunks.join('')).filter(v => /^v=spf1\b/i.test(v));
  const dmarcValues = dmarc.values.map(chunks => chunks.join('')).filter(v => /^v=DMARC1\b/i.test(v));
  return { domain, policyDomain, mx: mx.values.map(r => ({ exchange: r.exchange, priority: r.priority })),
    nullMx: mx.values.some(r => r.exchange === '.' || r.exchange === ''), spf, dmarc: dmarcValues,
    statuses: { mx: mx.status, spf: txt.status === 'unavailable' ? 'unavailable' : spf.length ? 'ok' : 'absent',
      dmarc: dmarc.status === 'unavailable' ? 'unavailable' : dmarcValues.length ? 'ok' : 'absent' },
    checkedAt: new Date().toISOString() };
}
async function emailExposure(email, request = requestJson, resolver = dns) {
  const domainPromise = emailDomain(email, resolver);
  let status = 'unavailable', rows = [], count = null, analyticsStatus = 'unavailable', pastes = null, error = null;
  try {
    const response = await request('https://api.xposedornot.com/v1/breach-analytics?email=' + encodeURIComponent(email));
    if (response.status === 404) { status = 'not-found'; count = 0; analyticsStatus = 'ok'; }
    else {
      const data = response.data;
      if (!data || !data.BreachesSummary || typeof data.BreachesSummary.site !== 'string' ||
          (data.ExposedBreaches != null && !Array.isArray(data.ExposedBreaches.breaches_details))) throw new Error('INVALID_ANALYTICS');
      const details = data.ExposedBreaches?.breaches_details || [];
      const names = [...new Set([...split(data.BreachesSummary.site), ...details.map(b => text(b.breach, 140))].filter(Boolean))];
      const normalized = new Map(details.map(b => { const row = normalizeBreach(b); return [row.name, row]; }));
      rows = names.map(name => normalized.get(name) || normalizeBreach({ breach: name }));
      count = rows.length; status = count ? 'found' : 'not-found'; analyticsStatus = count > LIMITS.matchedBreaches ? 'limited' : 'ok';
      pastes = data.PastesSummary ? { count: number(data.PastesSummary.cnt), lastSeen: text(data.PastesSummary.tmpstmp, 60) || null } : null;
    }
  } catch (e) {
    error = e.code || e.message;
    try {
      const response = await request('https://api.xposedornot.com/v1/check-email/' + encodeURIComponent(email));
      if (response.status === 404 || response.data?.Error === 'Not found') { status = 'not-found'; count = 0; }
      else if (Array.isArray(response.data?.breaches?.[0])) {
        const names = [...new Set(response.data.breaches[0].filter(v => typeof v === 'string'))];
        rows = names.map(name => normalizeBreach({ breach: name })); count = rows.length; status = count ? 'found' : 'not-found';
      } else throw new Error('INVALID_BREACH_RESPONSE');
    } catch (fallback) { error = fallback.code || fallback.message; }
  }
  rows.sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
  const selected = rows.slice(0, LIMITS.matchedBreaches);
  return { status, count, breaches: selected, analyticsStatus, summary: aggregateBreaches(rows), pastes,
    mailDomain: await domainPromise, source: 'XposedOrNot', sourceUrl: 'https://xposedornot.com/api_doc',
    checkedAt: new Date().toISOString(), error, limits: LIMITS };
}
let catalogCache;
async function breachCatalog(request = requestJson) {
  if (request === requestJson && catalogCache && Date.now() - catalogCache.at < 900000) return { ...catalogCache.result, cached: true };
  try {
    const { data } = await request('https://api.xposedornot.com/v1/breaches', 8000);
    if (!Array.isArray(data?.exposedBreaches)) throw new Error('INVALID_CATALOG');
    const normalized = data.exposedBreaches.map(normalizeBreach).filter(row => row.name)
      .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
    const breaches = normalized.slice(0, LIMITS.catalog);
    const result = { status: normalized.length > LIMITS.catalog ? 'limited' : 'ok', count: normalized.length, breaches,
      summary: aggregateBreaches(breaches), source: 'XposedOrNot', sourceUrl: 'https://xposedornot.com/api_doc',
      checkedAt: new Date().toISOString(), cached: false, limits: LIMITS };
    if (request === requestJson) catalogCache = { at: Date.now(), result };
    return result;
  } catch (error) { return { status: 'unavailable', count: null, breaches: [], source: 'XposedOrNot',
    sourceUrl: 'https://xposedornot.com/api_doc', checkedAt: new Date().toISOString(), error: error.code || error.message, limits: LIMITS }; }
}
const AUTO = [
  { name: 'GitHub', category: 'Код', valid: /^[a-z\d](?:[a-z\d-]{0,37}[a-z\d])?$/i, url: u => `https://github.com/${u}`,
    endpoint: u => `https://api.github.com/users/${u}`, parse: (d, u) => d && typeof d.login === 'string' && d.login.toLowerCase() === u.toLowerCase()
      ? { username: d.login, name: text(d.name, 120), bio: text(d.bio, 500), createdAt: timestamp(d.created_at),
        metrics: { 'Репозитории': number(d.public_repos), 'Подписчики': number(d.followers), 'Подписки': number(d.following) } } : null },
  { name: 'GitLab', category: 'Код', valid: /^[a-z\d_][a-z\d_.-]{1,39}$/i, url: u => `https://gitlab.com/${u}`,
    endpoint: u => `https://gitlab.com/api/v4/users?username=${u}`, parse: (d, u) => {
      if (!Array.isArray(d)) throw new Error('INVALID_PROFILE');
      const row = d.find(v => typeof v.username === 'string' && v.username.toLowerCase() === u.toLowerCase());
      return row ? { username: row.username, name: text(row.name, 120), bio: '', metrics: {} } : null;
    } },
  { name: 'Hacker News', category: 'Сообщество', valid: /^[a-z\d_-]{2,40}$/i, url: u => `https://news.ycombinator.com/user?id=${u}`,
    endpoint: u => `https://hacker-news.firebaseio.com/v0/user/${u}.json`, parse: (d, u) => d?.id === u
      ? { username: d.id, name: '', bio: text(d.about, 500), createdAt: timestamp(d.created), metrics: { 'Карма': number(d.karma), 'Публикации': Array.isArray(d.submitted) ? d.submitted.length : null } } : null },
  { name: 'DEV Community', category: 'Сообщество', valid: /^[a-z\d_]{2,30}$/i, url: u => `https://dev.to/${u}`,
    endpoint: u => `https://dev.to/api/users/by_username?url=${u}`, parse: (d, u) => typeof d?.username === 'string' && d.username.toLowerCase() === u.toLowerCase()
      ? { username: d.username, name: text(d.name, 120), bio: text(d.summary, 500), createdAt: timestamp(d.joined_at), metrics: {} } : null },
  { name: 'Keybase', category: 'Идентичность', valid: /^[a-z\d_]{2,16}$/i, url: u => `https://keybase.io/${u}`,
    endpoint: u => `https://keybase.io/_/api/1.0/user/lookup.json?usernames=${u}&fields=basics,profile`, parse: (d, u) => {
      if (d?.status?.code !== 0 || !Array.isArray(d.them)) throw new Error('INVALID_PROFILE');
      const row = d.them.find(v => v?.basics?.username?.toLowerCase() === u.toLowerCase());
      return row ? { username: row.basics.username, name: text(row.profile?.full_name, 120), bio: text(row.profile?.bio, 500), createdAt: timestamp(row.basics.ctime), metrics: {} } : null;
    } },
];
const MANUAL = [
  ['Telegram', 'Соцсеть', u => `https://t.me/${u}`], ['YouTube', 'Медиа', u => `https://www.youtube.com/@${u}`],
  ['Instagram', 'Соцсеть', u => `https://www.instagram.com/${u}/`], ['X', 'Соцсеть', u => `https://x.com/${u}`],
  ['TikTok', 'Медиа', u => `https://www.tiktok.com/@${u}`], ['Reddit', 'Сообщество', u => `https://www.reddit.com/user/${u}`],
  ['Twitch', 'Медиа', u => `https://www.twitch.tv/${u}`], ['Pinterest', 'Медиа', u => `https://www.pinterest.com/${u}/`],
  ['Medium', 'Сообщество', u => `https://medium.com/@${u}`], ['VK', 'Соцсеть', u => `https://vk.com/${u}`],
];
async function usernameSearch(username, request = requestJson) {
  const auto = await Promise.all(AUTO.map(async site => {
    const row = { site: site.name, category: site.category, url: site.url(encodeURIComponent(username)), checkedAt: new Date().toISOString(), profile: null };
    if (!site.valid.test(username)) return { ...row, status: 'unsupported', evidence: 'Формат ника не поддерживается этим источником.' };
    try {
      const { status, data } = await request(site.endpoint(encodeURIComponent(username)));
      if (status === 404) return { ...row, status: 'not-found', evidence: 'API ответил HTTP 404.' };
      const profile = site.parse(data, username);
      if (!profile && site.name === 'GitHub') throw new Error('INVALID_PROFILE');
      if (!profile && site.name === 'Hacker News' && data !== null) throw new Error('INVALID_PROFILE');
      if (!profile && site.name === 'DEV Community') throw new Error('INVALID_PROFILE');
      return { ...row, profile, status: profile ? 'found' : 'not-found', evidence: profile ? 'Точное совпадение имени в публичном API.' : 'API не вернул совпадение.' };
    } catch (error) { return { ...row, status: 'unavailable', evidence: error.code === 'HTTP_429' || error.code === 'HTTP_403' ? 'Лимит или ограничение доступа источника.' : 'Ответ недоступен или не распознан.' }; }
  }));
  return { auto, manual: MANUAL.map(([site, category, url]) => ({ site, category, url: url(encodeURIComponent(username)), status: 'manual' })),
    summary: { found: auto.filter(r => r.status === 'found').length, notFound: auto.filter(r => r.status === 'not-found').length,
      unavailable: auto.filter(r => r.status === 'unavailable').length, unsupported: auto.filter(r => r.status === 'unsupported').length },
    checkedAt: new Date().toISOString() };
}
module.exports = { normalizeEmail, normalizeBreach, aggregateBreaches, emailDomain, emailExposure, breachCatalog, usernameSearch, requestJson, LIMITS };
