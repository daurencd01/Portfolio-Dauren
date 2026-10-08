'use strict';
function analyzeCsp(policy, reportOnly = null) {
  const directives = {};
  for (const part of String(policy || '').split(';')) {
    const [name, ...values] = part.trim().split(/\s+/);
    if (name && !(name.toLowerCase() in directives)) directives[name.toLowerCase()] = values;
  }
  const issues = [];
  const script = directives['script-src-elem'] || directives['script-src'] || directives['default-src'];
  if (policy && !script) issues.push({ code: 'script-policy', detail: 'Нет script-src или default-src: выполнение скриптов не ограничено этой политикой.' });
  if (script) {
    if ((directives['script-src'] || directives['default-src'] || []).includes("'unsafe-eval'")) issues.push({ code: 'unsafe-eval', detail: 'unsafe-eval разрешает динамическое выполнение строк как кода.' });
    if (script.includes("'unsafe-inline'") && !script.some(v => /^'(?:nonce-|sha(?:256|384|512)-)/.test(v)))
      issues.push({ code: 'unsafe-inline', detail: 'unsafe-inline без nonce/hash разрешает встроенные скрипты.' });
    if (script.some(v => ['*', 'http:', 'https:', 'data:'].includes(v)))
      issues.push({ code: 'broad-script', detail: 'Разрешён широкий источник скриптов. Проверьте, нужен ли он приложению.' });
  }
  if (policy && !directives['base-uri']) issues.push({ code: 'base-uri', detail: 'Не задан base-uri: проверьте необходимость ограничения элемента base.' });
  if (policy && !directives['object-src'] && !directives['default-src'])
    issues.push({ code: 'object-src', detail: 'Нет ограничения object-src/default-src.' });
  return { policy: policy || null, reportOnly, directives, issues,
    scope: 'Эвристический разбор заголовка; не подтверждает эксплуатацию XSS.' };
}
function extractMetaCsp(html) {
  const head = String(html).split(/<\/head\s*>/i)[0].replace(/<!--[\s\S]*?-->/g, '').replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, '');
  const policies = [];
  for (const tag of head.match(/<meta\b[^>]*>/gi) || []) {
    const attrs = {};
    for (const match of tag.matchAll(/([\w-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)) attrs[match[1].toLowerCase()] = match[2] ?? match[3] ?? match[4];
    if (attrs['http-equiv']?.toLowerCase() === 'content-security-policy' && attrs.content)
      policies.push(attrs.content.replace(/&quot;/g, '"').replace(/&apos;|&#39;/g, "'").replace(/&amp;/g, '&'));
  }
  return policies;
}
module.exports = { analyzeCsp, extractMetaCsp };
