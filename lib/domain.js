'use strict';
const { parse } = require('tldts');
const { domainToASCII } = require('node:url');

function domainInfo(value) {
  let host = String(value || '').trim();
  if (/^https?:\/\//i.test(host)) {
    const url = new URL(host);
    if (url.username || url.password) throw new Error('Введите домен без учётных данных');
    host = url.hostname;
  }
  host = domainToASCII(host.replace(/\.$/, '').toLowerCase());
  if (!host || host.length > 253 || !host.split('.').every(label => /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i.test(label)))
    throw new Error('Некорректный домен');
  const scoped = parse(host, { allowPrivateDomains: true });
  const registered = parse(host);
  if (!scoped.domain || scoped.isIp) throw new Error('Введите полный домен, например example.com');
  return { hostname: host, domain: scoped.domain, registeredDomain: registered.domain,
    publicSuffix: scoped.publicSuffix, privateSuffix: !!scoped.isPrivate };
}

async function bounded(promise, ms = 1800) {
  let timer;
  try { return await Promise.race([promise, new Promise((_, reject) => {
    timer = setTimeout(() => reject(Object.assign(new Error('DNS timeout'), { code: 'ETIMEOUT' })), ms);
  })]); } finally { clearTimeout(timer); }
}
async function dnsQuery(fn) {
  try { return { status: 'ok', values: await bounded(Promise.resolve().then(fn)) }; }
  catch (error) { return { status: ['ENODATA', 'ENOTFOUND'].includes(error.code) ? 'absent' : 'unavailable', values: [], error: error.code || 'DNS_ERROR' }; }
}
module.exports = { domainInfo, bounded, dnsQuery };
