'use strict';
const dns = require('node:dns').promises;
const { dnsQuery } = require('./domain');
const LIMITS = { names: 300, certificates: 60, pages: 3, dnsHosts: 30 };

async function publicJson(url, ms = 4000) {
  const response = await fetch(url, { signal: AbortSignal.timeout(ms), headers: { 'User-Agent': 'KD-SEC-OSINT/3.0', Accept: 'application/json' } });
  if (!response.ok) throw Object.assign(new Error('Источник недоступен'), { code: 'HTTP_' + response.status });
  // Public providers are fixed endpoints; cap JSON response sizes as well.
  const reader = response.body?.getReader();
  if (!reader) return response.json();
  const decoder = new TextDecoder(); let text = '', size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > 2 * 1024 * 1024) throw new Error('SOURCE_SIZE_LIMIT');
      text += decoder.decode(value, { stream: true });
    }
    return JSON.parse(text + decoder.decode());
  } finally { await reader.cancel().catch(() => {}); }
}
function inScope(name, domain) {
  return name === domain || name.endsWith('.' + domain);
}
function normalizeNames(names, domain) {
  return [...new Set(names.map(name => String(name).trim().toLowerCase().replace(/\.$/, ''))
    .filter(name => inScope(name.replace(/^\*\./, ''), domain) && /^(?:\*\.)?[a-z0-9.-]+$/.test(name)))].sort();
}
async function collectCertificates(domain, request = publicJson) {
  const names = new Set(), wildcards = new Set(), certificates = new Map();
  let pages = 0, cursor = '', status = 'limited', source = 'Cert Spotter', error = null;
  const started = Date.now();
  function collect(row, fallback = false) {
    const dnsNames = normalizeNames(fallback ? String(row.name_value || '').split('\n') : row.dns_names || [], domain);
    dnsNames.forEach(name => name.startsWith('*.') ? wildcards.add(name) : names.add(name));
    const id = String(row.tbs_sha256 || row.cert_sha256 || row.id || [dnsNames.join(','), row.not_after].join('|'));
    if (dnsNames.length && certificates.size < LIMITS.certificates) certificates.set(id, {
      id: (fallback ? 'crt.sh:' : 'certspotter:') + id,
      issuer: fallback ? row.issuer_name || null : row.issuer?.friendly_name || row.issuer?.name || null,
      dnsNames, validFrom: row.not_before || null, validTo: row.not_after || null,
      fingerprint: row.cert_sha256 || null, revoked: typeof row.revoked === 'boolean' ? row.revoked : null,
      source: fallback ? 'crt.sh' : 'Cert Spotter',
      sourceUrl: fallback && /^\d+$/.test(String(row.id)) ? `https://crt.sh/?id=${row.id}` : 'https://sslmate.com/ct_search_api/',
    });
  }
  try {
    for (let page = 0; page < LIMITS.pages; page++) {
      const remaining = 6500 - (Date.now() - started);
      if (remaining < 300) break;
      const url = new URL('https://api.certspotter.com/v1/issuances');
      url.searchParams.set('domain', domain); url.searchParams.set('include_subdomains', 'true');
      url.searchParams.append('expand', 'dns_names'); url.searchParams.append('expand', 'issuer');
      if (cursor) url.searchParams.set('after', cursor);
      const data = await request(url.href, Math.min(3000, remaining));
      if (!Array.isArray(data)) throw new Error('INVALID_CT_RESPONSE');
      pages++;
      if (!data.length) { status = 'ok'; break; }
      data.forEach(row => collect(row));
      const next = data[data.length - 1].id;
      if (!next || String(next) === cursor || names.size >= LIMITS.names) break;
      cursor = String(next);
    }
  } catch (e) { error = e.code || e.message; }
  if (!pages) {
    source = 'crt.sh';
    try {
      const data = await request(`https://crt.sh/?q=%25.${encodeURIComponent(domain)}&output=json`, 4500);
      if (!Array.isArray(data)) throw new Error('INVALID_CT_RESPONSE');
      data.forEach(row => collect(row, true)); pages = 1;
      status = names.size > LIMITS.names || data.length > LIMITS.certificates ? 'limited' : 'ok';
      error = null;
    } catch (e) { status = 'unavailable'; error = e.code || e.message; }
  }
  return { names: [...names].sort().slice(0, LIMITS.names), wildcards: [...wildcards].sort().slice(0, LIMITS.names),
    certificates: [...certificates.values()].sort((a, b) => String(b.validFrom).localeCompare(String(a.validFrom))),
    source, status, pages, error, observedNames: names.size, limits: LIMITS, checkedAt: new Date().toISOString() };
}
async function dnsRecords(host, resolver = dns) {
  const calls = {
    A: () => resolver.resolve4(host), AAAA: () => resolver.resolve6(host), CNAME: () => resolver.resolveCname(host),
    MX: async () => (await resolver.resolveMx(host)).map(r => `${r.exchange} (${r.priority})`),
    NS: () => resolver.resolveNs(host), TXT: async () => (await resolver.resolveTxt(host)).map(r => r.join('')),
    DMARC: async () => (await resolver.resolveTxt('_dmarc.' + host)).map(r => r.join('')).filter(r => /^v=DMARC1\b/i.test(r)),
    CAA: async () => (await resolver.resolveCaa(host)).map(r => `${r.critical ? 'critical ' : ''}${'issue' in r ? 'issue' : 'issuewild' in r ? 'issuewild' : 'iodef' in r ? 'iodef' : 'unknown'}: ${r.issue ?? r.issuewild ?? r.iodef ?? ''}`),
    SOA: async () => { const r = await resolver.resolveSoa(host); return [`${r.nsname} · ${r.hostmaster} · serial ${r.serial}`]; },
  };
  const values = {}, statuses = {};
  await Promise.all(Object.entries(calls).map(async ([type, call]) => {
    const result = await dnsQuery(call);
    values[type] = result.status === 'unavailable' ? null : result.values;
    statuses[type] = result.status;
  }));
  return { values, statuses, checkedAt: new Date().toISOString() };
}
async function buildInventory(hosts, source, resolver = dns) {
  const inventory = hosts.map(hostname => ({ hostname, source, state: 'unchecked', addresses: [], cname: [], checkedAt: null }));
  let next = 0;
  await Promise.all(Array.from({ length: 6 }, async () => {
    while (next < Math.min(inventory.length, LIMITS.dnsHosts)) {
      const asset = inventory[next++];
      const [a, aaaa, cname] = await Promise.all([
        dnsQuery(() => resolver.resolve4(asset.hostname)), dnsQuery(() => resolver.resolve6(asset.hostname)),
        dnsQuery(() => resolver.resolveCname(asset.hostname)),
      ]);
      asset.addresses = [...a.values, ...aaaa.values]; asset.cname = cname.values;
      asset.state = asset.addresses.length ? 'resolved' : [a, aaaa].some(r => r.status === 'unavailable') ? 'unavailable' : 'no-address';
      asset.checkedAt = new Date().toISOString();
    }
  }));
  return inventory;
}
async function networkInfo(ip, request = publicJson, resolver = dns) {
  const ptrPromise = dnsQuery(() => resolver.reverse(ip));
  try {
    const [ptr, result] = await Promise.all([ptrPromise, request(`https://stat.ripe.net/data/network-info/data.json?resource=${encodeURIComponent(ip)}`, 2500)]);
    if (!result.data || !Array.isArray(result.data.asns)) throw new Error('INVALID_RIPE_RESPONSE');
    return { ip, prefix: result.data.prefix || null, asns: result.data.asns, ptr: ptr.values,
      status: 'ok', source: 'RIPEstat', checkedAt: new Date().toISOString() };
  } catch { const ptr = await ptrPromise; return { ip, prefix: null, asns: [], ptr: ptr.values, status: 'unavailable', source: 'RIPEstat', checkedAt: new Date().toISOString() }; }
}
module.exports = { publicJson, collectCertificates, dnsRecords, buildInventory, networkInfo, LIMITS };
