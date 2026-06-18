// Vercel Serverless Function — Exposure Check (Have-I-Been-Pwned style)
// Проверка СВОИХ данных по публичным базам. Email-утечки, поиск ника, валидация телефона.
// (Проверка пароля делается на стороне браузера через k-anonymity — на сервер не приходит.)
//
// GET /api/expose?type=email|username|phone&q=<значение>
'use strict';

function tf(url, ms = 7000, opts = {}) {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), ms);
  return fetch(url, { ...opts, signal: ac.signal, headers: { 'User-Agent': 'KD-SEC-Expose/1.0', ...(opts.headers || {}) } })
    .finally(() => clearTimeout(t));
}

// ---------- Email в утечках (XposedOrNot) ----------
async function emailBreaches(email) {
  const r = await tf(`https://api.xposedornot.com/v1/check-email/${encodeURIComponent(email)}`, 9000);
  if (r.status === 404) return { found: false, count: 0, breaches: [] };
  if (!r.ok) throw new Error('Сервис проверки временно недоступен');
  const d = await r.json();
  const list = (d.breaches && Array.isArray(d.breaches[0])) ? d.breaches[0] : [];
  return { found: list.length > 0, count: list.length, breaches: list.slice(0, 60) };
}

// ---------- Поиск ника по сайтам (Sherlock-стиль) ----------
const BROWSER_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36';
// Авто-проверка: только источники с надёжной детекцией (API 200/404, JSON или маркер в HTML).
const SITES = [
  { name: 'GitHub', url: u => `https://github.com/${u}`,
    check: async u => (await tf(`https://api.github.com/users/${u}`, 6000)).status === 200 },
  { name: 'Hacker News', url: u => `https://news.ycombinator.com/user?id=${u}`,
    check: async u => { const r = await tf(`https://hacker-news.firebaseio.com/v0/user/${u}.json`, 6000); return (await r.text()) !== 'null'; } },
  { name: 'Dev.to', url: u => `https://dev.to/${u}`,
    check: async u => (await tf(`https://dev.to/api/users/by_username?url=${u}`, 6000)).status === 200 },
  { name: 'Keybase', url: u => `https://keybase.io/${u}`,
    check: async u => { try { const r = await tf(`https://keybase.io/_/api/1.0/user/lookup.json?usernames=${u}`, 6000); const d = await r.json(); return !!(d.them && d.them[0]); } catch { return false; } } },
  { name: 'Telegram', url: u => `https://t.me/${u}`,
    check: async u => { try { const r = await tf(`https://t.me/${u}`, 6000, { headers: { 'User-Agent': BROWSER_UA } }); return /tgme_page_title/.test(await r.text()); } catch { return false; } } },
  { name: 'YouTube', url: u => `https://www.youtube.com/@${u}`,
    check: async u => { try { return (await tf(`https://www.youtube.com/@${u}`, 6000, { headers: { 'User-Agent': BROWSER_UA } })).status === 200; } catch { return false; } } },
];
// Соцсети, блокирующие серверную проверку (login-стена / 200 на любой URL) —
// для них честнее дать прямую ссылку «открыть и проверить вручную».
const MANUAL = [
  { name: 'Instagram', url: u => `https://www.instagram.com/${u}/` },
  { name: 'X (Twitter)', url: u => `https://x.com/${u}` },
  { name: 'TikTok', url: u => `https://www.tiktok.com/@${u}` },
  { name: 'Facebook', url: u => `https://www.facebook.com/${u}` },
  { name: 'Reddit', url: u => `https://www.reddit.com/user/${u}` },
  { name: 'VK', url: u => `https://vk.com/${u}` },
  { name: 'Twitch', url: u => `https://www.twitch.tv/${u}` },
  { name: 'Pinterest', url: u => `https://www.pinterest.com/${u}/` },
];
async function usernameSearch(u) {
  const auto = await Promise.all(SITES.map(async s => {
    try { return { site: s.name, url: s.url(u), found: await s.check(u) }; }
    catch { return { site: s.name, url: s.url(u), found: false, error: true }; }
  }));
  const manual = MANUAL.map(s => ({ site: s.name, url: s.url(u) }));
  return { auto, manual };
}

// ---------- Телефон: базовая валидация + страна ----------
const CODES = [
  ['1', 'США / Канада'], ['7', 'Россия / Казахстан'], ['20', 'Египет'], ['27', 'ЮАР'],
  ['33', 'Франция'], ['34', 'Испания'], ['39', 'Италия'], ['44', 'Великобритания'], ['49', 'Германия'],
  ['81', 'Япония'], ['82', 'Южная Корея'], ['86', 'Китай'], ['90', 'Турция'], ['91', 'Индия'],
  ['380', 'Украина'], ['971', 'ОАЭ'], ['994', 'Азербайджан'], ['995', 'Грузия'], ['996', 'Кыргызстан'], ['998', 'Узбекистан'],
];
function phoneInfo(raw) {
  const digits = raw.replace(/[^\d]/g, '');
  if (digits.length < 7 || digits.length > 15) return { valid: false, reason: 'Длина номера вне диапазона E.164 (7–15 цифр)' };
  let country = '—';
  for (const [code, name] of [...CODES].sort((a, b) => b[0].length - a[0].length)) {
    if (digits.startsWith(code)) { country = name; break; }
  }
  return { valid: true, e164: '+' + digits, country, digits: digits.length,
    note: 'Базовая проверка формата/страны. Детальная (оператор, тип линии) требует платных сервисов.' };
}

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  try {
    const type = (req.query && req.query.type) || '';
    let q = (req.query && req.query.q) || '';
    if (Array.isArray(q)) q = q[0];
    q = String(q).trim();
    if (!q) return res.status(400).json({ error: 'Параметр ?q= обязателен' });

    if (type === 'email') {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(q)) return res.status(400).json({ error: 'Некорректный email' });
      return res.status(200).json({ type, query: q, result: await emailBreaches(q.toLowerCase()) });
    }
    if (type === 'username') {
      if (!/^[a-zA-Z0-9._-]{2,40}$/.test(q)) return res.status(400).json({ error: 'Ник: только буквы, цифры, . _ - (2–40)' });
      return res.status(200).json({ type, query: q, result: await usernameSearch(q) });
    }
    if (type === 'phone') {
      if (!/^[\d\s()+-]{7,25}$/.test(q)) return res.status(400).json({ error: 'Некорректный номер' });
      return res.status(200).json({ type, query: q, result: phoneInfo(q) });
    }
    return res.status(400).json({ error: 'Неизвестный type (email|username|phone)' });
  } catch (e) {
    return res.status(400).json({ error: e.message || 'Ошибка проверки' });
  }
};
