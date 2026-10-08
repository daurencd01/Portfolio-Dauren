(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const form = $('expForm'), input = $('expInput'), button = $('expBtn'), status = $('expStatus'), out = $('expResults');
  const modes = [...document.querySelectorAll('[data-mode]')];
  const esc = KDReport.esc, local = KOZLocal;
  let mode = 'email', pending = null, runId = 0, report = null, view = null, page = 0;
  const CONFIG = {
    email: { title: 'Email в известных утечках', description: 'История инцидентов, типы раскрытых данных и DNS-настройки почтового домена.',
      placeholder: 'you@example.com', label: 'Email для проверки', type: 'email', privacy: 'Email отправляется в XposedOrNot. Результат не сохраняется в истории KØZ.' },
    password: { title: 'Пароль: утечки и предсказуемость', description: 'Локальная оценка zxcvbn и необязательная проверка по Pwned Passwords.',
      placeholder: 'Введите пароль', label: 'Пароль для проверки', type: 'password', privacy: 'Сам пароль и полный хеш остаются в браузере. После запуска поле очищается. Отключите онлайн-проверку для полностью локального анализа.' },
    username: { title: 'Карта публичных профилей', description: '5 API, публичная статистика профилей и ссылки для ручной проверки ещё 10 платформ.',
      placeholder: 'your_nickname', label: 'Никнейм для проверки', type: 'text', privacy: 'Ник отправляется в GitHub, GitLab, Hacker News, DEV и Keybase. Совпадения не доказывают общего владельца.' },
    phone: { title: 'Разбор телефонного номера', description: 'Форматы E.164 и RFC3966, регион, возможная длина и тип по плану нумерации.',
      placeholder: '+7 701 234 5678', label: 'Телефон для проверки', type: 'tel', privacy: 'Номер обрабатывается локально библиотекой libphonenumber-js. Он не отправляется на сервер или в API.' },
    breaches: { title: 'Каталог известных утечек', description: 'Публичные инциденты: компании, даты, масштаб и типы данных. Фильтры помогают изучать цифровые риски.',
      placeholder: '', label: 'Каталог', type: 'text', privacy: 'Загружается публичный каталог XposedOrNot. Личные данные не нужны. Лимит — 400 карточек; каталог может быть неполным.' },
  };
  const STATES = { found: 'Найдено', 'not-found': 'Совпадений нет', unavailable: 'Недоступно', unsupported: 'Формат не поддерживается',
    ok: 'Получены данные', limited: 'Неполные данные', skipped: 'Онлайн-проверка отключена' };
  const RISK = { plaintext: 'Открытый текст', easytocrack: 'Слабый хеш', hardtocrack: 'Стойкий хеш по данным источника', unknown: 'Неизвестно' };
  const DATA_RU = { 'Email addresses': 'Email', Passwords: 'Пароли', Usernames: 'Никнеймы', Names: 'Имена', 'Phone numbers': 'Телефоны',
    'IP addresses': 'IP-адреса', 'Dates of birth': 'Даты рождения', 'Geographic locations': 'География', 'Physical addresses': 'Адреса' };
  const label = value => DATA_RU[value] || value;
  const n = value => value == null ? '—' : Number(value).toLocaleString('ru-RU');
  const date = value => value ? /^\d{4}$/.test(value) ? value : Number.isNaN(new Date(value).valueOf()) ? value : new Date(value).toLocaleDateString('ru-RU') : 'Дата неизвестна';
  const state = value => `<span class="state ${value === 'found' || value === 'ok' ? 'ok' : value === 'unavailable' ? 'unavailable' : 'limited'}">${esc(STATES[value] || value)}</span>`;
  const card = (title, body, cls = '') => `<section class="koz-card ${cls}"><h2>${title}</h2>${body}</section>`;
  const info = (key, value, privateValue = false) => `<div class="info-row"><span class="ik">${esc(key)}</span><span class="iv ${privateValue ? 'koz-identity' : ''}">${esc(value == null || value === '' ? '—' : value)}</span></div>`;
  function safeUrl(value) { try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password ? url.href : null; } catch { return null; } }
  function link(url, text, cls = '') { const safe = safeUrl(url); return safe ? `<a class="${cls}" href="${esc(safe)}" target="_blank" rel="noopener noreferrer">${esc(text)} ↗</a>` : ''; }
  const tags = values => `<div class="koz-tags">${values.map(v => `<span>${esc(label(v))}</span>`).join('')}</div>`;
  function setMode(next) {
    runId++; pending?.abort(); pending = null; mode = next; report = null; view = null;
    const cfg = CONFIG[mode];
    modes.forEach(b => { b.classList.toggle('active', b.dataset.mode === mode); b.setAttribute('aria-pressed', String(b.dataset.mode === mode)); });
    input.type = cfg.type; input.placeholder = cfg.placeholder; input.value = ''; input.hidden = mode === 'breaches';
    input.required = mode !== 'breaches'; input.maxLength = mode === 'password' ? 128 : mode === 'phone' ? 35 : mode === 'username' ? 40 : 254;
    input.autocomplete = mode === 'password' ? 'new-password' : 'off';
    $('inputLabel').textContent = cfg.label; $('modeTitle').textContent = cfg.title; $('modeDescription').textContent = cfg.description;
    $('modePrivacy').textContent = cfg.privacy;
    $('emailConsentRow').hidden = mode !== 'email'; $('emailConsent').required = mode === 'email'; $('emailConsent').checked = false;
    $('passwordOnlineRow').hidden = mode !== 'password'; $('showPassword').hidden = mode !== 'password';
    $('showPassword').textContent = 'Показать'; $('showPassword').setAttribute('aria-pressed', 'false'); $('phoneOptions').hidden = mode !== 'phone';
    button.disabled = false; button.textContent = mode === 'breaches' ? 'ЗАГРУЗИТЬ КАТАЛОГ' : 'ПРОВЕРИТЬ'; $('cancelCheck').hidden = true;
    status.textContent = ''; out.innerHTML = ''; out.setAttribute('aria-busy', 'false');
  }
  modes.forEach(b => b.addEventListener('click', () => setMode(b.dataset.mode)));
  $('showPassword').addEventListener('click', () => {
    const show = input.type === 'password'; input.type = show ? 'text' : 'password';
    $('showPassword').textContent = show ? 'Скрыть' : 'Показать'; $('showPassword').setAttribute('aria-pressed', String(show));
  });
  $('cancelCheck').addEventListener('click', () => { runId++; pending?.abort(); pending = null; button.disabled = false;
    $('cancelCheck').hidden = true; out.innerHTML = ''; out.setAttribute('aria-busy', 'false'); status.textContent = 'Проверка отменена.'; });
  function stats(items) { return `<div class="intel-stats">${items.map(([value, title]) => `<div><b>${esc(value)}</b><span>${esc(title)}</span></div>`).join('')}</div>`; }
  function source(result) {
    return `<div class="koz-source">${link(result.sourceUrl, result.source || '')} · ${esc(STATES[result.analyticsStatus || result.status] || '')} · ${esc(new Date(result.checkedAt).toLocaleString('ru-RU'))}${result.cached ? ' · кэш каталога до 15 мин' : ''}</div>`;
  }
  function protection(type, result) {
    if (type === 'breaches') return '';
    const tasks = type === 'email' ? [
      ...(result.status === 'found' ? ['Сменить повторяющиеся пароли на затронутых сервисах.'] : []),
      'Включить MFA или passkey на почте и важных аккаунтах.', 'Проверить активные сессии, пересылку писем и способы восстановления.',
      'Использовать уникальные пароли из менеджера паролей.',
      ...(result.summary?.dataClasses.some(v => /phone|address|birth/i.test(v)) ? ['Учитывать раскрытые данные при проверке подозрительных звонков и писем.'] : []),
    ] : type === 'password' ? [
      ...(result.status === 'found' || result.strength.score < 3 ? ['Заменить этот пароль на уникальный случайный пароль.'] : []),
      'Не использовать один пароль в нескольких аккаунтах.', 'Сохранить новый пароль в менеджере паролей.', 'Включить MFA или passkey.',
    ] : type === 'username' ? ['Вручную подтвердить, какие найденные профили принадлежат вам.', 'Убрать ненужные личные сведения из публичных профилей.',
      'Закрыть старые аккаунты после проверки доступов и восстановления.', 'Разделять публичный ник и ник для личных аккаунтов, если нужна приватность.']
      : ['Проверить защиту аккаунта у своего мобильного оператора.', 'Ограничить видимость номера в мессенджерах и соцсетях.',
        'Использовать приложение MFA или passkey там, где это возможно.'];
    report.plan = tasks.map(task => ({ task, completed: false }));
    return card('План защиты', `<p class="muted">Отметки действуют только в текущем отчёте. Выполнено <span id="planCount">0</span> из ${tasks.length}.</p>
      <div class="koz-checklist">${tasks.map((task, i) => `<label><input type="checkbox" data-task="${i}"><span>${esc(task)}</span></label>`).join('')}</div>`);
  }
  function timeline(summary) {
    const years = {};
    (report.result.breaches || []).forEach(b => { if (b.year) years[b.year] = (years[b.year] || 0) + 1; });
    const entries = Object.entries(years).sort((a, b) => a[0].localeCompare(b[0])), max = Math.max(1, ...entries.map(([, c]) => c));
    return entries.length ? card('Инциденты по годам', `<div class="koz-timeline">${entries.map(([year, count]) => `<div class="koz-year">${count}<i style="height:${Math.round(count / max * 65) + 5}px"></i><button type="button" data-year="${year}" aria-label="Утечки за ${year}">${year}</button></div>`).join('')}</div><p class="muted">Год инцидента по источнику. Для фильтрации нажмите на год. В график входят карточки этого отчёта, для которых известен год.</p>`) : '';
  }
  function breachSection(result) {
    const rows = result.breaches || [], years = [...new Set(rows.map(b => b.year).filter(Boolean))].sort((a, b) => b - a);
    const classes = [...new Set(rows.flatMap(b => b.dataClasses))].sort();
    return card('Карточки инцидентов', `<div class="koz-filter"><input type="search" id="breachSearch" aria-label="Поиск утечек" placeholder="Компания, домен, тип данных…">
      <select id="breachYear" aria-label="Год утечки"><option value="">Все годы</option>${years.map(y => `<option>${y}</option>`).join('')}</select>
      <select id="breachClass" aria-label="Тип раскрытых данных"><option value="">Любые данные</option>${classes.map(c => `<option value="${esc(c)}">${esc(label(c))}</option>`).join('')}</select>
      <select id="breachRisk" aria-label="Хранение паролей"><option value="">Любое хранение паролей</option><option value="plaintext">Открытый текст</option><option value="easytocrack">Слабый хеш</option></select>
      <select id="breachSort" aria-label="Сортировка утечек"><option value="date">По дате</option><option value="records">По масштабу</option><option value="name">По названию</option></select></div>
      <div id="breachCount" class="koz-filter-count" role="status"></div><div id="breachRows"></div>
      <div class="koz-report-tools"><button class="copy-btn" id="prevPage">← Назад</button><button class="copy-btn" id="nextPage">Далее →</button></div>`);
  }
  function emailView(result) {
    const found = result.status === 'found', unavailable = result.status === 'unavailable';
    const title = unavailable ? 'Источник утечек недоступен' : found ? `Email найден в ${n(result.count)} инцидентах` : 'Совпадений в XposedOrNot нет';
    const summary = result.summary;
    const domain = result.mailDomain;
    return card(title, `<p>${unavailable ? 'Не удалось получить ответ. Нельзя сделать вывод о наличии или отсутствии утечки.' : found ? 'Источник связал этот адрес с инцидентами ниже. Типы данных относятся к утечке сервиса; они не доказывают, что все эти поля раскрыты именно у этого аккаунта.' : 'Адрес не найден в доступной базе. Это не подтверждение безопасности аккаунта.'}</p>${source(result)}`, unavailable ? 'warn' : found ? 'bad' : '')
      + (!unavailable ? stats([[n(result.count), 'Инцидентов'], [result.analyticsStatus === 'unavailable' ? '—' : summary.dataClasses.length, 'Типов данных'], [result.analyticsStatus === 'unavailable' ? '—' : summary.plainTextBreaches + summary.weakHashBreaches, 'Инцидентов со слабым хранением'], [n(result.pastes?.count), 'Paste-совпадений по источнику']]) : '')
      + (!unavailable ? '<p class="koz-source">Общая сводка учитывает все инциденты из ответа источника; карточки ниже ограничены первыми 60 после сортировки по дате.</p>' : '')
      + (result.analyticsStatus === 'unavailable' && !unavailable ? '<div class="koz-banner">Работает базовая проверка; подробная аналитика недоступна. Даты, поля и масштаб могут отсутствовать.</div>' : '')
      + (summary?.dataClasses.length ? card('Какие данные затронуты', tags(summary.dataClasses)) : '')
      + card('Почтовый домен / DNS', info('Домен', domain.domain) + info('MX', domain.statuses.mx === 'unavailable' ? 'Источник DNS недоступен' : domain.nullMx ? 'Null MX: домен заявляет, что не принимает почту' : domain.mx.length ? domain.mx.map(r => `${r.exchange} (${r.priority})`).join(' · ') : 'MX не найден')
        + info('SPF', domain.statuses.spf === 'unavailable' ? 'DNS недоступен' : domain.spf.join(' · ') || 'Не найден')
        + info('DMARC', domain.statuses.dmarc === 'unavailable' ? 'DNS недоступен' : domain.dmarc.join(' · ') || 'Не найден')
        + info('Область DMARC', domain.policyDomain) + '<p class="muted">Проверяется домен, а не существование почтового ящика. Наличие SPF/DMARC не подтверждает правильность всей конфигурации.</p>')
      + timeline(summary) + ((result.breaches || []).length ? '<p class="muted koz-source">В отчёте до 60 карточек. Информация о paste-совпадениях ограничена количеством; содержимое не загружается.</p>' + breachSection(result) : '') + protection('email', result);
  }
  function catalogView(result) {
    if (result.status === 'unavailable') return card('Каталог временно недоступен', '<p>Источник не ответил или исчерпан бесплатный лимит. Попробуйте позже.</p>' + source(result), 'warn');
    const rows = result.breaches, dated = rows.map(b => b.year).filter(Boolean);
    return stats([[n(result.count), 'Инцидентов в ответе API'], [rows.length, 'Карточек в отчёте'], [result.summary.dataClasses.length, 'Типов данных'], [dated.length ? Math.max(...dated) : '—', 'Последний год инцидента']])
      + card('Публичная база / XposedOrNot', `<p>Для изучения компаний и типов утечек. Каталог не содержит адресов аккаунтов или содержимого утечек. ${result.status === 'limited' ? 'Показаны первые 400 инцидентов после сортировки по дате.' : ''}</p>${source(result)}`)
      + timeline(result.summary) + breachSection(result);
  }
  function profileView(result) {
    return stats([[result.summary.found, 'Совпадений в API'], [result.summary.notFound, 'Без совпадения'], [result.summary.unavailable, 'Источников недоступно'], [result.manual.length, 'Ручных ссылок']])
      + '<div class="koz-banner">Одинаковый ник на разных платформах может принадлежать разным людям. Автопроверка фиксирует совпадение имени, а не личность.</div>'
      + card('Публичные профили', `<div class="koz-filter"><input type="search" id="profileSearch" aria-label="Поиск профилей" placeholder="Платформа или описание…"><select id="profileStatus" aria-label="Состояние профиля"><option value="">Все результаты</option><option value="found">Найдены</option><option value="not-found">Без совпадения</option><option value="unavailable">Недоступны</option><option value="unsupported">Формат не поддерживается</option></select></div><div id="profileCount" class="koz-filter-count" role="status"></div><div id="profileRows" class="koz-grid"></div>`)
      + card('Проверить вручную', `<p class="muted">Эти платформы могут показывать страницу входа, блокировать запрос или возвращать HTTP 200 для отсутствующего профиля. Ссылки не являются результатами проверки.</p><div class="sn-grid koz-identity">${result.manual.map(row => link(row.url, row.site, 'sn-link')).join('')}</div>`)
      + protection('username', result);
  }
  function passwordView(result) {
    const titles = ['Очень предсказуемый', 'Предсказуемый', 'Есть слабые шаблоны', 'Менее предсказуемый', 'Высокая оценка модели'];
    const title = result.status === 'found' ? 'Пароль найден в Pwned Passwords' : result.status === 'not-found' ? 'Пароль не найден в Pwned Passwords' : result.status === 'skipped' ? 'Только локальная оценка' : 'Онлайн-проверка недоступна';
    return card(title, `${result.count != null ? `<p>Число появлений в базе: <b>${n(result.count)}</b>.</p>` : ''}<p>${result.status === 'found' ? 'Прекратите использовать этот пароль. Оценка сложности не отменяет факт его присутствия в базе.' : result.status === 'unavailable' ? 'Источник не ответил. Результат по утечкам неизвестен; локальная оценка ниже доступна.' : 'Отсутствие записи не гарантирует безопасность. Используйте отдельный пароль для каждого аккаунта.'}</p><div class="koz-source">${link('https://haveibeenpwned.com/API/v3#PwnedPasswords', 'Pwned Passwords')} · ${esc(STATES[result.status])} · префикс из 5 символов, padding включён</div>`, result.status === 'found' ? 'bad' : result.status === 'unavailable' ? 'warn' : '')
      + card('Предсказуемость / локальная модель', `<h3>${esc(titles[result.strength.score])} · ${result.strength.score}/4</h3><div class="koz-strength">${Array.from({ length: 4 }, (_, i) => `<i class="${i < result.strength.score ? 'filled' : ''}"></i>`).join('')}</div>${info('Символов', result.strength.length)}${tags(result.strength.patterns)}<p class="muted">zxcvbn оценивает словарные слова, повторы, даты и клавиатурные шаблоны. Модель преимущественно опирается на английские словари. Это эвристика, а не прогноз времени взлома.</p><p>Для нового пароля используйте генератор менеджера паролей или длинную фразу из независимо выбранных слов.</p>`, result.strength.score < 3 ? 'bad' : '')
      + protection('password', result);
  }
  function phoneView(result) {
    const names = new Intl.DisplayNames(['ru'], { type: 'region' });
    const types = { MOBILE: 'Мобильный', FIXED_LINE: 'Стационарный', FIXED_LINE_OR_MOBILE: 'Стационарный или мобильный', TOLL_FREE: 'Бесплатный', PREMIUM_RATE: 'Платный сервисный', VOIP: 'VoIP', UNKNOWN: 'Не определён', PERSONAL_NUMBER: 'Персональный', SHARED_COST: 'Общая тарификация', PAGER: 'Пейджер', UAN: 'Корпоративный', VOICEMAIL: 'Голосовая почта' };
    return card(result.valid ? 'Формат соответствует плану нумерации' : 'Проверьте формат номера', `<p>${result.valid ? 'Номер разобран локально. Это не проверка активности SIM-карты или наличия утечек.' : esc(result.reason)}</p>`, result.valid ? '' : 'warn')
      + (result.e164 ? `<div class="koz-grid">${card('Форматы номера', info('E.164', result.e164, true) + info('Международный', result.international, true) + info('Национальный', result.national, true) + info('RFC3966', result.rfc3966, true))}${card('План нумерации', info('Регион', result.country ? names.of(result.country) + ' (' + result.country + ')' : result.nonGeographic ? 'Международный сервисный номер' : 'Не определён') + info('Код страны', '+' + result.callingCode) + info('Возможная длина', result.possible ? 'Да' : 'Нет') + info('Тип по метаданным', types[result.type] || result.type) + info('Цифр', result.digits) + (result.defaultCountry ? info('Регион для разбора', names.of(result.defaultCountry)) : ''))}</div><div style="height:20px"></div>` : '')
      + card('Что можно установить', '<p>Регион и тип получены из локальной версии плана нумерации. Перенос номера и изменения у оператора могут влиять на актуальность. Владелец, текущий оператор, местоположение и данные об утечках не определяются.</p>')
      + protection('phone', result);
  }
  function render(data) {
    report = data; page = 0; view = null;
    const title = CONFIG[data.type].title, query = data.type === 'password' || data.type === 'breaches' ? '' : data.type === 'username' ? data.query : local.mask(data.type, data.query);
    out.innerHTML = `<div class="koz-report-head"><div><h2>${esc(title)}</h2><p>${query ? `<span class="koz-identity">${esc(query)}</span> · ` : ''}${esc(new Date(data.scannedAt).toLocaleString('ru-RU'))}${data.durationMs != null ? ` · ${n(data.durationMs)} мс` : ''}</p></div><div class="koz-report-tools"><button class="copy-btn" data-json>JSON ↓</button><button class="copy-btn" data-csv>CSV ↓</button><button class="copy-btn" data-print>Печать / PDF</button></div></div>
      ${!['password', 'breaches'].includes(data.type) ? '<label class="koz-export-privacy"><input type="checkbox" id="exportIdentity">Включить идентификатор в экспорт (по умолчанию скрыт)</label>' : ''}
      ${(data.type === 'email' ? emailView : data.type === 'username' ? profileView : data.type === 'phone' ? phoneView : data.type === 'password' ? passwordView : catalogView)(data.result)}`;
    if ($('breachSearch')) {
      ['breachSearch', 'breachYear', 'breachClass', 'breachRisk', 'breachSort'].forEach(id => $(id).addEventListener(id === 'breachSearch' ? 'input' : 'change', () => { page = 0; renderBreaches(); }));
      $('prevPage').addEventListener('click', () => { page--; renderBreaches(); }); $('nextPage').addEventListener('click', () => { page++; renderBreaches(); }); renderBreaches();
    }
    if ($('profileSearch')) {
      $('profileSearch').addEventListener('input', renderProfiles); $('profileStatus').addEventListener('change', renderProfiles); renderProfiles();
    }
  }
  function renderBreaches() {
    const query = $('breachSearch').value.toLowerCase().trim(), year = $('breachYear').value, dataClass = $('breachClass').value, risk = $('breachRisk').value;
    const rows = report.result.breaches.filter(b => (!query || [b.name, b.domain, b.industry, ...b.dataClasses.map(label)].join(' ').toLowerCase().includes(query))
      && (!year || String(b.year) === year) && (!dataClass || b.dataClasses.includes(dataClass)) && (!risk || b.passwordRisk.toLowerCase() === risk));
    const sort = $('breachSort').value;
    rows.sort((a, b) => sort === 'records' ? (b.records || 0) - (a.records || 0) : sort === 'name' ? a.name.localeCompare(b.name) : String(b.date || '').localeCompare(String(a.date || '')));
    view = rows; page = Math.max(0, Math.min(page, Math.ceil(rows.length / 10) - 1));
    $('breachCount').textContent = `Найдено ${rows.length} из ${report.result.breaches.length} карточек · страница ${rows.length ? page + 1 : 0} / ${Math.ceil(rows.length / 10)}`;
    $('breachRows').innerHTML = rows.slice(page * 10, page * 10 + 10).map(b => `<details class="koz-breach"><summary><b>${esc(b.name)}</b><span>${esc(date(b.date))}</span></summary>${tags(b.dataClasses)}${info('Домен', b.domain)}${info('Записей в инциденте', n(b.records))}${info('Отрасль', b.industry)}${info('Хранение паролей', RISK[b.passwordRisk.toLowerCase()] || b.passwordRisk)}${info('Проверен источником', b.verified == null ? 'Не указано' : b.verified ? 'Да' : 'Нет')}<p>${esc(b.description || 'Описание не предоставлено.')}</p>${link(b.reference, 'Публикация об инциденте')}<p class="koz-source">Масштаб относится к инциденту целиком. Карточка не содержит украденных данных.</p></details>`).join('') || '<div class="koz-empty">Нет карточек для этих фильтров.</div>';
    $('prevPage').disabled = page === 0; $('nextPage').disabled = (page + 1) * 10 >= rows.length;
  }
  function renderProfiles() {
    const query = $('profileSearch').value.toLowerCase().trim(), chosen = $('profileStatus').value;
    const rows = report.result.auto.filter(r => (!chosen || r.status === chosen) && (!query || [r.site, r.category, r.profile?.name, r.profile?.bio].join(' ').toLowerCase().includes(query)));
    $('profileCount').textContent = `${rows.length} из ${report.result.auto.length} источников`;
    $('profileRows').innerHTML = rows.map(row => `<article class="koz-card koz-profile ${row.status === 'unavailable' ? 'warn' : ''}"><div class="koz-profile-head"><b>${esc(row.site)}</b>${state(row.status)}</div>${row.profile ? `<h3 class="koz-identity">${esc(row.profile.name || row.profile.username)}</h3><p class="koz-identity">${esc(row.profile.bio)}</p>${row.profile.createdAt ? info('Создан', date(row.profile.createdAt)) : ''}<dl>${Object.entries(row.profile.metrics).filter(([, value]) => value != null).map(([key, value]) => `<div><dt>${esc(key)}</dt><dd>${n(value)}</dd></div>`).join('')}</dl>` : ''}<p>${esc(row.evidence)}</p>${link(row.url, row.status === 'found' ? 'Открыть профиль' : 'Проверить вручную', 'koz-identity')}<div class="koz-source">${esc(row.category)} · ${esc(new Date(row.checkedAt).toLocaleTimeString('ru-RU'))}</div></article>`).join('') || '<div class="koz-empty">Нет результатов для фильтра.</div>';
  }
  function download(name, text, mime) {
    const url = URL.createObjectURL(new Blob([text], { type: mime })), anchor = document.createElement('a');
    anchor.href = url; anchor.download = name; document.body.appendChild(anchor); anchor.click(); anchor.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function csvRows(data) {
    if (data.type === 'email' || data.type === 'breaches') return [['incident', 'date', 'domain', 'data_classes', 'records', 'password_storage', 'verified'],
      ...(view || data.result.breaches).map(b => [b.name, b.date, b.domain, b.dataClasses.join('; '), b.records, b.passwordRisk, b.verified])];
    if (data.type === 'username') return [['platform', 'status', 'evidence', 'profile_url', 'name'], ...data.result.auto.map(row => [row.site, row.status, row.evidence, row.url, row.profile?.name])];
    const fields = data.type === 'password' ? { status: data.result.status, occurrences: data.result.count, score: data.result.strength.score,
      characters: data.result.strength.length, patterns: data.result.strength.patterns.join('; ') } : data.result;
    return [['field', 'value'], ...Object.entries(fields).map(([key, value]) => [key, value])];
  }
  out.addEventListener('click', event => {
    const button = event.target.closest('button'); if (!button || !report) return;
    if (button.dataset.year) { $('breachYear').value = button.dataset.year; page = 0; renderBreaches(); $('breachCount').scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    if (button.hasAttribute('data-json') || button.hasAttribute('data-csv')) {
      const safe = local.exportReport(report, !!$('exportIdentity')?.checked), stamp = new Date(report.scannedAt).toISOString().slice(0, 10);
      if (button.hasAttribute('data-json')) download(`koz-${report.type}-${stamp}.json`, JSON.stringify(safe, null, 2), 'application/json');
      else download(`koz-${report.type}-${stamp}.csv`, KDReport.csv(csvRows(safe)), 'text/csv;charset=utf-8');
    }
    if (button.hasAttribute('data-print')) {
      document.body.classList.toggle('koz-print-private', !$('exportIdentity')?.checked);
      window.print();
    }
  });
  window.addEventListener('afterprint', () => document.body.classList.remove('koz-print-private'));
  out.addEventListener('change', event => {
    if (event.target.hasAttribute('data-task')) {
      report.plan[Number(event.target.dataset.task)].completed = event.target.checked;
      $('planCount').textContent = report.plan.filter(t => t.completed).length;
    }
  });
  async function run(value) {
    pending?.abort(); const controller = new AbortController(); pending = controller;
    const id = ++runId, type = mode, start = performance.now();
    button.disabled = true; $('cancelCheck').hidden = false; status.className = 'scan-status'; status.textContent = 'Проверка выполняется…';
    out.innerHTML = '<div class="loader" aria-label="Загрузка"></div>'; out.setAttribute('aria-busy', 'true');
    try {
      let data;
      if (type === 'password') {
        input.value = ''; const strength = local.strength(value), online = $('passwordOnline').checked;
        const hash = online ? await local.hashPassword(value) : null; value = '';
        let result = { status: online ? 'unavailable' : 'skipped', count: null, strength };
        if (online) try { const count = await local.pwnedCount(hash, controller.signal); result = { status: count > 0 ? 'found' : 'not-found', count, strength }; }
        catch (error) { if (controller.signal.aborted) throw error; }
        data = { version: 4, tool: 'KØZ', type, scannedAt: new Date().toISOString(), result };
      } else if (type === 'phone') {
        data = { version: 4, tool: 'KØZ', type, query: value, scannedAt: new Date().toISOString(), result: local.phoneInfo(value, $('phoneCountry').value) };
      } else {
        const response = await fetch('/api/expose', { method: 'POST', headers: { 'Content-Type': 'application/json' }, cache: 'no-store',
          body: JSON.stringify({ type, q: value, consent: type === 'email' && $('emailConsent').checked }), signal: AbortSignal.any([controller.signal, AbortSignal.timeout(22000)]) });
        data = await response.json(); if (!response.ok || data.error) throw new Error(data.error || 'Не удалось получить ответ.');
      }
      if (id !== runId) return;
      data.durationMs = Math.round(performance.now() - start); render(data); status.textContent = 'Проверка завершена.';
      out.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (error) {
      if (id !== runId) return;
      out.innerHTML = ''; status.className = 'scan-status err'; status.textContent = error.name === 'TimeoutError' ? 'Источник не ответил вовремя. Попробуйте позже.' : error.message;
    } finally {
      if (id === runId) { button.disabled = false; $('cancelCheck').hidden = true; out.setAttribute('aria-busy', 'false'); pending = null; }
    }
  }
  form.addEventListener('submit', event => { event.preventDefault(); const value = mode === 'password' ? input.value : input.value.trim(); if (value || mode === 'breaches') run(value); });
  setMode('email');
})();
