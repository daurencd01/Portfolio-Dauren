(() => {
    'use strict';

    const rounds = [
        {
            path: 'M40 145 C160 145 225 70 360 70 S535 145 650 145 S805 95 920 95',
            source: '203.0.113.18', target: 'auth-gateway-02',
            en: ['AUTH GATEWAY', 'AUTHENTICATION TRACE', 'Repeated failed sign-ins followed by a new session request.'],
            ru: ['ШЛЮЗ АВТОРИЗАЦИИ', 'ЖУРНАЛ АВТОРИЗАЦИИ', 'Повторные неудачные входы, затем запрос новой сессии.']
        },
        {
            path: 'M40 95 C175 95 215 185 360 185 S540 80 660 80 S810 145 920 145',
            source: '198.51.100.7', target: 'endpoint-04',
            en: ['ENDPOINT', 'ENDPOINT TRACE', 'An unexpected script process starts after a remote connection.'],
            ru: ['КОНЕЧНОЕ УСТРОЙСТВО', 'ЖУРНАЛ УСТРОЙСТВА', 'После удалённого подключения запускается неожиданный скрипт.']
        },
        {
            path: 'M40 155 C175 155 260 55 390 55 S570 180 700 180 S835 95 920 95',
            source: '192.0.2.44', target: 'web-edge-01',
            en: ['WEB EDGE', 'WEB REQUEST TRACE', 'An unusual upload request reaches an exposed web endpoint.'],
            ru: ['ВЕБ-УЗЕЛ', 'ЖУРНАЛ ВЕБ-ЗАПРОСОВ', 'Необычный запрос на загрузку достигает открытого веб-узла.']
        }
    ];
    const text = {
        en: {
            brand: 'KD_SEC / SIGNAL HUNT', simulated: 'SIMULATED · LOCAL ONLY', simTag: 'SIMULATED', close: 'Close Signal Hunt',
            title: 'GHOST PACKET', deck: 'Catch the rogue packet in the amber gate, then quarantine its synthetic trace. Three quick rounds. No live systems.',
            round: 'ROUND', secured: 'QUARANTINED', attempts: 'ATTEMPTS',
            entry: 'ENTRY', gate: 'INTERCEPT GATE', core: 'PROTECTED CORE',
            gateHelp: 'Press INTERCEPT while the red packet is inside the amber gate.',
            stepHelp: 'Step mode: advance the packet one step, then intercept inside the gate.',
            stepOn: 'STEP MODE: ON', stepOff: 'STEP MODE: OFF', stepSystem: 'STEP MODE: ON (SYSTEM)',
            gateNow: 'Packet inside the intercept gate. Press INTERCEPT now.',
            gatePassed: 'Packet passed the intercept gate. Retry this round.',
            start: 'START SIGNAL', intercept: 'INTERCEPT', advance: 'ADVANCE PACKET', retry: 'RETRY ROUND',
            quarantine: 'QUARANTINE TRACE', next: 'NEXT ROUND', replay: 'REPLAY', reset: 'RESTART RUN',
            ready: 'Signal is staged. Start when ready.', running: 'Track the packet. Intercept inside the amber gate.',
            runningStep: 'Advance the packet. Intercept when it reaches the amber gate.',
            early: 'Too early. The packet was outside the gate. Try the round again.',
            late: 'Too late. The packet passed the gate. Try the round again.',
            escaped: 'Packet escaped the route. Try the round again.',
            caught: 'Packet captured. Review the synthetic trace, then quarantine it.',
            securedMessage: 'Trace quarantined. Continue to the next round.',
            complete: 'All three synthetic traces quarantined. Replay to try again.',
            traceTitle: 'SYNTHETIC INCIDENT TRACE', source: 'SOURCE', target: 'TARGET', signal: 'OBSERVED SIGNAL',
            traceNote: 'Fictional training data using documentation IP ranges. No traffic is monitored or blocked.',
            progress: 'Route progress', stageLabel: 'Simulated network route'
        },
        ru: {
            brand: 'KD_SEC / ПОИСК СИГНАЛА', simulated: 'СИМУЛЯЦИЯ · ЛОКАЛЬНО', simTag: 'СИМУЛЯЦИЯ', close: 'Закрыть игру',
            title: 'ПРИЗРАЧНЫЙ ПАКЕТ', deck: 'Перехватите пакет в янтарной зоне и изолируйте его учебный журнал. Три коротких раунда. Без реальных систем.',
            round: 'РАУНД', secured: 'ИЗОЛИРОВАНО', attempts: 'ПОПЫТКИ',
            entry: 'ВХОД', gate: 'ЗОНА ПЕРЕХВАТА', core: 'ЗАЩИЩЁННЫЙ УЗЕЛ',
            gateHelp: 'Нажмите «ПЕРЕХВАТ», когда красный пакет окажется в янтарной зоне.',
            stepHelp: 'Пошаговый режим: продвигайте пакет и перехватите его в зоне.',
            stepOn: 'ПОШАГОВЫЙ РЕЖИМ: ВКЛ.', stepOff: 'ПОШАГОВЫЙ РЕЖИМ: ВЫКЛ.',
            stepSystem: 'ПОШАГОВЫЙ РЕЖИМ: СИСТЕМА',
            gateNow: 'Пакет в зоне перехвата. Нажмите «ПЕРЕХВАТ».',
            gatePassed: 'Пакет прошёл зону перехвата. Повторите раунд.',
            start: 'ЗАПУСТИТЬ СИГНАЛ', intercept: 'ПЕРЕХВАТ', advance: 'ПРОДВИНУТЬ ПАКЕТ',
            retry: 'ПОВТОРИТЬ РАУНД', quarantine: 'ИЗОЛИРОВАТЬ', next: 'СЛЕДУЮЩИЙ РАУНД',
            replay: 'ПОВТОРИТЬ ИГРУ', reset: 'НАЧАТЬ ЗАНОВО',
            ready: 'Сигнал подготовлен. Запускайте, когда будете готовы.',
            running: 'Следите за пакетом. Перехватите его в янтарной зоне.',
            runningStep: 'Продвигайте пакет и перехватите его в янтарной зоне.',
            early: 'Слишком рано: пакет ещё вне зоны. Повторите раунд.',
            late: 'Слишком поздно: пакет прошёл зону. Повторите раунд.',
            escaped: 'Пакет покинул маршрут. Повторите раунд.',
            caught: 'Пакет перехвачен. Изучите учебный журнал и изолируйте его.',
            securedMessage: 'Журнал изолирован. Переходите к следующему раунду.',
            complete: 'Все три учебных журнала изолированы. Можете сыграть ещё раз.',
            traceTitle: 'УЧЕБНЫЙ ЖУРНАЛ ИНЦИДЕНТА', source: 'ИСТОЧНИК', target: 'ЦЕЛЬ', signal: 'ПРИЗНАК',
            traceNote: 'Вымышленные данные и IP-адреса для документации. Реальный трафик не отслеживается и не блокируется.',
            progress: 'Прогресс маршрута', stageLabel: 'Симулированный сетевой маршрут'
        }
    };
    const durations = [6600, 6100, 5600];
    const lang = () => document.documentElement.lang.toLowerCase().startsWith('ru') ? 'ru' : 'en';

    function init() {
        const triggers = [...document.querySelectorAll('[data-ghost-open]')];
        if (!triggers.length || !window.HTMLDialogElement?.prototype.showModal) return;
        const dialog = document.createElement('dialog');
        dialog.className = 'gp-dialog';
        dialog.setAttribute('aria-labelledby', 'gp-title');
        dialog.setAttribute('aria-describedby', 'gp-deck');
        dialog.innerHTML = [
            '<div class="gp-frame">',
            '<header class="gp-topbar"><span class="gp-brand"></span><span class="gp-sim"><i aria-hidden="true"></i><span></span></span><button class="gp-close" type="button" aria-label="Close Signal Hunt">×</button></header>',
            '<div class="gp-content">',
            '<div class="gp-heading"><div><h2 id="gp-title" tabindex="-1"></h2><p id="gp-deck"></p></div><span class="gp-round-name"></span></div>',
            '<div class="gp-dashboard"><div><small class="gp-round-label"></small><strong class="gp-round-value"></strong></div><div><small class="gp-secured-label"></small><strong class="gp-secured-value"></strong></div><div><small class="gp-attempts-label"></small><strong class="gp-attempts-value"></strong></div></div>',
            '<div class="gp-stage"><div class="gp-stage-head"><span class="gp-stage-label"></span><span class="gp-stage-state">SIMULATED</span></div>',
            '<svg class="gp-map" viewBox="0 0 960 260" role="img" aria-label="Simulated network route" preserveAspectRatio="xMidYMid meet">',
            '<path class="gp-grid" d="M0 52H960M0 104H960M0 156H960M0 208H960M120 0V260M240 0V260M360 0V260M480 0V260M600 0V260M720 0V260M840 0V260"/>',
            '<rect class="gp-gate-fill" x="590" y="10" width="200" height="240" rx="2"/><path class="gp-gate-edge" d="M590 20V240M790 20V240"/>',
            '<path class="gp-route-glow"/><path class="gp-route"/><circle class="gp-entry-node" cx="40" cy="145" r="10"/><circle class="gp-core-node" cx="920" cy="95" r="11"/>',
            '<circle class="gp-packet-halo" cx="40" cy="145" r="18"/><circle class="gp-packet" cx="40" cy="145" r="9"/></svg>',
            '<div class="gp-stage-foot"><span class="gp-entry-label"></span><span class="gp-gate-label"></span><span class="gp-core-label"></span></div>',
            '<progress class="gp-progress" max="100" value="0">0%</progress></div>',
            '<div class="gp-mode-row"><p class="gp-instruction"></p><button class="gp-mode" type="button" aria-pressed="false"></button></div>',
            '<div class="gp-feedback" role="status" aria-live="polite" aria-atomic="true"><span class="gp-feedback-mark" aria-hidden="true"></span><span class="gp-feedback-text"></span></div>',
            '<section class="gp-trace" aria-labelledby="gp-trace-title" hidden><div class="gp-trace-top"><h3 id="gp-trace-title" tabindex="-1"></h3><span class="gp-trace-type"></span></div>',
            '<dl><div><dt class="gp-source-label"></dt><dd class="gp-source-value"></dd></div><div><dt class="gp-target-label"></dt><dd class="gp-target-value"></dd></div><div><dt class="gp-signal-label"></dt><dd class="gp-signal-value"></dd></div></dl><p class="gp-trace-note"></p></section>',
            '<div class="gp-controls"><button class="gp-intercept" type="button"><span class="gp-intercept-icon" aria-hidden="true">⌖</span><span class="gp-intercept-text"></span></button><button class="gp-advance" type="button" hidden></button><button class="gp-action" type="button"></button></div>',
            '<footer class="gp-footer"><span class="gp-footer-sim"></span><button class="gp-reset" type="button"></button></footer>',
            '</div></div>'
        ].join('');
        document.body.append(dialog);
        const q = selector => dialog.querySelector(selector);
        const ui = {};
        for (const [key, selector] of Object.entries({
            brand: '.gp-brand', sim: '.gp-sim span', close: '.gp-close', topbar: '.gp-topbar', title: '#gp-title', deck: '#gp-deck',
            roundName: '.gp-round-name', roundLabel: '.gp-round-label', roundValue: '.gp-round-value',
            securedLabel: '.gp-secured-label', securedValue: '.gp-secured-value', attemptsLabel: '.gp-attempts-label',
            attemptsValue: '.gp-attempts-value', stageLabel: '.gp-stage-label', stageState: '.gp-stage-state', map: '.gp-map',
            route: '.gp-route', routeGlow: '.gp-route-glow', entryNode: '.gp-entry-node', coreNode: '.gp-core-node',
            packet: '.gp-packet', halo: '.gp-packet-halo', entryLabel: '.gp-entry-label',
            gateLabel: '.gp-gate-label', coreLabel: '.gp-core-label', progress: '.gp-progress',
            instruction: '.gp-instruction', mode: '.gp-mode', intercept: '.gp-intercept', interceptText: '.gp-intercept-text',
            advance: '.gp-advance', action: '.gp-action', feedback: '.gp-feedback',
            feedbackMark: '.gp-feedback-mark', feedbackText: '.gp-feedback-text', trace: '.gp-trace',
            traceTitle: '#gp-trace-title', traceType: '.gp-trace-type', sourceLabel: '.gp-source-label',
            sourceValue: '.gp-source-value', targetLabel: '.gp-target-label', targetValue: '.gp-target-value',
            signalLabel: '.gp-signal-label', signalValue: '.gp-signal-value', traceNote: '.gp-trace-note',
            footerSim: '.gp-footer-sim', reset: '.gp-reset'
        })) ui[key] = q(selector);
        const reduced = matchMedia('(prefers-reduced-motion: reduce)');
        const game = { round: 0, secured: 0, attempts: 0, phase: 'ready', progress: 0, miss: '', raf: 0, startAt: 0, paused: false, returnFocus: null, manualStep: false, windowNotice: '' };
        const stepMode = () => reduced.matches || game.manualStep;

        function stopMotion() {
            if (game.raf) cancelAnimationFrame(game.raf);
            game.raf = 0;
            game.startAt = 0;
        }
        function setPacket(progress) {
            game.progress = Math.max(0, Math.min(1, progress));
            const point = ui.route.getPointAtLength(ui.route.getTotalLength() * game.progress);
            for (const circle of [ui.packet, ui.halo]) {
                circle.setAttribute('cx', point.x.toFixed(1));
                circle.setAttribute('cy', point.y.toFixed(1));
            }
            ui.progress.value = Math.round(game.progress * 100);
            ui.map.classList.toggle('gp-in-gate', point.x >= 590 && point.x <= 790);
            return point;
        }
        function render() {
            const t = text[lang()], round = rounds[game.round], info = round[lang()];
            ui.brand.textContent = t.brand;
            ui.sim.textContent = t.simulated;
            ui.close.setAttribute('aria-label', t.close);
            ui.title.textContent = t.title;
            ui.deck.textContent = t.deck;
            ui.roundName.textContent = info[0];
            ui.roundLabel.textContent = t.round;
            ui.roundValue.textContent = String(game.round + 1).padStart(2, '0') + ' / 03';
            ui.securedLabel.textContent = t.secured;
            ui.securedValue.textContent = game.secured + ' / 3';
            ui.attemptsLabel.textContent = t.attempts;
            ui.attemptsValue.textContent = String(game.attempts).padStart(2, '0');
            ui.stageLabel.textContent = t.stageLabel;
            ui.stageState.textContent = t.simTag;
            ui.map.setAttribute('aria-label', t.stageLabel);
            ui.entryLabel.textContent = t.entry;
            ui.gateLabel.textContent = t.gate;
            ui.coreLabel.textContent = t.core;
            ui.progress.setAttribute('aria-label', t.progress);
            ui.instruction.textContent = stepMode() ? t.stepHelp : t.gateHelp;
            ui.instruction.hidden = game.phase === 'caught' || game.phase === 'secured';
            ui.mode.textContent = reduced.matches ? t.stepSystem : stepMode() ? t.stepOn : t.stepOff;
            ui.mode.setAttribute('aria-pressed', String(stepMode()));
            ui.mode.disabled = reduced.matches;
            ui.interceptText.textContent = t.intercept;
            ui.advance.textContent = t.advance;
            ui.reset.textContent = t.reset;
            ui.footerSim.textContent = t.simulated;
            ui.traceTitle.textContent = t.traceTitle;
            ui.traceType.textContent = info[1];
            ui.sourceLabel.textContent = t.source;
            ui.sourceValue.textContent = round.source;
            ui.targetLabel.textContent = t.target;
            ui.targetValue.textContent = round.target;
            ui.signalLabel.textContent = t.signal;
            ui.signalValue.textContent = info[2];
            ui.traceNote.textContent = t.traceNote;
            ui.trace.hidden = game.phase !== 'caught' && game.phase !== 'secured';
            ui.intercept.disabled = game.phase !== 'running';
            ui.intercept.hidden = game.phase !== 'running';
            ui.advance.hidden = !stepMode() || game.phase !== 'running';
            ui.action.hidden = game.phase === 'running';
            ui.action.textContent = game.phase === 'ready' ? t.start :
                game.phase === 'missed' ? t.retry :
                game.phase === 'caught' ? t.quarantine :
                game.round === rounds.length - 1 ? t.replay : t.next;
            ui.feedbackText.textContent = game.phase === 'ready' ? t.ready :
                game.phase === 'running' ? (game.windowNotice === 'inside' ? t.gateNow : game.windowNotice === 'passed' ? t.gatePassed : stepMode() ? t.runningStep : t.running) :
                game.phase === 'missed' ? t[game.miss] :
                game.phase === 'caught' ? t.caught :
                game.round === rounds.length - 1 ? t.complete : t.securedMessage;
            ui.feedbackMark.textContent = game.phase === 'missed' ? '×' :
                game.phase === 'caught' || game.phase === 'secured' ? '✓' : '›';
            ui.feedback.className = 'gp-feedback gp-' + game.phase;
            ui.map.classList.toggle('gp-caught', game.phase === 'caught' || game.phase === 'secured');
            ui.map.classList.toggle('gp-missed', game.phase === 'missed');
            dialog.classList.toggle('gp-step-mode', stepMode());
        }
        function configureRound() {
            const path = rounds[game.round].path;
            ui.route.setAttribute('d', path);
            ui.routeGlow.setAttribute('d', path);
            ui.entryNode.setAttribute('cy', ui.route.getPointAtLength(0).y.toFixed(1));
            ui.coreNode.setAttribute('cy', ui.route.getPointAtLength(ui.route.getTotalLength()).y.toFixed(1));
            setPacket(game.progress);
            render();
        }
        function miss(reason) {
            stopMotion();
            game.phase = 'missed';
            game.miss = reason;
            render();
            ui.action.focus();
        }
        function frame(now) {
            if (!dialog.open || game.phase !== 'running' || document.hidden || stepMode()) return;
            setPacket(Math.min(1, (now - game.startAt) / durations[game.round]));
            if (game.progress >= 1) { miss('escaped'); return; }
            game.raf = requestAnimationFrame(frame);
        }
        function startMotion() {
            if (stepMode() || document.hidden || !dialog.open || game.phase !== 'running') return;
            stopMotion();
            game.startAt = performance.now() - game.progress * durations[game.round];
            game.raf = requestAnimationFrame(frame);
        }
        function alignPlayfield() {
            if (!dialog.open || game.phase !== 'running') return;
            const mapTop = ui.map.getBoundingClientRect().top;
            const headerBottom = ui.topbar.getBoundingClientRect().bottom;
            const controlBottom = Math.max(ui.intercept.getBoundingClientRect().bottom,
                stepMode() ? ui.advance.getBoundingClientRect().bottom : 0);
            const dialogBottom = dialog.getBoundingClientRect().bottom;
            const needed = Math.max(0, headerBottom + 8 - mapTop);
            const available = Math.max(0, dialogBottom - 12 - controlBottom);
            if (needed && available) dialog.scrollTop = Math.max(0, dialog.scrollTop - Math.min(needed, available));
        }
        function startAttempt() {
            stopMotion();
            game.attempts += 1;
            game.phase = 'running';
            game.miss = '';
            game.windowNotice = '';
            setPacket(stepMode() ? 0.08 : 0);
            render();
            ui.intercept.focus();
            alignPlayfield();
            startMotion();
        }
        function intercept() {
            if (game.phase !== 'running') return;
            const point = setPacket(game.progress);
            if (point.x >= 590 && point.x <= 790) {
                stopMotion();
                game.phase = 'caught';
                render();
                ui.traceTitle.focus({ preventScroll: true });
                ui.trace.scrollIntoView({ block: 'start', behavior: 'auto' });
            } else miss(point.x < 590 ? 'early' : 'late');
        }
        function advance() {
            if (!stepMode() || game.phase !== 'running') return;
            const point = setPacket(Math.min(1, game.progress + 0.1));
            const notice = point.x >= 590 && point.x <= 790 ? 'inside' : point.x > 790 ? 'passed' : '';
            if (notice !== game.windowNotice) {
                game.windowNotice = notice;
                if (notice) {
                    ui.feedbackText.textContent = text[lang()][notice === 'inside' ? 'gateNow' : 'gatePassed'];
                    ui.feedbackMark.textContent = '!';
                    ui.feedback.className = 'gp-feedback gp-window';
                }
            }
            if (point.x > 790 && game.progress >= 1) miss('escaped');
            else alignPlayfield();
        }
        function toggleStepMode() {
            if (reduced.matches) return;
            game.manualStep = !game.manualStep;
            game.windowNotice = stepMode() && ui.map.classList.contains('gp-in-gate') ? 'inside' : '';
            if (game.phase === 'running') {
                if (stepMode()) stopMotion();
                else startMotion();
            }
            render();
            alignPlayfield();
        }
        function reset() {
            stopMotion();
            game.round = 0; game.secured = 0; game.attempts = 0;
            game.phase = 'ready'; game.progress = 0; game.miss = ''; game.windowNotice = '';
            configureRound();
            dialog.scrollTop = 0;
            ui.title.focus({ preventScroll: true });
        }
        function primaryAction() {
            if (game.phase === 'ready' || game.phase === 'missed') startAttempt();
            else if (game.phase === 'caught') {
                game.secured += 1;
                game.phase = 'secured';
                render();
            } else if (game.phase === 'secured') {
                if (game.round === rounds.length - 1) reset();
                else {
                    game.round += 1;
                    game.phase = 'ready'; game.progress = 0; game.miss = ''; game.windowNotice = '';
                    configureRound();
                    dialog.scrollTop = 0;
                    ui.title.focus({ preventScroll: true });
                }
            }
        }
        function openGame(trigger) {
            if (dialog.open || document.body.classList.contains('recruiter-mode')) return;
            game.returnFocus = trigger || triggers[0];
            game.round = 0; game.secured = 0; game.attempts = 0;
            game.phase = 'ready'; game.progress = 0; game.miss = ''; game.windowNotice = '';
            configureRound();
            dialog.showModal();
            document.body.classList.add('gp-open');
            ui.action.focus();
        }

        triggers.forEach(trigger => trigger.addEventListener('click', () => openGame(trigger)));
        ui.close.addEventListener('click', () => dialog.close());
        ui.intercept.addEventListener('click', intercept);
        ui.advance.addEventListener('click', advance);
        ui.mode.addEventListener('click', toggleStepMode);
        ui.action.addEventListener('click', primaryAction);
        ui.reset.addEventListener('click', reset);
        dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
        dialog.addEventListener('close', () => {
            stopMotion();
            document.body.classList.remove('gp-open');
            if (location.hash === '#signal-hunt') history.replaceState(history.state, '', location.pathname + location.search);
            if (game.returnFocus?.isConnected && !document.body.classList.contains('recruiter-mode')) game.returnFocus.focus({ preventScroll: true });
        });
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && game.phase === 'running') {
                stopMotion();
                game.paused = true;
            } else if (!document.hidden && game.paused && game.phase === 'running') {
                game.paused = false;
                startMotion();
            }
        });
        reduced.addEventListener?.('change', () => {
            if (game.phase === 'running') {
                if (stepMode()) stopMotion();
                else startMotion();
            }
            game.windowNotice = stepMode() && ui.map.classList.contains('gp-in-gate') ? 'inside' : '';
            render();
        });
        window.addEventListener('langchange', render);
        new MutationObserver(() => {
            if (dialog.open && document.body.classList.contains('recruiter-mode')) dialog.close();
        }).observe(document.body, { attributes: true, attributeFilter: ['class'] });
        function autoOpen() {
            if (location.hash === '#signal-hunt' && !dialog.open && document.body.classList.contains('booted')) openGame(triggers[0]);
        }
        window.addEventListener('hashchange', autoOpen);
        if (location.hash === '#signal-hunt') {
            if (document.body.classList.contains('booted')) autoOpen();
            else window.addEventListener('kd-booted', autoOpen, { once: true });
        }
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
    else init();
})();
