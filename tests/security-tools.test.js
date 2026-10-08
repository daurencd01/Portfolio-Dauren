'use strict';
const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { domainInfo } = require('../lib/domain');
const { collectCertificates, dnsRecords, buildInventory } = require('../lib/intelligence');
const { analyzeCsp, extractMetaCsp } = require('../lib/headers');
const report = require('../js/tool-report');

function mockNetwork(lookup, request) {
  const module = { exports: {} };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../lib/network.js'), 'utf8'), {
    module, URL, Headers, AbortController, TextDecoder, setTimeout, clearTimeout,
    require(id) {
      if (id === 'node:dns') return { promises: { lookup } };
      if (id === './domain') return require('../lib/domain');
      if (id === 'undici') return { Agent: class { constructor(options) { this.options = options; } async close() {} }, fetch: request };
      return require(id);
    },
  });
  return module.exports;
}
const httpResponse = (status, headers = {}) => ({ status, headers: new Headers(headers), body: { cancel: async () => {}, getReader: () => ({ read: async () => ({ done: true }), cancel: async () => {} }) } });

test('Public Suffix List scopes co.uk and shared hosting correctly', () => {
  assert.equal(domainInfo('https://www.example.co.uk/path').domain, 'example.co.uk');
  assert.equal(domainInfo('tenant.vercel.app').domain, 'tenant.vercel.app');
  assert.equal(domainInfo('tenant.vercel.app').registeredDomain, 'vercel.app');
  assert.throws(() => domainInfo('co.uk'));
  assert.throws(() => domainInfo('bad..example.com'));
});
test('scanner blocks a redirect to loopback before sending the request', async () => {
  const requested = [];
  const network = mockNetwork(async () => [{ address: '93.184.215.14', family: 4 }], async url => {
    requested.push(url);
    return httpResponse(302, { location: 'http://127.0.0.1/private' });
  });
  await assert.rejects(network.safeFetch('https://example.com/'), /Приватный|локальный/);
  assert.equal(requested.length, 1);
});
test('HTTP connection pins the validated address and never performs a second DNS lookup', async () => {
  let lookups = 0;
  const network = mockNetwork(async () => { lookups++; return [{ address: lookups === 1 ? '93.184.215.14' : '127.0.0.1', family: 4 }]; }, async (_url, options) => {
    options.dispatcher.options.connect.lookup('example.com', {}, (error, address, family) => {
      assert.equal(error, null); assert.equal(address, '93.184.215.14'); assert.equal(family, 4);
    });
    return httpResponse(200);
  });
  const response = await network.safeFetch('https://example.com/');
  assert.equal(lookups, 1); assert.equal(response.address, '93.184.215.14');
});
test('mixed public/private DNS and mapped IPv6 are rejected', async () => {
  const network = mockNetwork(async () => [{ address: '93.184.215.14', family: 4 }, { address: '10.0.0.1', family: 4 }], async () => { throw new Error('must not request'); });
  await assert.rejects(network.safeFetch('https://example.com/'), /Приватный/);
  assert.equal(network.isPublicIp('::ffff:127.0.0.1'), false);
  assert.equal(network.isPublicIp('2001:db8::1'), false);
  assert.equal(network.isPublicIp('2001:0000::1'), false);
  assert.equal(network.isPublicIp('2001:4860:4860::8888'), true);
  assert.equal(network.isPublicIp('2606:4700::1111'), true);
});
test('CT pagination retains names from later pages and separates wildcard names', async () => {
  const requests = [];
  const result = await collectCertificates('example.com', async url => {
    requests.push(url);
    const after = new URL(url).searchParams.get('after');
    if (!after) return [{ id: '1', dns_names: ['a.example.com', 'evil-example.com', '*.example.com'], issuer: { friendly_name: 'Test CA' } }];
    if (after === '1') return [{ id: '2', dns_names: ['b.example.com'], not_after: '2030-01-01' }];
    return [];
  });
  assert.deepEqual(result.names, ['a.example.com', 'b.example.com']);
  assert.deepEqual(result.wildcards, ['*.example.com']);
  assert.equal(result.status, 'ok'); assert.equal(result.pages, 3);
  assert.equal(result.certificates.length, 2); assert.equal(requests.length, 3);
});
test('CT rate limiting retains partial data and does not pretend collection is complete', async () => {
  let calls = 0;
  const result = await collectCertificates('example.com', async () => {
    if (++calls > 1) throw Object.assign(new Error('rate limit'), { code: 'HTTP_429' });
    return [{ id: '1', dns_names: ['a.example.com'] }];
  });
  assert.equal(result.status, 'limited'); assert.deepEqual(result.names, ['a.example.com']);
  assert.equal(result.error, 'HTTP_429');
});
test('crt.sh fallback returns certificate evidence if primary source fails', async () => {
  const result = await collectCertificates('example.com', async url => {
    if (url.includes('certspotter')) throw new Error('offline');
    return [{ id: 123, name_value: 'example.com\na.example.com', issuer_name: 'Test CA', not_after: '2030-01-01' }];
  });
  assert.equal(result.source, 'crt.sh'); assert.equal(result.certificates[0].sourceUrl, 'https://crt.sh/?id=123');
  assert.deepEqual(result.names, ['a.example.com', 'example.com']);
});
test('DNS distinguishes absent data from failed sources and joins TXT chunks', async () => {
  const absent = async () => { throw Object.assign(new Error('absent'), { code: 'ENODATA' }); };
  const resolver = { resolve4: async () => ['93.184.215.14'], resolve6: absent, resolveCname: absent,
    resolveMx: absent, resolveNs: async () => { throw Object.assign(new Error('failure'), { code: 'ESERVFAIL' }); },
    resolveTxt: async () => [['v=DMARC1;', ' p=reject']], resolveCaa: async () => [{ critical: 0, issue: 'letsencrypt.org' }], resolveSoa: absent };
  const result = await dnsRecords('example.com', resolver);
  assert.equal(result.values.DMARC[0], 'v=DMARC1; p=reject'); assert.equal(result.values.CAA[0], 'issue: letsencrypt.org');
  assert.equal(result.statuses.AAAA, 'absent'); assert.deepEqual(result.values.AAAA, []);
  assert.equal(result.statuses.NS, 'unavailable'); assert.equal(result.values.NS, null);
});
test('inventory makes only DNS queries and caps enrichment at 30 hosts', async () => {
  let calls = 0;
  const resolver = { resolve4: async () => { calls++; return ['93.184.215.14']; }, resolve6: async () => [], resolveCname: async () => [] };
  const result = await buildInventory(Array.from({ length: 35 }, (_, i) => `host${i}.example.com`), 'test', resolver);
  assert.equal(calls, 30); assert.equal(result[29].state, 'resolved'); assert.equal(result[30].state, 'unchecked');
});
test('CSP detects broad scripts and report-only without misclassifying nonce plus unsafe-inline', () => {
  const weak = analyzeCsp("default-src https:; script-src * 'unsafe-eval' 'unsafe-inline'");
  assert.ok(weak.issues.some(i => i.code === 'unsafe-eval')); assert.ok(weak.issues.some(i => i.code === 'unsafe-inline'));
  const nonce = analyzeCsp("script-src 'nonce-abc' 'unsafe-inline'; base-uri 'self'; object-src 'none'");
  assert.equal(nonce.issues.some(i => i.code === 'unsafe-inline'), false);
  assert.equal(analyzeCsp(null, "default-src 'self'").policy, null);
});
test('meta-CSP is detected regardless of attribute order and ignores comments or script strings', () => {
  const html = `<head><!-- <meta http-equiv="Content-Security-Policy" content="fake"> --><script>const fake = '<meta http-equiv="Content-Security-Policy" content="fake">';</script><meta content="default-src 'self'; object-src 'none'" http-equiv="Content-Security-Policy"></head>`;
  assert.deepEqual(extractMetaCsp(html), ["default-src 'self'; object-src 'none'"]);
});
test('comparison does not report disappearing names when CT is partial or unavailable', () => {
  const data = { domain: 'example.com', scannedAt: '2026-10-08', dns: {}, inventory: [], certificates: [], certificateSearch: { source: 'test', status: 'ok' }, subdomains: ['a.example.com', 'b.example.com'] };
  const before = report.snapshot('osint', data);
  const partial = report.snapshot('osint', { ...data, certificateSearch: { source: 'test', status: 'limited' }, subdomains: ['a.example.com', 'c.example.com'] });
  const changes = report.compare(before, partial);
  assert.deepEqual(changes[0].added, ['c.example.com']); assert.deepEqual(changes[0].removed, []);
  assert.deepEqual(report.compare(before, report.snapshot('osint', { ...data, certificateSearch: { source: 'test', status: 'unavailable' }, subdomains: null })), []);
});
test('comparison shows changed HTTP headers and CSV export neutralizes spreadsheet formulas', () => {
  const data = { target: 'https://example.com/', response: { status: 200, headers: { server: 'old' }, redirects: [] } };
  const changes = report.compare(report.snapshot('scanner', data), report.snapshot('scanner', { ...data, response: { ...data.response, headers: { server: 'new' } } }));
  assert.deepEqual(changes[0].added, ['new']); assert.deepEqual(changes[0].removed, ['old']);
  assert.match(report.csv([['=1+1', 'safe']]), /'=/);
});
test('comparison ignores volatile request IDs and response dates', () => {
  const data = { target: 'https://example.com/', response: { status: 200, headers: { date: 'old', 'x-vercel-id': 'old', server: 'same' }, redirects: [] } };
  const after = { ...data, response: { ...data.response, headers: { date: 'new', 'x-vercel-id': 'new', server: 'same' } } };
  assert.deepEqual(report.compare(report.snapshot('scanner', data), report.snapshot('scanner', after)), []);
  const oldSnapshot = report.snapshot('scanner', data);
  oldSnapshot.fields['header:date'] = { label: 'date', values: ['old'], complete: true };
  assert.deepEqual(report.compare(oldSnapshot, report.snapshot('scanner', after)), []);
});
