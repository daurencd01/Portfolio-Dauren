// Section navigation: numbered tabs, mobile tab bar and progress dots share one scroll-spy.
document.addEventListener('DOMContentLoaded', () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ids = ['home', 'about', 'experience', 'projects', 'skills', 'certs', 'contact'];

    document.querySelectorAll('[data-target]').forEach((el) => {
        el.addEventListener('click', (e) => {
            const target = document.getElementById(el.dataset.target);
            if (!target) return;
            e.preventDefault();
            if (document.body.classList.contains('recruiter-mode') && el.dataset.target === 'home') {
                window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
            } else {
                target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
            }
            if (history.replaceState) history.replaceState(null, '', '#' + el.dataset.target);
        });
    });

    const marks = [...document.querySelectorAll('.tab, .tab-btn, .pdot')];
    let ticking = false;

    const update = () => {
        ticking = false;
        const probe = window.innerHeight * 0.38;
        let active = ids[0];
        ids.forEach((id) => {
            const el = document.getElementById(id);
            if (el && el.getBoundingClientRect().top - probe <= 0) active = id;
        });
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) active = ids[ids.length - 1];
        marks.forEach((m) => m.classList.toggle('active', m.dataset.target === active));
    };

    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
});
