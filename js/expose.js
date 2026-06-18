// Exposure Check — frontend (breach check, password k-anon, username, phone)
(function () {
  'use strict';
  const modes = document.querySelectorAll('.mode-btn');
  const form = document.getElementById('expForm');
  const input = document.getElementById('expInput');
  const btn = document.getElementById('expBtn');
  const status = document.getElementById('expStatus');
  const out = document.getElementById('expResults');
  let mode = 'email';

  const PH = {
    email: 'you@example.com',
    password: 'введите пароль (не покинет браузер)',
    username: 'your_nickname',
    phone: '+7 701 234 5678',
  };
  function setMode(m) {
    mode = m;
    modes.forEach(b => b.classList.toggle('active', b.dataset.mode === m));
    input.type = (m === 'password') ? 'password' : 'text';
    input.placeholder = PH[m];
    input.value = ''; out.innerHTML = ''; status.textContent = '';
  }
  modes.forEach(b => b.addEventListener('click', () => setMode(b.dataset.mode)));

  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  const card = (cls, html) => `<div class="exp-card ${cls}">${html}</div>`;

  // --- пароль: проверка в браузере (k-anonymity, пароль не уходит на сервер) ---
  async function pwnedCount(pw) {
    const buf = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(pw));
    const hash = [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
    const prefix = hash.slice(0, 5), suffix = hash.slice(5);
    const r = await fetch('https://api.pwnedpasswords.com/range/' + prefix);
    const text = await r.text();
    const line = text.split('\n').find(l => l.split(':')[0].trim() === suffix);
    return line ? parseInt(line.split(':')[1], 10) : 0;
  }

  function renderEmail(q, r) {
    if (!r.found) return card('ok', `<h2>✅ Чисто</h2><div class="muted">${esc(q)} не найден в известных утечках.</div>`);
    return card('bad',
      `<h2>⚠️ Найден в утечках: ${r.count}</h2>
       <div class="muted">Email <b>${esc(q)}</b> засветился в этих утечках данных. Смените пароли на этих сервисах и включите 2FA.</div>
       <div class="tag-list" style="margin-top:14px">${r.breaches.map(b => `<span class="tag tag-red">${esc(b)}</span>`).join('')}</div>`);
  }
  function renderPassword(count) {
    if (count === 0) return card('ok', `<h2>✅ Пароль не найден в утечках</h2><div class="muted">Это не гарантия надёжности, но в публичных базах его нет. Проверка прошла в браузере — пароль никуда не отправлялся.</div>`);
    return card('bad', `<h2>⚠️ Пароль скомпрометирован</h2><div class="muted">Встречается в утечках <b>${count.toLocaleString()}</b> раз. Немедленно прекратите его использовать. (Проверка в браузере по модели k-anonymity — сам пароль не передавался.)</div>`);
  }
  function renderUsername(q, list) {
    const found = list.filter(x => x.found);
    const head = found.length
      ? `<h2>🔎 Найдено профилей: ${found.length}</h2>`
      : `<h2>🔎 Профили не найдены</h2>`;
    const rows = list.map(x =>
      `<div class="exp-row ${x.found ? 'f' : 'n'}">
         <span>${x.found ? '✅' : '◻️'} ${esc(x.site)}</span>
         ${x.found ? `<a href="${esc(x.url)}" target="_blank" rel="noopener noreferrer">${esc(x.url)}</a>` : '<span class="muted">не найден</span>'}
       </div>`).join('');
    return card('', `${head}<div class="muted" style="margin-bottom:12px">Ник <b>${esc(q)}</b> · проверенный набор сайтов</div>${rows}`);
  }
  function renderPhone(r) {
    if (!r.valid) return card('bad', `<h2>❌ Невалидный номер</h2><div class="muted">${esc(r.reason)}</div>`);
    return card('', `<h2>📱 Информация о номере</h2>
      <div class="info-row"><span class="ik">Формат E.164</span><span class="iv">${esc(r.e164)}</span></div>
      <div class="info-row"><span class="ik">Страна (по коду)</span><span class="iv">${esc(r.country)}</span></div>
      <div class="info-row"><span class="ik">Цифр</span><span class="iv">${r.digits}</span></div>
      <div class="muted" style="margin-top:10px">${esc(r.note)}</div>`);
  }

  async function run(q) {
    btn.disabled = true; status.className = 'scan-status'; status.textContent = '';
    out.innerHTML = '<div class="loader"></div><div class="scan-status">Проверяю...</div>';
    try {
      if (mode === 'password') {
        const c = await pwnedCount(q);
        out.innerHTML = ''; out.innerHTML = renderPassword(c);
      } else {
        const r = await fetch(`/api/expose?type=${mode}&q=${encodeURIComponent(q)}`);
        const d = await r.json();
        if (!r.ok || d.error) throw new Error(d.error || 'Ошибка');
        out.innerHTML = '';
        if (mode === 'email') out.innerHTML = renderEmail(d.query, d.result);
        else if (mode === 'username') out.innerHTML = renderUsername(d.query, d.result);
        else if (mode === 'phone') out.innerHTML = renderPhone(d.result);
      }
      out.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (e) {
      out.innerHTML = ''; status.className = 'scan-status err'; status.textContent = '✖ ' + e.message;
    } finally { btn.disabled = false; }
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const v = input.value.trim();
    if (v) run(v);
  });
  setMode('email');
})();
