// Public-source domain intelligence. No target HTTP probes or port scanning.
'use strict';
const guard = require('../lib/guard');
const { domainInfo } = require('../lib/domain');
const { publicJson, collectCertificates, dnsRecords, buildInventory, networkInfo, LIMITS } = require('../lib/intelligence');
const { isPublicIp } = require('../lib/network');

async function registration(domain) {
  try {
    const d = await publicJson(`https://rdap.org/domain/${domain}`, 4500);
    const events = Object.fromEntries((d.events || []).map(e => [e.eventAction, e.eventDate]));
    const registrar = (d.entities || []).find(e => (e.roles || []).includes('registrar'));
    const created = events.registration || null;
    return { registrar: registrar?.vcardArray?.[1]?.find(r => r[0] === 'fn')?.[3] || registrar?.handle || null,
      created, expires: events.expiration || null, updated: events.lastChanged || events['last update of RDAP database'] || null,
      ageDays: created ? Math.floor((Date.now() - new Date(created).getTime()) / 86400000) : null,
      status: (d.status || []).slice(0, 10), nameservers: (d.nameservers || []).map(n => n.ldhName).filter(Boolean), domain };
  } catch { return null; }
}
async function archive(domain) {
  const query = async timestamp => {
    try {
      const d = await publicJson(`https://archive.org/wayback/available?url=${encodeURIComponent(domain)}&timestamp=${timestamp}`, 3000);
      const snapshot = d.archived_snapshots?.closest;
      return snapshot?.timestamp ? { date: `${snapshot.timestamp.slice(0, 4)}-${snapshot.timestamp.slice(4, 6)}-${snapshot.timestamp.slice(6, 8)}`, url: snapshot.url } : null;
    } catch { return undefined; }
  };
  const [early, recent] = await Promise.all([query('19960101'), query('29990101')]);
  if (early === undefined && recent === undefined) return null;
  // Availability returns closest snapshots; these are not guaranteed first/last captures.
  return { first: early?.date || null, last: recent?.date || null, archived: !!(early || recent),
    earlyUrl: early?.url || null, recentUrl: recent?.url || null };
}
module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  if (req.method && req.method !== 'GET') return res.status(405).json({ error: 'Только GET' });
  try {
    let raw = req.query?.domain || req.query?.url || '';
    if (Array.isArray(raw)) raw = raw[0];
    const scope = domainInfo(raw);
    if (await guard.rateLimited(req)) return res.status(429).json({ error: 'Слишком много запросов. Подождите минуту.' });
    const cacheKey = `osint:v3:${scope.hostname}`;
    const cached = await guard.cacheGet(cacheKey);
    if (cached) return res.status(200).json({ ...cached, cached: true });
    const start = Date.now();
    const [whois, rootDns, ct, wayback] = await Promise.all([
      registration(scope.registeredDomain), dnsRecords(scope.hostname), collectCertificates(scope.domain), archive(scope.hostname),
    ]);
    const addresses = [...(rootDns.values.A || []), ...(rootDns.values.AAAA || [])];
    if (addresses.some(ip => !isPublicIp(ip))) return res.status(400).json({ error: 'Приватный/локальный адрес запрещён' });
    const names = [...new Set([scope.hostname, ...ct.names])];
    const inventory = await buildInventory(names, ct.source);
    // The requested hostname is an explicit input, not necessarily a CT finding.
    inventory[0].source = ct.names.includes(scope.hostname) ? ct.source : 'Введённый домен';
    const uniqueIps = [...new Set(inventory.flatMap(asset => asset.addresses))].filter(isPublicIp);
    const networks = await Promise.all(uniqueIps.slice(0, 3).map(ip => networkInfo(ip)));
    const checkedAt = new Date().toISOString();
    const payload = {
      version: 3, domain: scope.hostname, apex: scope.domain, scope, scannedAt: checkedAt, durationMs: Date.now() - start,
      whois, dns: rootDns.values, dnsStatus: rootDns.statuses, dnsCheckedAt: rootDns.checkedAt,
      subdomains: ct.status === 'unavailable' ? null : ct.names, inventory, certificates: ct.certificates,
      certificateSearch: { ...ct, names: undefined, certificates: undefined }, networks, wayback,
      summary: { names: ct.names.length, resolved: inventory.filter(a => a.state === 'resolved').length,
        dnsChecked: inventory.filter(a => a.checkedAt).length, addresses: uniqueIps.length, certificates: ct.certificates.length },
      limits: LIMITS,
      sources: [
        { name: 'DNS resolver', status: Object.values(rootDns.statuses).some(s => s === 'unavailable') ? 'limited' : 'ok', checkedAt: rootDns.checkedAt },
        { name: 'RDAP', status: whois ? 'ok' : 'unavailable', url: `https://rdap.org/domain/${scope.registeredDomain}`, checkedAt },
        { name: ct.source, status: ct.status, url: ct.source === 'crt.sh' ? `https://crt.sh/?q=%25.${scope.domain}` : 'https://sslmate.com/ct_search_api/', checkedAt: ct.checkedAt },
        { name: 'Wayback Machine', status: wayback ? 'ok' : 'unavailable', url: `https://web.archive.org/web/*/${scope.hostname}`, checkedAt },
        { name: 'RIPEstat', status: networks.some(n => n.status === 'ok') ? uniqueIps.length > networks.length ? 'limited' : 'ok' : 'unavailable', url: 'https://stat.ripe.net/', checkedAt },
      ],
    };
    await guard.cacheSet(cacheKey, payload, 600);
    return res.status(200).json(payload);
  } catch (e) { return res.status(400).json({ error: e.message || 'Ошибка OSINT-запроса' }); }
};
