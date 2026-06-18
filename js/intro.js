// Boot / intro animation shown once when the site opens
(function () {
    const intro = document.getElementById('intro-screen');
    if (!intro) return;

    const dismiss = () => {
        if (intro.classList.contains('hide')) return;
        intro.classList.add('hide');
        document.body.classList.remove('intro-active');
        setTimeout(() => intro.remove(), 800);
    };

    // Lock scroll while the intro is on screen
    document.body.classList.add('intro-active');

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
        dismiss();
        return;
    }

    let timer = setTimeout(dismiss, 2200);

    // Let the visitor skip it
    intro.addEventListener('click', () => {
        clearTimeout(timer);
        dismiss();
    });

    // Safety: never let it block the page if 'load' is slow
    window.addEventListener('load', () => {
        clearTimeout(timer);
        timer = setTimeout(dismiss, 1400);
    });
})();
