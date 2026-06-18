// OSINT Lookup — frontend (passive public-data intelligence)
(function () {
  'use strict';
  const form = document.getElementById('osintForm');
  const input = document.getElementById('osintDomain');
  const btn = document.getElementById('osintBtn');
  const status = document.getElementById('osintStatus');
  const out = document.getElementById('osintResults');

  const STEPS = [
    'Resolving DNS records',
    'Querying RDAP / WHOIS registry',
    'Looking up IP & hosting (ASN)',
    'Searching Certificate Transparency logs',
    'Querying Wayback Machine archive',
    'Aggregating intelligence',
  ];
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function rows(obj) {
    return Object.entries(obj).filter(([, v]) => v != null && v !== '' && !(Array.isArray(v) && !v.length))
      .map(([k, v]) => `<div class="info-row"><span class="ik">${esc(k)}</span><span class="iv">${Array.isArray(v) ? v.map(esc).join('<br>') : esc(v)}</span></div>`).join('');
  }
  function card(icon, title, inner) { return `<div class="osint-card"><h2>${icon} ${esc(title)}</h2>${inner || '<div class="muted">Данные недоступны</div>'}</div>`; }

  async function runTerminal(termEl, stopRef) {
    let html = '';
    for (let i = 0; i < STEPS.length; i++) {
      if (stopRef.done && i > 1) break;
      html += `<div class="t-line"><span class="t-arrow">›</span> ${STEPS[i]}<span class="t-ok">  [ok]</span></div>`;
      termEl.innerHTML = html + '<div class="t-line t-cursor">_</div>';
      await sleep(240 + Math.random() * 200);
    }
  }

  function ageStr(days) {
    if (days == null) return null;
    const y = Math.floor(days / 365), m = Math.floor((days % 365) / 30);
    return `${y} лет ${m} мес (${days} дн.)`;
  }

  function render(d) {
    // WHOIS
    const w = d.whois;
    const whois = w ? rows({
      'Регистратор': w.registrar, 'Создан': w.created ? w.created.slice(0, 10) : null,
      'Возраст': ageStr(w.ageDays), 'Истекает': w.expires ? w.expires.slice(0, 10) : null,
      'Статус': w.status, 'NS-серверы': w.nameservers,
    }) : '';
    // DNS
    const dnsObj = d.dns || {};
    const dnsInner = rows({ 'A': dnsObj.A, 'AAAA': dnsObj.AAAA, 'MX': dnsObj.MX, 'NS': dnsObj.NS, 'TXT': dnsObj.TXT });
    // IP
    const ip = d.ip;
    const ipInner = ip ? rows({
      'IP': ip.ip, 'Хостинг / ASN': ip.org,
      'Локация': [ip.city, ip.region, ip.country].filter(Boolean).join(', '), 'Reverse DNS': ip.hostname,
    }) : '';
    // Subdomains
    const subs = d.subdomains;
    const subInner = subs && subs.length
      ? `<div class="muted">Найдено в Certificate Transparency: <b style="color:var(--neon-blue)">${subs.length}</b></div><div class="tag-list">${subs.map(s => `<span class="tag">${esc(s)}</span>`).join('')}</div>`
      : (subs ? '<div class="muted">Поддомены не найдены</div>' : '');
    // Wayback
    const wb = d.wayback;
    const wbInner = wb && (wb.first || wb.last)
      ? `<div class="stats"><div class="stat"><b>${esc(wb.first || '—')}</b><span>первый снимок</span></div><div class="stat"><b>${esc(wb.last || '—')}</b><span>последний снимок</span></div></div><div class="muted" style="margin-top:10px">Сайт присутствует в веб-архиве</div>`
      : (wb ? '<div class="muted">Архивных снимков нет</div>' : '');

    out.innerHTML = `
      <div class="osint-head-card">
        <div class="dom">${esc(d.domain)}</div>
        <div class="sub">OSINT-сводка по открытым данным · ${d.durationMs} мс · ${new Date(d.scannedAt).toLocaleString()}</div>
        <button class="dl-btn" onclick="window.print()">⬇ Скачать отчёт (PDF)</button>
      </div>
      <div class="osint-grid">
        ${card('🌐', 'WHOIS / Регистрация', whois)}
        ${card('🗂️', 'DNS-записи', dnsInner)}
        ${card('🖥️', 'Хостинг / IP', ipInner)}
        ${card('🕰️', 'Wayback Machine', wbInner)}
      </div>
      ${card('🔎', 'Поддомены (Certificate Transparency)', subInner)}`;
    out.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  async function lookup(domain) {
    btn.disabled = true; status.className = 'scan-status'; status.textContent = '';
    out.innerHTML = `<div class="terminal"><div class="term-bar"><i></i><i></i><i></i><span>osint://${esc(domain)}</span></div><div class="term-body" id="oterm"></div></div>`;
    const stopRef = { done: false };
    const anim = runTerminal(document.getElementById('oterm'), stopRef);
    try {
      const r = await fetch('/api/osint?domain=' + encodeURIComponent(domain));
      const data = await r.json();
      stopRef.done = true; await anim;
      if (!r.ok || data.error) throw new Error(data.error || 'Ошибка запроса');
      render(data);
    } catch (e) {
      stopRef.done = true; out.innerHTML = '';
      status.className = 'scan-status err'; status.textContent = '✖ ' + e.message;
    } finally { btn.disabled = false; }
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const v = input.value.trim();
    if (v) lookup(v);
  });
})();
