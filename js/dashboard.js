// Home dashboard behaviour: clock, simulated threat feed, 3D tilt, ID card parallax, scroll reveal.
document.addEventListener('DOMContentLoaded', () => {
    const T = (k) => (typeof window.t === 'function' && window.t(k)) || k;
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const rand = (a, b) => Math.floor(a + Math.random() * (b - a + 1));

    // ---- Astana clock ----
    const clock = document.getElementById('clock');
    const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Almaty', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    const fmtHM = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Almaty', hour: '2-digit', minute: '2-digit', hour12: false });
    const tick = () => { if (clock && !document.hidden) clock.textContent = fmt.format(new Date()); };
    tick();
    setInterval(tick, 1000);

    // ---- simulated threat feed (documentation-range IPs; labelled SIMULATED in the UI) ----
    const feed = document.getElementById('threat-feed');
    const counter = document.getElementById('threat-count');
    const ip = () => ['192.0.2.', '198.51.100.', '203.0.113.'][rand(0, 2)] + rand(2, 253);
    const kinds = [
        { k: 'login', d: ip },
        { k: 'ps', d: () => 'endpoint-0' + rand(1, 9) },
        { k: 'scan', d: ip },
        { k: 'shell', d: () => '/wp-admin/' },
        { k: 'auth', d: () => '10.10.' + rand(1, 40) + '.' + rand(2, 250) }
    ];
    let count = 12408;
    const MAX_ROWS = 5;

    function row(kind, time, fresh) {
        const li = document.createElement('li');
        li.dataset.k = kind.k;
        if (fresh) li.className = 'fresh';
        const a = document.createElement('span'); a.className = 'arr'; a.textContent = '▸';
        const tm = document.createElement('span'); tm.className = 'tm'; tm.textContent = time;
        const ev = document.createElement('span'); ev.className = 'ev'; ev.textContent = T('ev.' + kind.k);
        const d = document.createElement('span'); d.className = 'ip'; d.textContent = kind.d();
        li.append(a, tm, ev, d);
        return li;
    }

    function pushEvent(silent) {
        if (!feed) return;
        const kind = kinds[rand(0, kinds.length - 1)];
        const li = row(kind, fmtHM.format(new Date()), !silent);
        feed.prepend(li);
        if (!silent) setTimeout(() => li.classList.remove('fresh'), 1400);
        while (feed.children.length > MAX_ROWS) feed.lastElementChild.remove();
        count += rand(1, 3);
        if (counter) counter.textContent = count.toLocaleString('en-US');
        if (!silent && window.KDGlobe) window.KDGlobe.ping();
    }

    if (feed) {
        feed.textContent = '';
        const base = new Date();
        [4, 3, 2, 1].forEach((m) => {
            const kind = kinds[rand(0, kinds.length - 1)];
            const past = new Date(base.getTime() - m * 3 * 60000);
            feed.prepend(row(kind, fmtHM.format(past), false));
        });
        pushEvent(true);
        const loop = () => {
            if (!document.hidden && !document.body.classList.contains('recruiter-mode')) pushEvent(false);
            setTimeout(loop, reduce ? 9000 : rand(2600, 5600));
        };
        setTimeout(loop, 2400);
        window.addEventListener('langchange', () => {
            feed.querySelectorAll('li').forEach((li) => {
                const ev = li.querySelector('.ev');
                if (ev) ev.textContent = T('ev.' + li.dataset.k);
            });
        });
    }

    // ---- 3D tilt for panels ----
    if (fine && !reduce) {
        document.querySelectorAll('[data-tilt]').forEach((el) => {
            const max = parseFloat(el.dataset.tilt) || 3;
            el.addEventListener('pointermove', (e) => {
                const r = el.getBoundingClientRect();
                const px = (e.clientX - r.left) / r.width;
                const py = (e.clientY - r.top) / r.height;
                el.style.setProperty('--ry', ((px - 0.5) * 2 * max).toFixed(2) + 'deg');
                el.style.setProperty('--rx', ((0.5 - py) * 2 * max).toFixed(2) + 'deg');
                el.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
                el.style.setProperty('--my', (py * 100).toFixed(1) + '%');
            });
            el.addEventListener('pointerleave', () => {
                el.style.removeProperty('--ry');
                el.style.removeProperty('--rx');
                el.style.removeProperty('--mx');
                el.style.removeProperty('--my');
            });
        });

        // hero: the ID card follows the pointer in 3D, panel glow follows too
        const hero = document.querySelector('[data-hero]');
        const card = document.getElementById('idcard');
        if (hero && card) {
            hero.addEventListener('pointermove', (e) => {
                const r = hero.getBoundingClientRect();
                const px = (e.clientX - r.left) / r.width;
                const py = (e.clientY - r.top) / r.height;
                card.style.setProperty('--ry', ((px - 0.55) * 34).toFixed(2) + 'deg');
                card.style.setProperty('--rx', ((0.5 - py) * 20 + 3).toFixed(2) + 'deg');
                card.style.setProperty('--sx', (px * 100).toFixed(0) + '%');
                card.style.setProperty('--sy', (py * 100).toFixed(0) + '%');
                hero.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
                hero.style.setProperty('--my', (py * 100).toFixed(1) + '%');
            });
            hero.addEventListener('pointerleave', () => {
                ['--ry', '--rx', '--sx', '--sy'].forEach((p) => card.style.removeProperty(p));
            });
        }
    }

    // ---- scroll reveal for the long-form sections ----
    const reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && !reduce) {
        document.body.classList.add('reveal-ready');
        const io = new IntersectionObserver((entries) => {
            entries.forEach((en) => {
                if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
        reveals.forEach((el) => io.observe(el));
    }
});
