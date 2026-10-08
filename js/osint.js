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
  const report = window.KDReport;
  const esc = report.esc;
  const states = { resolved: 'Есть IP', 'no-address': 'Нет A/AAAA', unavailable: 'DNS недоступен', unchecked: 'Не проверено' };
  const sourceStates = { ok: 'Получены данные', limited: 'Частично', unavailable: 'Недоступен' };
  const safeUrl = value => { try { const u = new URL(value); return ['https:', 'http:'].includes(u.protocol) ? u.href : '#'; } catch { return '#'; } };
  function rows(obj) {
    return Object.entries(obj).filter(([, v]) => v != null && v !== '' && !(Array.isArray(v) && !v.length))
      .map(([k, v]) => `<div class="info-row"><span class="ik">${esc(k)}</span><span class="iv">${Array.isArray(v) ? v.map(esc).join('<br>') : esc(v)}</span></div>`).join('');
  }
  function card(icon, title, inner) { return `<div class="osint-card"><h2>${icon} ${esc(title)}</h2>${inner || '<div class="muted">Данные недоступны</div>'}</div>`; }

  async function runTerminal(termEl, stopRef) {
    let html = '';
    for (let i = 0; i < STEPS.length; i++) {
      if (stopRef.done && i > 1) break;
      html += `<div class="t-line"><span class="t-arrow">›</span> ${STEPS[i]}<span class="t-ok">  […]</span></div>`;
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
    const dnsInner = rows(Object.fromEntries(['A', 'AAAA', 'CNAME', 'MX', 'NS', 'TXT', 'DMARC', 'CAA', 'SOA'].map(type => [type, dnsObj[type]?.length ? dnsObj[type] : d.dnsStatus?.[type] === 'unavailable' ? 'Источник недоступен' : 'Запись не найдена'])));
    const networks = d.networks || [];
    const ipInner = networks.map(n => `<div class="network-detail">${rows({ IP: n.ip, 'Префикс': n.prefix, ASN: n.asns.map(a => 'AS' + a), PTR: n.ptr, 'Источник': n.source + ' · ' + sourceStates[n.status] })}</div>`).join('');
    // Subdomains
    const inventory = d.inventory || [];
    const ct = d.certificateSearch || {};
    const sourceInner = (d.sources || []).map(s => `<div class="source-row"><span>${s.url ? `<a href="${esc(safeUrl(s.url))}" target="_blank" rel="noopener noreferrer">${esc(s.name)}</a>` : esc(s.name)}</span><span class="state state-${esc(s.status)}">${esc(sourceStates[s.status])}</span><time>${esc(new Date(s.checkedAt).toLocaleTimeString())}</time></div>`).join('');
    // Wayback
    const wb = d.wayback;
    let wbInner;
    if (wb && (wb.first || wb.last)) {
      const stats = [];
      if (wb.first) stats.push(`<div class="stat"><b>${esc(wb.first)}</b><span>ранний найденный снимок</span></div>`);
      if (wb.last) stats.push(`<div class="stat"><b>${esc(wb.last)}</b><span>поздний найденный снимок</span></div>`);
      wbInner = `<div class="stats">${stats.join('')}</div><div class="muted" style="margin-top:10px">✔ Сайт присутствует в веб-архиве</div>`;
    } else {
      wbInner = wb ? '<div class="muted">Архивных снимков нет</div>' : '';
    }

    out.innerHTML = `
      <div class="osint-head-card">
        <div class="dom">${esc(d.domain)}</div>
        <div class="sub">OSINT-сводка по открытым данным${d.cached ? ' · из кэша (до 10 минут)' : ''} · ${d.durationMs} мс · ${new Date(d.scannedAt).toLocaleString()}</div>
        <div class="report-actions"><button class="dl-btn" id="dlBtnOsint">Печать / PDF</button><button class="copy-btn" data-export-json>Скачать JSON</button><button class="copy-btn" data-export-csv>Скачать CSV</button></div>
      </div>
      <div class="intel-stats">${[['Имен в CT', d.summary?.names || 0], ['С текущим IP', d.summary?.resolved || 0], ['Уникальных IP', d.summary?.addresses || 0], ['Карточек сертификатов', d.summary?.certificates || 0]].map(([label, value]) => `<div><b>${value}</b><span>${label}</span></div>`).join('')}</div>
      <div data-report-history></div>
      <div class="osint-grid">
        ${card('🌐', 'WHOIS / Регистрация', whois + `<p class="muted">RDAP: ${esc(d.scope?.registeredDomain)} · область поиска: ${esc(d.apex)}${d.scope?.privateSuffix ? ' (домен на общей платформе)' : ''}</p>`)}
        ${card('🗂️', 'DNS-записи: ' + d.domain, dnsInner)}
        ${card('🖥️', 'Сети / ASN / PTR', ipInner + '<p class="muted">ASN отражает маршрутизацию IP. Общий IP не доказывает общего владельца. Обогащаются первые 3 IP.</p>')}
        ${card('🕰️', 'Wayback Machine', wbInner)}
      </div>
      ${card('📡', 'Источники и полнота', sourceInner + `<p class="muted">CT: ${esc(ct.source || '—')} · страниц: ${ct.pages || 0} · ${esc(sourceStates[ct.status] || '—')}. Лимиты: ${d.limits?.names || 300} имён, ${d.limits?.certificates || 60} сертификатов, DNS для ${d.limits?.dnsHosts || 30} имён. Запись в CT не подтверждает работу сайта.</p>`)}
      ${card('🔗', 'Карта инфраструктуры', '<div id="infraMap"></div><div id="assetDetail" aria-live="polite"></div>')}
      ${card('🔎', 'Инвентаризация доменов', `<div class="inventory-controls"><input id="assetSearch" type="search" placeholder="Фильтр: домен, IP или CNAME" aria-label="Поиск в инвентаризации"><select id="assetState" aria-label="Состояние DNS"><option value="">Все состояния</option>${Object.entries(states).map(([key, value]) => `<option value="${key}">${value}</option>`).join('')}</select></div><div class="muted" id="assetCount"></div><div class="table-scroll"><table class="intel-table"><thead><tr><th>Имя</th><th>DNS</th><th>IP / CNAME</th><th>Источник</th></tr></thead><tbody id="assetRows"></tbody></table></div>${ct.wildcards?.length ? `<p class="muted">Wildcard-имена сертификатов (не отдельные найденные хосты):</p><div class="tag-list">${ct.wildcards.map(s => `<span class="tag">${esc(s)}</span>`).join('')}</div>` : ''}`)}
      ${card('🔐', 'Сертификаты из публичных журналов', `<input class="report-search" id="certSearch" type="search" placeholder="Поиск по имени или издателю" aria-label="Поиск сертификатов"><p class="muted">Даты относятся к действию сертификата. Данные CT могут включать старые записи; текущий сертификат проверяется сканером.</p><div id="certCards" class="cert-grid"></div>`)}`;
    const dl = document.getElementById('dlBtnOsint');
    if (dl) dl.addEventListener('click', () => window.print());
    report.exports('osint', d, out);
    report.history('osint', d, out.querySelector('[data-report-history]'));
    const renderAssets = () => {
      const query = document.getElementById('assetSearch').value.trim().toLowerCase();
      const state = document.getElementById('assetState').value;
      const filtered = inventory.map((asset, index) => ({ ...asset, index })).filter(a => (!state || a.state === state) && [a.hostname, ...a.addresses, ...a.cname].join(' ').toLowerCase().includes(query));
      document.getElementById('assetCount').textContent = `Показано ${filtered.length} из ${inventory.length} · DNS проверено: ${d.summary?.dnsChecked || 0}`;
      document.getElementById('assetRows').innerHTML = filtered.map(a => `<tr><td><button class="asset-link" data-asset="${a.index}">${esc(a.hostname)}</button></td><td><span class="state state-${a.state}">${esc(states[a.state])}</span></td><td>${esc([...a.addresses, ...a.cname.map(c => '→ ' + c)].join(' · ') || '—')}</td><td>${esc(a.source)}${a.checkedAt ? `<small>${esc(new Date(a.checkedAt).toLocaleTimeString())}</small>` : ''}</td></tr>`).join('') || '<tr><td colspan="4">Нет результатов для этого фильтра</td></tr>';
    };
    document.getElementById('assetSearch').addEventListener('input', renderAssets);
    document.getElementById('assetState').addEventListener('change', renderAssets);
    renderAssets();
    const groups = new Map();
    inventory.forEach((asset, index) => asset.addresses.forEach(ip => { if (!groups.has(ip)) groups.set(ip, []); groups.get(ip).push(index); }));
    document.getElementById('infraMap').innerHTML = `<div class="infra-root">${esc(d.apex)}</div><div class="infra-groups">${[...groups].slice(0, 12).map(([ip, indexes]) => {
      const network = networks.find(n => n.ip === ip);
      return `<div class="infra-group"><b>${esc(ip)}</b><span class="muted">${esc(network?.asns.map(a => 'AS' + a).join(', ') || 'ASN не получен')}</span><div>${indexes.map(index => `<button class="asset-link" data-asset="${index}">${esc(inventory[index].hostname)}</button>`).join('')}</div></div>`;
    }).join('') || '<p class="muted">Текущие связи с IP не получены.</p>'}</div><p class="muted">Карта показывает до 12 IP из проверенной части списка. Выберите имя для просмотра его данных.</p>`;
    out.addEventListener('click', e => {
      const button = e.target.closest('[data-asset]'); if (!button) return;
      const asset = inventory[Number(button.dataset.asset)]; if (!asset) return;
      const detail = document.getElementById('assetDetail');
      detail.innerHTML = `<div class="asset-detail"><h3>${esc(asset.hostname)}</h3>${rows({ 'Состояние': states[asset.state], 'Адреса': asset.addresses, CNAME: asset.cname, 'Источник': asset.source, 'DNS проверен': asset.checkedAt ? new Date(asset.checkedAt).toLocaleString() : 'Не проверено' })}<a class="copy-btn tool-link" href="scanner.html?url=${encodeURIComponent(asset.hostname)}">Открыть в сканере</a></div>`;
    }, { signal: renderController.signal });
    const renderCertificates = () => {
      const query = document.getElementById('certSearch').value.trim().toLowerCase();
      const filtered = (d.certificates || []).filter(c => [c.issuer, ...c.dnsNames].join(' ').toLowerCase().includes(query));
      document.getElementById('certCards').innerHTML = filtered.map(c => `<details class="cert-card"><summary><b>${esc(c.issuer || 'Издатель не получен')}</b><span>${esc(c.validTo ? c.validTo.slice(0, 10) : 'Дата неизвестна')}</span></summary>${rows({ 'Начало действия': c.validFrom, 'Конец действия': c.validTo, 'SAN в области поиска': c.dnsNames, 'SHA-256': c.fingerprint || 'Не предоставлен источником', 'Отзыв': c.revoked === null ? 'Не проверен' : c.revoked ? 'Отозван' : 'Не отозван по данным источника', 'Источник': c.source })}<a href="${esc(safeUrl(c.sourceUrl))}" target="_blank" rel="noopener noreferrer">Открыть источник</a></details>`).join('') || '<p class="muted">Карточки не получены или не подходят под фильтр.</p>';
    };
    document.getElementById('certSearch').addEventListener('input', renderCertificates);
    renderCertificates();
    out.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  async function lookup(domain) {
    renderController.abort(); renderController = new AbortController();
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
  let renderController = new AbortController();
  input.value = new URLSearchParams(location.search).get('domain') || '';
})();
