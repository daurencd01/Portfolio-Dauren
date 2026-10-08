(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.KDReport = api;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';
  const STORAGE = 'kd-sec-history-v3';
  const TRACKED_HEADERS = new Set(['strict-transport-security', 'content-security-policy', 'content-security-policy-report-only',
    'x-frame-options', 'x-content-type-options', 'referrer-policy', 'permissions-policy', 'access-control-allow-origin',
    'access-control-allow-credentials', 'cross-origin-opener-policy', 'cross-origin-embedder-policy', 'cross-origin-resource-policy',
    'server', 'x-powered-by', 'cache-control', 'content-type', 'vary']);
  const esc = value => String(value == null ? '' : value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const canonical = values => [...new Set(values.map(v => typeof v === 'string' ? v : JSON.stringify(v)))].sort();
  function snapshot(kind, data) {
    const fields = {};
    const set = (key, label, values, complete = true) => { fields[key] = { label, values: canonical(values), complete }; };
    if (kind === 'osint') {
      Object.entries(data.dns || {}).forEach(([key, value]) => {
        if (Array.isArray(value) && data.dnsStatus?.[key] !== 'unavailable') set('dns:' + key, 'DNS ' + key, value);
      });
      const ct = data.certificateSearch;
      if (ct && ct.status !== 'unavailable') {
        set('names:' + ct.source, 'Имена из ' + ct.source, data.subdomains || [], ct.status === 'ok');
        set('certs:' + ct.source, 'Сертификаты из ' + ct.source, (data.certificates || []).map(c => c.id), false);
      }
      (data.inventory || []).filter(a => ['resolved', 'no-address'].includes(a.state)).forEach(a => {
        set('asset:' + a.hostname, 'IP ' + a.hostname, a.addresses);
        set('cname:' + a.hostname, 'CNAME ' + a.hostname, a.cname);
      });
    } else {
      Object.entries(data.response?.headers || {}).filter(([key]) => TRACKED_HEADERS.has(key)).forEach(([key, value]) => set('header:' + key, key, [value]));
      set('http:status', 'HTTP status', [String(data.response?.status || '')]);
      set('http:redirects', 'Цепочка редиректов', (data.response?.redirects || []).map(r => `${r.status} ${r.url} → ${r.location}`));
      if (data.tls?.fingerprint) set('tls:fingerprint', 'Отпечаток TLS-сертификата', [data.tls.fingerprint]);
      set('csp:meta', 'CSP в HTML meta', data.csp?.metaPolicies || []);
      for (const key of ['spf', 'dmarc', 'mx']) {
        if (data.dns?.statuses?.[key] !== 'unavailable') set('dns:' + key, key.toUpperCase(), [].concat(data.dns?.[key] || []));
      }
    }
    return { version: 3, kind, target: kind === 'osint' ? data.domain : data.target, scannedAt: data.scannedAt, fields };
  }
  function compare(before, after) {
    const changes = [];
    for (const key of new Set([...Object.keys(before.fields), ...Object.keys(after.fields)])) {
      if (key.startsWith('header:') && !TRACKED_HEADERS.has(key.slice(7))) continue;
      const a = before.fields[key], b = after.fields[key];
      // Missing/failed DNS or CT sources cannot establish a disappearance.
      if (!a || !b) {
        if (key.startsWith('header:')) {
          changes.push({ label: (b || a).label, added: b?.values || [], removed: a?.values || [] });
        }
        continue;
      }
      const added = b.values.filter(v => !a.values.includes(v));
      const removed = a.complete && b.complete ? a.values.filter(v => !b.values.includes(v)) : [];
      if (added.length || removed.length) changes.push({ label: b.label, added, removed });
    }
    return changes;
  }
  function csvCell(value) {
    let s = String(value == null ? '' : value);
    if (/^[\s]*[=+\-@]/.test(s)) s = "'" + s;
    return '"' + s.replace(/"/g, '""') + '"';
  }
  function csv(rows) { return '\uFEFF' + rows.map(row => row.map(csvCell).join(',')).join('\r\n'); }
  function download(filename, text, type) {
    const url = URL.createObjectURL(new Blob([text], { type }));
    const link = document.createElement('a'); link.href = url; link.download = filename;
    document.body.appendChild(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function exports(kind, data, container) {
    const name = (kind === 'osint' ? data.domain : new URL(data.target).hostname).replace(/[^a-z0-9.-]/gi, '_');
    const buttonJson = container.querySelector('[data-export-json]');
    const buttonCsv = container.querySelector('[data-export-csv]');
    buttonJson?.addEventListener('click', () => download(`${name}-${kind}.json`, JSON.stringify(data, null, 2), 'application/json'));
    buttonCsv?.addEventListener('click', () => {
      const rows = kind === 'osint' ? [['hostname', 'dns_state', 'addresses', 'cname', 'source', 'checked_at'],
        ...(data.inventory || []).map(a => [a.hostname, a.state, a.addresses.join('; '), a.cname.join('; '), a.source, a.checkedAt])]
        : [['check', 'category', 'status', 'evidence', 'recommendation'],
          ...(data.checks || []).map(c => [c.title, c.category, c.status, c.detail, c.recommendation])];
      download(`${name}-${kind}.csv`, csv(rows), 'text/csv;charset=utf-8');
    });
  }
  function history(kind, data, container) {
    const current = snapshot(kind, data);
    let saved, writable = true;
    try { saved = JSON.parse(localStorage.getItem(STORAGE) || '[]'); if (!Array.isArray(saved)) saved = []; }
    catch { saved = []; writable = false; }
    const previous = saved.filter(s => s.version === 3 && s.kind === kind && s.target === current.target && s.scannedAt !== current.scannedAt).slice(0, 4);
    try {
      saved = [current, ...saved.filter(s => !(s.kind === kind && s.target === current.target && s.scannedAt === current.scannedAt))].slice(0, 12);
      localStorage.setItem(STORAGE, JSON.stringify(saved));
    } catch { writable = false; }
    const panel = document.createElement('section'); panel.className = 'osint-card history-card';
    panel.innerHTML = `<h2>Сравнение проверок</h2><p class="muted">${writable ? 'Снимки хранятся только в этом браузере. Сравниваются наблюдаемые данные; изменение не означает атаку.' : 'Хранилище браузера недоступно; сравнение не сохраняется.'}</p>
      ${previous.length ? `<label class="report-select-label">Сравнить с <select data-history-select>${previous.map((s, i) => `<option value="${i}">${esc(new Date(s.scannedAt).toLocaleString())}</option>`).join('')}</select></label><div data-history-changes></div>` : '<p class="muted">Первый сохранённый снимок. Повторите проверку позже, чтобы увидеть изменения.</p>'}<button class="copy-btn" data-history-clear>Удалить историю этого адреса</button>`;
    container.appendChild(panel);
    panel.querySelector('[data-history-clear]').addEventListener('click', () => {
      try { localStorage.setItem(STORAGE, JSON.stringify(saved.filter(s => !(s.kind === kind && s.target === current.target))));
        panel.innerHTML = '<h2>Сравнение проверок</h2><p class="muted">История этого адреса удалена из браузера.</p>'; } catch {}
    });
    if (!previous.length) return;
    const render = () => {
      let changes = [];
      try { changes = compare(previous[Number(panel.querySelector('[data-history-select]').value)], current); } catch { /* Ignore an invalid old snapshot. */ }
      panel.querySelector('[data-history-changes]').innerHTML = changes.length ? changes.map(c => `<div class="diff-item"><b>${esc(c.label)}</b>${c.added.map(v => `<div class="diff-added">+ ${esc(v)}</div>`).join('')}${c.removed.map(v => `<div class="diff-removed">− ${esc(v)}</div>`).join('')}</div>`).join('') : '<p class="muted">В сравнимых данных изменений не найдено. Недоступные и неполные источники не доказывают исчезновение активов.</p>';
    };
    panel.querySelector('[data-history-select]').addEventListener('change', render);
    render();
  }
  return { esc, snapshot, compare, csv, exports, history };
});
