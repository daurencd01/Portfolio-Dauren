'use strict';
const dns = require('node:dns').promises;
const net = require('node:net');
const { Agent, fetch } = require('undici');
const { bounded } = require('./domain');
const blockedIpv6 = new net.BlockList();
for (const [address, prefix] of [['2001::', 32], ['2001:db8::', 32], ['2001:2::', 48], ['2001:10::', 28], ['2001:20::', 28], ['2002::', 16]])
  blockedIpv6.addSubnet(address, prefix, 'ipv6');

function isPublicIp(ip) {
  if (net.isIPv4(ip)) {
    const [a, b, c] = ip.split('.').map(Number);
    return !(a === 0 || a === 10 || a === 127 || a >= 224 ||
      (a === 100 && b >= 64 && b <= 127) || (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) || (a === 192 && (b === 168 || b === 0)) ||
      (a === 198 && (b === 18 || b === 19 || b === 51 && c === 100)) ||
      (a === 203 && b === 0 && c === 113));
  }
  // Conservative: global unicast only; reject mapped IPv4, local and transition ranges.
  return net.isIPv6(ip) && /^2[0-9a-f]{3}:/i.test(ip) && !blockedIpv6.check(ip, 'ipv6');
}
async function resolvePublicHost(hostname) {
  const host = hostname.replace(/^\[|\]$/g, '');
  const addresses = net.isIP(host) ? [{ address: host, family: net.isIP(host) }] : await bounded(dns.lookup(host, { all: true }), 2000);
  if (!addresses.length || addresses.some(a => !isPublicIp(a.address)))
    throw new Error('Приватный/локальный или служебный адрес запрещён');
  return addresses[0];
}
async function safeFetch(value, options = {}, ms = 7000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  const redirects = [];
  let url = new URL(value);
  try {
    for (let hop = 0; hop <= 4; hop++) {
      if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password)
        throw new Error('Недопустимый URL или редирект');
      const address = await resolvePublicHost(url.hostname);
      // The connection uses this validated address rather than resolving the host again.
      const dispatcher = new Agent({ connect: { lookup(_host, opts, callback) {
        callback(null, opts.all ? [address] : address.address, address.family);
      } } });
      try {
        const response = await fetch(url.href, { ...options, redirect: 'manual', signal: controller.signal, dispatcher });
        const location = response.headers.get('location');
        if ([301, 302, 303, 307, 308].includes(response.status) && location && options.redirect !== 'manual') {
          const next = new URL(location, url);
          redirects.push({ url: url.href, status: response.status, location: next.href });
          await response.body?.cancel();
          url = next;
          continue;
        }
        let text = '';
        if (response.body) {
          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let size = 0;
          try {
            while (size < 32768) {
              const { done, value: chunk } = await reader.read();
              if (done) break;
              const piece = chunk.subarray(0, 32768 - size);
              size += piece.length; text += decoder.decode(piece, { stream: true });
            }
            text += decoder.decode();
          } finally { await reader.cancel().catch(() => {}); }
        }
        return { status: response.status, headers: response.headers, url: url.href,
          redirects, address: address.address, text: async () => text };
      } finally { await dispatcher.close(); }
    }
    throw new Error('Слишком много перенаправлений');
  } finally { clearTimeout(timer); }
}
module.exports = { isPublicIp, resolvePublicHost, safeFetch };
