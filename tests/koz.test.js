'use strict';
const assert = require('node:assert/strict');
const { test } = require('node:test');
const { webcrypto, createHash } = require('node:crypto');
const exposure = require('../lib/exposure');
const local = require('../js/koz-local');
const handler = require('../api/expose');
const missing = async () => { throw Object.assign(new Error('absent'), { code: 'ENODATA' }); };
const resolver = { resolveMx: missing, resolveTxt: missing };
const response = () => ({ code: 200, headers: {}, body: null, setHeader(k, v) { this.headers[k] = v; }, status(n) { this.code = n; return this; }, json(v) { this.body = v; return this; } });

test('KØZ validates email domains and preserves local-part casing', () => {
  assert.equal(exposure.normalizeEmail('Alice@EXAMPLE.com'), 'Alice@example.com');
  assert.equal(exposure.normalizeEmail('a@пример.рф'), 'a@xn--e1afmkfd.xn--p1ai');
  assert.throws(() => exposure.normalizeEmail('a@bad..example.com'));
  assert.throws(() => exposure.normalizeEmail('a@localhost'));
});
test('email DNS joins TXT chunks and inherits organizational DMARC only on absence', async () => {
  const queried = [];
  const dns = { resolveMx: async () => [{ exchange: '.', priority: 0 }], resolveTxt: async host => {
    queried.push(host);
    if (host === '_dmarc.mail.example.co.uk') return missing();
    if (host === '_dmarc.example.co.uk') return [['v=DMARC1;', ' p=reject']];
    return [['v=spf1 ', '-all']];
  } };
  const result = await exposure.emailDomain('a@mail.example.co.uk', dns);
  assert.equal(result.nullMx, true); assert.equal(result.spf[0], 'v=spf1 -all');
  assert.equal(result.policyDomain, 'example.co.uk'); assert.equal(result.dmarc[0], 'v=DMARC1; p=reject');
  assert.ok(queried.includes('_dmarc.example.co.uk'));
  const failed = await exposure.emailDomain('a@mail.example.co.uk', { resolveMx: missing, resolveTxt: async () => { throw Object.assign(new Error('timeout'), { code: 'ETIMEOUT' }); } });
  assert.equal(failed.statuses.dmarc, 'unavailable'); assert.equal(failed.policyDomain, 'mail.example.co.uk');
});
test('analytics normalizes incident metadata without exporting raw paste contents', async () => {
  const result = await exposure.emailExposure('test@example.com', async () => ({ status: 200, data: {
    BreachesSummary: { site: 'Old;New' }, ExposedBreaches: { breaches_details: [
      { breach: 'Old', xposed_date: '2015', xposed_data: 'Passwords;Email addresses', password_risk: 'plaintext', xposed_records: 123, verified: 'Yes', details: '<b>Incident</b>' },
      { breach: 'New', xposed_date: '2025', xposed_data: 'Phone numbers', password_risk: 'unknown' },
    ] }, PastesSummary: { cnt: 3 }, ExposedPastes: { secrets: 'DO NOT EXPORT' },
  } }), resolver);
  assert.equal(result.status, 'found'); assert.equal(result.count, 2); assert.equal(result.breaches[0].name, 'New');
  assert.equal(result.summary.plainTextBreaches, 1); assert.equal(result.breaches[1].description, 'Incident');
  assert.equal(result.pastes.count, 3); assert.ok(!JSON.stringify(result).includes('DO NOT EXPORT'));
  const details = Array.from({ length: 65 }, (_, i) => ({ breach: 'B' + i, xposed_date: String(1900 + i),
    xposed_data: 'Passwords', password_risk: i === 0 ? 'plaintext' : 'unknown' }));
  const capped = await exposure.emailExposure('test@example.com', async () => ({ status: 200, data: {
    BreachesSummary: { site: details.map(b => b.breach).join(';') }, ExposedBreaches: { breaches_details: details },
  } }), resolver);
  assert.equal(capped.breaches.length, 60); assert.equal(capped.count, 65);
  assert.equal(capped.summary.plainTextBreaches, 1); // Older incidents still contribute to the overall summary.
});
test('analytics errors use basic fallback and all failed sources remain unknown', async () => {
  let calls = 0;
  const fallback = await exposure.emailExposure('test@example.com', async () => {
    if (++calls === 1) throw new Error('timeout');
    return { status: 200, data: { breaches: [['Known', 'Known']] } };
  }, resolver);
  assert.equal(fallback.status, 'found'); assert.equal(fallback.analyticsStatus, 'unavailable'); assert.equal(fallback.count, 1);
  const failed = await exposure.emailExposure('test@example.com', async () => ({ status: 200, data: { Error: 'Rate limit' } }), resolver);
  assert.equal(failed.status, 'unavailable'); assert.equal(failed.count, null);
  const absent = await exposure.emailExposure('test@example.com', async () => ({ status: 200, data: { BreachesSummary: { site: '' }, ExposedBreaches: null } }), resolver);
  assert.equal(absent.status, 'not-found'); assert.equal(absent.count, 0);
});
test('catalog cap is explicit and recent cards are sorted by incident date', async () => {
  const rows = Array.from({ length: 405 }, (_, i) => ({ breachID: 'B' + i, breachedDate: String(2000 + i), exposedData: ['Emails'] }));
  const result = await exposure.breachCatalog(async () => ({ data: { exposedBreaches: rows } }));
  assert.equal(result.status, 'limited'); assert.equal(result.count, 405); assert.equal(result.breaches.length, 400);
  assert.equal(result.breaches[0].name, 'B404');
});
test('username outages and malformed responses do not become missing profiles', async () => {
  const result = await exposure.usernameSearch('test-user', async url => {
    if (url.includes('api.github')) throw Object.assign(new Error('limit'), { code: 'HTTP_403' });
    if (url.includes('gitlab')) return { status: 200, data: [{ username: 'different' }] };
    if (url.includes('firebaseio')) return { status: 200, data: { error: 'denied' } };
    throw new Error('must not check unsupported username formats');
  });
  assert.equal(result.auto.find(r => r.site === 'GitHub').status, 'unavailable');
  assert.equal(result.auto.find(r => r.site === 'GitLab').status, 'not-found');
  assert.equal(result.auto.find(r => r.site === 'Hacker News').status, 'unavailable');
  assert.equal(result.auto.find(r => r.site === 'Keybase').status, 'unsupported');
  assert.equal(result.manual.length, 10);
});
test('exact public profile matches retain available statistics only', async () => {
  const result = await exposure.usernameSearch('octocat', async url => {
    if (url.includes('api.github')) return { status: 200, data: { login: 'Octocat', name: '<b>Demo</b>', public_repos: 5, followers: 20, email: 'private@example.com' } };
    if (url.includes('keybase')) return { status: 200, data: { status: { code: 0 }, them: [null] } };
    return { status: 404, data: null };
  });
  assert.equal(result.summary.found, 1); assert.equal(result.auto[0].profile.metrics['Репозитории'], 5);
  assert.equal(result.auto[0].profile.name, 'Demo'); assert.ok(!JSON.stringify(result).includes('private@example.com'));
});
test('phone parser distinguishes Kazakhstan/Russia and invalid numbering plans locally', () => {
  const kz = local.phoneInfo('+7 701 234 5678'); const ru = local.phoneInfo('+7 926 123 4567');
  assert.equal(kz.valid, true); assert.equal(kz.country, 'KZ'); assert.equal(kz.type, 'MOBILE');
  assert.equal(ru.country, 'RU'); assert.equal(kz.rfc3966, 'tel:+77012345678');
  assert.equal(local.phoneInfo('+7 123 123 4567').valid, false);
  assert.equal(local.phoneInfo('Call +7 701 234 5678').valid, false);
  assert.equal(local.phoneInfo('87012345678', 'KZ').e164, '+77012345678');
});
test('password hash preserves whitespace and strength exports only pattern labels', async () => {
  const input = ' password ';
  assert.equal(await local.hashPassword(input, webcrypto.subtle), createHash('sha1').update(input).digest('hex').toUpperCase());
  const result = local.strength('password'); assert.equal(result.score, 0);
  assert.ok(!JSON.stringify(result).includes('"password"')); assert.throws(() => local.strength('x'.repeat(129)));
});
test('Pwned Passwords sends only five hash characters with padding and rejects failed responses', async () => {
  const hash = await local.hashPassword('password', webcrypto.subtle);
  const count = await local.pwnedCount(hash, null, async (url, options) => {
    assert.equal(url, 'https://api.pwnedpasswords.com/range/5BAA6');
    assert.equal(options.headers['Add-Padding'], 'true'); assert.equal(options.credentials, 'omit');
    return { ok: true, text: async () => hash.slice(5) + ':100\r\n' + '0'.repeat(35) + ':0' };
  });
  assert.equal(count, 100); assert.equal(local.parseRange('0'.repeat(35) + ':0', '0'.repeat(35)), 0);
  await assert.rejects(local.pwnedCount(hash, null, async () => ({ ok: false })), /недоступен/);
  assert.throws(() => local.parseRange('<html>Error</html>', hash.slice(5)));
});
test('exports always remove password/hash tokens and hide phone/profile identifiers by default', () => {
  const pw = local.exportReport({ version: 4, type: 'password', query: 'SECRET', hash: 'HASH', result: { status: 'found', count: 1,
    strength: { score: 0, length: 6, patterns: ['Повторы'], sequence: [{ token: 'SECRET' }] } } }, true);
  assert.ok(!JSON.stringify(pw).includes('SECRET')); assert.ok(!JSON.stringify(pw).includes('HASH'));
  const phone = local.exportReport({ type: 'phone', query: '+77012345678', result: local.phoneInfo('+77012345678') });
  assert.ok(!JSON.stringify(phone).includes('77012345678')); assert.equal(phone.result.country, 'KZ');
  const user = local.exportReport({ type: 'username', query: 'nickname', result: { auto: [{ url: 'https://github.com/nickname', profile: { username: 'nickname', name: 'Name', bio: 'Bio', metrics: {} } }], manual: [] } });
  assert.ok(!JSON.stringify(user).includes('nickname'));
});
test('API rejects GET personal queries, missing email consent and password/phone submissions', async () => {
  for (const req of [ { method: 'GET', query: { type: 'email', q: 'test@example.com' } },
    { method: 'POST', body: { type: 'email', q: 'test@example.com' } },
    { method: 'POST', body: { type: 'password', q: 'SECRET' } }, { method: 'POST', body: { type: 'phone', q: '+77012345678' } } ]) {
    const res = response(); await handler(req, res); assert.ok(res.code >= 400); assert.equal(res.headers['Cache-Control'], 'no-store');
    assert.ok(!JSON.stringify(res.body).includes('SECRET'));
  }
});
