// KØZ: public breach intelligence. Passwords and phone numbers stay in the browser.
'use strict';
const guard = require('../lib/guard');
const { normalizeEmail, emailExposure, usernameSearch, breachCatalog } = require('../lib/exposure');
module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Используйте POST: личные данные не должны попадать в URL.' });
  }
  const started = Date.now();
  try {
    const { type, consent } = req.body || {};
    const q = typeof req.body?.q === 'string' ? req.body.q.trim() : '';
    if (!['email', 'username', 'breaches'].includes(type)) return res.status(400).json({ error: 'Неизвестный режим. Пароль и телефон проверяются локально.' });
    if (q.length > 254) return res.status(400).json({ error: 'Слишком длинное значение.' });
    let normalized = q;
    if (type === 'email') {
      normalized = normalizeEmail(q);
      if (consent !== true) return res.status(400).json({ error: 'Нужно согласие на передачу email в XposedOrNot.' });
    }
    if (type === 'username' && !/^[a-zA-Z0-9._-]{2,40}$/.test(q)) return res.status(400).json({ error: 'Ник: буквы A–Z, цифры, . _ - (2–40 символов).' });
    if (await guard.rateLimited(req)) return res.status(429).json({ error: 'Слишком много запросов. Подождите минуту.' });
    const result = type === 'email' ? await emailExposure(normalized) : type === 'username' ? await usernameSearch(normalized) : await breachCatalog();
    return res.status(200).json({ version: 4, tool: 'KØZ', type, query: type === 'breaches' ? null : normalized,
      scannedAt: new Date().toISOString(), durationMs: Date.now() - started, result });
  } catch (error) {
    return res.status(400).json({ error: error.code === 'INVALID_EMAIL' ? error.message : 'Не удалось выполнить проверку. Попробуйте позже.' });
  }
};
