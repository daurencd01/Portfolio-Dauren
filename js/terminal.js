// Interactive portfolio terminal (home panel). Commands print real portfolio facts.
(function () {
    const out = document.getElementById('term-out');
    const form = document.getElementById('term-form');
    const input = document.getElementById('term-in');
    if (!out || !form || !input) return;

    const T = (k) => (typeof window.t === 'function' && window.t(k)) || k;
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const PS = 'dauren@portfolio:~$';
    const history = [];
    let hIdx = 0;
    let busy = false;

    function line(text, cls) {
        const d = document.createElement('div');
        d.className = 'tl tl-' + (cls || 'out');
        d.textContent = text;
        out.appendChild(d);
        out.scrollTop = out.scrollHeight;
        return d;
    }

    function cmdLine(cmd) {
        const d = document.createElement('div');
        d.className = 'tl';
        const ps = document.createElement('span'); ps.className = 'ps'; ps.textContent = PS + ' ';
        const c = document.createElement('span'); c.className = 'c'; c.textContent = cmd;
        d.append(ps, c);
        out.appendChild(d);
        out.scrollTop = out.scrollHeight;
        return c;
    }

    const sections = ['home', 'about', 'experience', 'projects', 'skills', 'certs', 'contact'];

    const commands = {
        help: () => [T('term.help_h'), T('term.help')],
        whoami: () => ['dauren'],
        role: () => [T('term.role'), T('term.motto')],
        skills: () => [T('term.skills')],
        experience: () => T('term.experience').split('\n'),
        projects: () => T('term.projects').split('\n'),
        certs: () => [T('term.certs')],
        education: () => [T('term.education')],
        tools: () => [T('term.tools')],
        contact: () => [T('term.contact')],
        cv: () => {
            setTimeout(() => {
                const a = document.createElement('a');
                a.href = 'assets/cv/Koshkenbek_Dauren_CV.pdf';
                a.download = '';
                document.body.appendChild(a); a.click(); a.remove();
            }, 350);
            return [T('term.cv')];
        },
        lang: () => {
            const next = (typeof currentLang !== 'undefined' && currentLang === 'ru') ? 'en' : 'ru';
            const btn = document.querySelector('#lang-switch button[data-lang="' + next + '"]');
            if (btn) btn.click();
            return [T('term.lang')];
        },
        clear: () => { out.textContent = ''; return null; },
        sudo: () => [T('term.sudo')]
    };

    const aliases = {
        ls: 'help', 'cat role.txt': 'role', 'skills --list': 'skills', 'cat about.md': 'role',
        'cat contact.txt': 'contact', 'ls tools': 'tools', 'sudo su': 'sudo', 'sudo rm -rf /': 'sudo'
    };

    function run(raw, opts) {
        const cmd = raw.trim();
        if (!cmd) return;
        const key = aliases[cmd] || cmd.split(/\s+/)[0].toLowerCase();

        if (/^open\s+\w+/i.test(cmd)) {
            const id = cmd.split(/\s+/)[1].toLowerCase();
            if (sections.includes(id)) {
                line('→ ' + (id === 'contact' ? T('term.together') : id), 'ok');
                if (!(opts && opts.quiet)) {
                    const el = document.getElementById(id);
                    if (el) el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
                }
                return;
            }
        }

        const fn = commands[key];
        if (!fn) { line(key + ': ' + T('term.notfound')); return; }
        const res = fn();
        if (res) res.forEach((l) => line(l));
    }

    function typeCommand(cmd, done) {
        const target = cmdLine('');
        const caret = document.createElement('span');
        caret.className = 'caret';
        target.after(caret);
        let i = 0;
        const tick = () => {
            target.textContent = cmd.slice(0, ++i);
            out.scrollTop = out.scrollHeight;
            if (i < cmd.length) setTimeout(tick, 34 + Math.random() * 30);
            else { caret.remove(); done(); }
        };
        tick();
    }

    function intro() {
        const seq = ['whoami', 'cat role.txt', 'skills --list', 'open contact'];
        busy = true;
        input.disabled = true;
        if (reduce) {
            seq.forEach((c) => { cmdLine(c); run(c, { quiet: true }); });
            busy = false; input.disabled = false;
            return;
        }
        let n = 0;
        const next = () => {
            if (n >= seq.length) { busy = false; input.disabled = false; return; }
            const c = seq[n++];
            typeCommand(c, () => { run(c, { quiet: true }); setTimeout(next, 380); });
        };
        next();
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (busy) return;
        const v = input.value;
        if (!v.trim()) return;
        history.push(v); hIdx = history.length;
        cmdLine(v);
        run(v);
        input.value = '';
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp' && history.length) {
            e.preventDefault(); hIdx = Math.max(0, hIdx - 1); input.value = history[hIdx] || '';
        } else if (e.key === 'ArrowDown' && history.length) {
            e.preventDefault(); hIdx = Math.min(history.length, hIdx + 1); input.value = history[hIdx] || '';
        } else if (e.key === 'Tab') {
            e.preventDefault();
            const p = input.value.trim().toLowerCase();
            if (!p) return;
            const m = Object.keys(commands).filter((c) => c.startsWith(p));
            if (m.length === 1) input.value = m[0];
        }
    });

    document.getElementById('terminal').addEventListener('click', () => { if (!busy) input.focus({ preventScroll: true }); });

    let started = false, visible = false;
    const tryStart = () => {
        if (started || !visible || !document.body.classList.contains('booted') || !document.documentElement.dataset.langReady) return;
        started = true;
        intro();
    };
    if (window.IntersectionObserver) {
        new IntersectionObserver((entries) => { visible = entries[0].isIntersecting; tryStart(); }, { threshold: 0.4 })
            .observe(document.getElementById('terminal'));
        window.addEventListener('kd-booted', tryStart);
        window.addEventListener('langchange', tryStart);
    } else { visible = true; window.addEventListener('kd-booted', tryStart); window.addEventListener('langchange', tryStart); }
})();
