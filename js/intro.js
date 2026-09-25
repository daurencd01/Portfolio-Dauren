// Boot animation shown once on open; when it ends the dashboard panels power on.
(function () {
    const intro = document.getElementById('intro-screen');
    const boot = () => {
        document.body.classList.remove('intro-active');
        document.body.classList.add('booted');
        window.dispatchEvent(new Event('kd-booted'));
    };
    if (!intro) { boot(); return; }

    let done = false;
    const dismiss = () => {
        if (done) return;
        done = true;
        intro.classList.add('hide');
        boot();
        setTimeout(() => intro.remove(), 800);
    };

    document.body.classList.add('intro-active');

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { dismiss(); return; }

    let timer = setTimeout(dismiss, 2300);
    intro.addEventListener('click', () => { clearTimeout(timer); dismiss(); });
    window.addEventListener('load', () => { clearTimeout(timer); timer = setTimeout(dismiss, 1500); });
})();
