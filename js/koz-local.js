(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('libphonenumber-js/max'), require('zxcvbn'));
  else root.KOZLocal = factory(root.libphonenumber, root.zxcvbn);
})(typeof window !== 'undefined' ? window : globalThis, function (phones, estimator) {
  'use strict';
  const PATTERNS = { dictionary: 'Словарные слова / распространённые пароли', spatial: 'Клавиатурные комбинации', repeat: 'Повторы',
    sequence: 'Последовательности', date: 'Даты', regex: 'Предсказуемые числа' };
  function phoneInfo(raw, defaultCountry = 'KZ') {
    if (!/^[+\d\s().-]{5,35}$/.test(raw)) return { valid: false, possible: false, reason: 'Введите один номер без добавочного, например +7 701 234 5678.' };
    let phone;
    try { phone = phones.parsePhoneNumberWithError(raw.trim(), { defaultCountry, extract: false }); }
    catch { return { valid: false, possible: false, reason: 'Не удалось разобрать номер. Укажите код страны или выберите регион.' }; }
    return { valid: phone.isValid(), possible: phone.isPossible(), e164: phone.number, international: phone.formatInternational(),
      national: phone.formatNational(), rfc3966: phone.getURI(), country: phone.country || null, callingCode: phone.countryCallingCode,
      type: phone.getType() || 'UNKNOWN', nonGeographic: phone.isNonGeographic(), digits: phone.number.replace(/\D/g, '').length,
      defaultCountry: raw.trim().startsWith('+') ? null : defaultCountry,
      reason: phone.isValid() ? null : 'Номер не соответствует плану нумерации в локальных метаданных.' };
  }
  function strength(password) {
    if ([...password].length > 128) throw new Error('Для оценки используйте пароль до 128 символов.');
    const result = estimator(password);
    return { score: result.score, length: [...password].length,
      patterns: [...new Set(result.sequence.map(m => PATTERNS[m.pattern]).filter(Boolean))] };
  }
  async function hashPassword(password, subtle = crypto.subtle) {
    const buffer = await subtle.digest('SHA-1', new TextEncoder().encode(password));
    return [...new Uint8Array(buffer)].map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
  }
  function parseRange(body, suffix) {
    const lines = body.split(/\r?\n/).map(v => /^([A-F\d]{35}):(\d+)$/i.exec(v.trim())).filter(Boolean);
    if (!lines.length) throw new Error('Источник вернул нераспознанный ответ.');
    const match = lines.find(line => line[1].toUpperCase() === suffix.toUpperCase());
    const count = match ? Number(match[2]) : 0;
    if (!Number.isSafeInteger(count)) throw new Error('Некорректное число в ответе источника.');
    return count;
  }
  async function pwnedCount(hash, signal, request = fetch) {
    const response = await request('https://api.pwnedpasswords.com/range/' + hash.slice(0, 5), {
      headers: { 'Add-Padding': 'true' }, credentials: 'omit', cache: 'no-store', referrerPolicy: 'no-referrer',
      signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(9000)]) : AbortSignal.timeout(9000),
    });
    if (!response.ok) throw new Error('Pwned Passwords временно недоступен.');
    const body = await response.text();
    if (body.length > 1024 * 1024) throw new Error('Ответ источника слишком большой.');
    return parseRange(body, hash.slice(5));
  }
  const mask = (kind, value) => kind === 'email' ? '•••@' + String(value).split('@').pop() : kind === 'phone' ? '••••' + String(value).replace(/\D/g, '').slice(-4) : '•••';
  function exportReport(data, showIdentity = false) {
    if (data.type === 'password') return { version: data.version, tool: 'KØZ', type: 'password', scannedAt: data.scannedAt,
      result: { status: data.result.status, count: data.result.count, strength: { score: data.result.strength.score,
        length: data.result.strength.length, patterns: data.result.strength.patterns } } };
    const report = JSON.parse(JSON.stringify(data));
    if (!showIdentity && report.type !== 'breaches') {
      report.query = '[hidden]';
      if (report.type === 'phone') for (const key of ['e164', 'international', 'national', 'rfc3966']) delete report.result[key];
      if (report.type === 'username') [...(report.result.auto || []), ...(report.result.manual || [])].forEach(row => {
        delete row.url;
        if (row.profile) { delete row.profile.username; delete row.profile.name; delete row.profile.bio; }
      });
    }
    return report;
  }
  return { phoneInfo, strength, hashPassword, parseRange, pwnedCount, mask, exportReport };
});
