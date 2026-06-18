// Web Security Scanner — frontend v2 (terminal animation + gauge + categories)
(function () {
  'use strict';
  const form = document.getElementById('scanForm');
  const input = document.getElementById('scanUrl');
  const btn = document.getElementById('scanBtn');
  const status = document.getElementById('scanStatus');
  const out = document.getElementById('scanResults');

  const ICON = { pass: '✅', warn: '⚠️', fail: '❌', info: 'ℹ️' };
  const STEPS = [
    'Resolving DNS records',
    'Establishing TLS connection',
    'Fetching HTTP response headers',
    'Inspecting SSL certificate',
    'Checking SPF / DMARC / MX',
    'Probing for exposed files (.env / .git)',
    'Looking up security.txt',
    'Computing security score',
  ];

  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  // печатающийся терминал
  async function runTerminal(termEl, stopRef) {
    let html = '';
    for (let i = 0; i < STEPS.length; i++) {
      if (stopRef.done && i > 2) break; // если ответ пришёл быстро — не тянем все строки
      html += `<div class="t-line"><span class="t-arrow">›</span> ${STEPS[i]}<span class="t-ok">  [ok]</span></div>`;
      termEl.innerHTML = html + '<div class="t-line t-cursor">_</div>';
      termEl.scrollTop = termEl.scrollHeight;
      await sleep(260 + Math.random() * 220);
    }
  }

  // анимированный круговой гейдж
  function gaugeSVG(score, color) {
    const R = 52, C = 2 * Math.PI * R;
    return `
      <svg class="gauge" viewBox="0 0 130 130">
        <circle cx="65" cy="65" r="${R}" stroke="rgba(255,255,255,.08)" stroke-width="10" fill="none"/>
        <circle class="gauge-arc" cx="65" cy="65" r="${R}" stroke="${color}" stroke-width="10" fill="none"
          stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C}"
          transform="rotate(-90 65 65)" style="--target:${C - (C * score / 100)}"/>
      </svg>`;
  }
  const gradeColor = (g) => ({ 'A+': '#00ff9d', 'A': '#00ff9d', 'B': '#00e5ff', 'C': '#ffd400', 'D': '#ff8a00', 'F': '#ff003c' }[g] || '#00e5ff');

  function countUp(el, to) {
    let cur = 0; const step = Math.max(1, Math.round(to / 40));
    const tick = () => { cur = Math.min(to, cur + step); el.textContent = cur; if (cur < to) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  }

  function render(data) {
    const color = gradeColor(data.grade);
    const cats = (data.categories || []).map(cat => {
      const checks = cat.checks.map(c => `
        <div class="check s-${c.status}">
          <div class="ico">${ICON[c.status] || '•'}</div>
          <div>
            <h3>${esc(c.title)}</h3>
            <div class="detail">${esc(c.detail)}</div>
            ${c.recommendation && c.recommendation !== '—' && c.status !== 'pass' ? `<div class="rec">💡 ${esc(c.recommendation)}</div>` : ''}
          </div>
        </div>`).join('');
      const sc = cat.score == null ? '—' : cat.score;
      const barColor = cat.score == null ? '#888' : cat.score >= 85 ? '#00ff9d' : cat.score >= 55 ? '#ffd400' : '#ff003c';
      return `
        <div class="cat">
          <div class="cat-head">
            <span class="cat-name">${esc(cat.name)}</span>
            <span class="cat-score" style="color:${barColor}">${sc}${cat.score == null ? '' : '/100'}</span>
          </div>
          <div class="cat-bar"><i style="width:${cat.score == null ? 0 : cat.score}%;background:${barColor}"></i></div>
          ${checks}
        </div>`;
    }).join('');

    out.innerHTML = `
      <div class="score-card">
        <div class="gauge-wrap" style="color:${color}">
          ${gaugeSVG(data.score, color)}
          <div class="gauge-center"><span class="grade-letter">${esc(data.grade)}</span><span class="gauge-num" id="gaugeNum">0</span></div>
        </div>
        <div class="score-meta">
          <div class="url">${esc(data.finalUrl)}</div>
          <div class="sub">${data.score}/100 · ${data.durationMs} мс · ${new Date(data.scannedAt).toLocaleString()}</div>
          <div class="pills">
            <span class="pill p">${data.summary.pass} пройдено</span>
            <span class="pill w">${data.summary.warn} предупреждений</span>
            <span class="pill f">${data.summary.fail} проблем</span>
          </div>
          <button class="dl-btn" onclick="window.print()">⬇ Скачать отчёт (PDF)</button>
        </div>
      </div>
      ${cats}`;

    // анимации
    requestAnimationFrame(() => {
      const arc = out.querySelector('.gauge-arc');
      if (arc) arc.style.strokeDashoffset = arc.style.getPropertyValue('--target');
      const num = document.getElementById('gaugeNum');
      if (num) countUp(num, data.score);
    });
    out.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  async function scan(url) {
    btn.disabled = true;
    status.className = 'scan-status'; status.textContent = '';
    out.innerHTML = `<div class="terminal"><div class="term-bar"><i></i><i></i><i></i><span>scan://${esc(url)}</span></div><div class="term-body" id="term"></div></div>`;
    const stopRef = { done: false };
    const term = document.getElementById('term');
    const anim = runTerminal(term, stopRef);
    try {
      const r = await fetch('/api/scan?url=' + encodeURIComponent(url));
      const data = await r.json();
      stopRef.done = true;
      await anim;
      if (!r.ok || data.error) throw new Error(data.error || 'Ошибка сканирования');
      render(data);
    } catch (e) {
      stopRef.done = true;
      out.innerHTML = '';
      status.className = 'scan-status err';
      status.textContent = '✖ ' + e.message;
    } finally {
      btn.disabled = false;
    }
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const v = input.value.trim();
    if (v) scan(v);
  });
})();
