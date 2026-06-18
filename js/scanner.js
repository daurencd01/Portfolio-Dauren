// Web Security Scanner — frontend logic
(function () {
  'use strict';
  const form = document.getElementById('scanForm');
  const input = document.getElementById('scanUrl');
  const btn = document.getElementById('scanBtn');
  const status = document.getElementById('scanStatus');
  const out = document.getElementById('scanResults');

  const ICON = { pass: '✅', warn: '⚠️', fail: '❌', info: 'ℹ️' };

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function render(data) {
    const gradeClass = 'g-' + (data.grade === 'A+' ? 'Aplus' : data.grade);
    const checks = data.checks.map(c => `
      <div class="check s-${c.status}">
        <div class="ico">${ICON[c.status] || '•'}</div>
        <div>
          <h3>${esc(c.title)}</h3>
          <div class="detail">${esc(c.detail)}</div>
          ${c.recommendation && c.recommendation !== '—' ? `<div class="rec">💡 ${esc(c.recommendation)}</div>` : ''}
        </div>
      </div>`).join('');

    out.innerHTML = `
      <div class="score-card">
        <div class="grade ${gradeClass}">${esc(data.grade)}</div>
        <div class="score-meta">
          <div class="url">${esc(data.finalUrl)}</div>
          <div class="sub">Оценка: ${data.score}/100 · ${data.durationMs} мс · ${new Date(data.scannedAt).toLocaleString()}</div>
          <div class="pills">
            <span class="pill p">${data.summary.pass} пройдено</span>
            <span class="pill w">${data.summary.warn} предупреждений</span>
            <span class="pill f">${data.summary.fail} проблем</span>
          </div>
        </div>
      </div>
      ${checks}`;
    out.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  async function scan(url) {
    btn.disabled = true;
    status.className = 'scan-status';
    status.textContent = '';
    out.innerHTML = '<div class="loader"></div><div class="scan-status">Сканирую заголовки, TLS, cookie, CORS...</div>';
    try {
      const r = await fetch('/api/scan?url=' + encodeURIComponent(url));
      const data = await r.json();
      if (!r.ok || data.error) throw new Error(data.error || 'Ошибка сканирования');
      out.innerHTML = '';
      render(data);
    } catch (e) {
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
