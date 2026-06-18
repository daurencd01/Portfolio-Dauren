// Общий помощник: rate-limiting + кэш через Upstash Redis (REST).
// Активируется автоматически, если заданы переменные окружения:
//   UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN
// Если их нет — все функции работают как no-op (ничего не ломают).
'use strict';

// Поддерживаем оба варианта имён (Upstash-интеграция и Vercel KV)
const URL = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
const ENABLED = !!(URL && TOKEN);

const LIMIT = 20;     // запросов в минуту с одного IP
const WINDOW = 60;    // секунд

async function cmd(args, ms = 2500) {
  if (!ENABLED) return null;
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), ms);
  try {
    const r = await fetch(URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(args),
      signal: ac.signal,
    });
    if (!r.ok) return null;
    const d = await r.json();
    return d.result;
  } catch { return null; } finally { clearTimeout(t); }
}

function clientIp(req) {
  const xff = (req.headers && (req.headers['x-forwarded-for'] || req.headers['x-real-ip'])) || '';
  return String(xff).split(',')[0].trim() || 'unknown';
}

// true => превышен лимит (надо вернуть 429). Без стора всегда false.
async function rateLimited(req) {
  if (!ENABLED) return false;
  const ip = clientIp(req);
  const key = `rl:${ip}`;
  const n = await cmd(['INCR', key]);
  if (n === null) return false;          // стор недоступен — не блокируем
  if (n === 1) await cmd(['EXPIRE', key, String(WINDOW)]);
  return n > LIMIT;
}

// Кэш: get возвращает распарсенный объект или null.
async function cacheGet(key) {
  if (!ENABLED) return null;
  const v = await cmd(['GET', key]);
  if (!v) return null;
  try { return JSON.parse(v); } catch { return null; }
}
async function cacheSet(key, obj, ttl = 600) {
  if (!ENABLED) return;
  try { await cmd(['SET', key, JSON.stringify(obj), 'EX', String(ttl)]); } catch {}
}

module.exports = { rateLimited, cacheGet, cacheSet, ENABLED };
