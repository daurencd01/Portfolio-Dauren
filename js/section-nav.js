// Section navigation: mobile bottom tab bar + desktop dot rail + prev/next flip buttons
document.addEventListener('DOMContentLoaded', () => {

    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scrollTo = (el) => el && el.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });

    // --- Click-to-jump for every nav control that carries a data-target (rail dots + tabs) ---
    const navButtons = [...document.querySelectorAll('[data-target]')];
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => scrollTo(document.getElementById(btn.dataset.target)));
    });

    const railDots = [...document.querySelectorAll('.rail-dot')];
    const tabBtns = [...document.querySelectorAll('.tab-btn')];

    // Returns the last target id (from the given ordered list) whose section has scrolled past the probe line
    const activeFor = (ids) => {
        const probe = window.innerHeight * 0.4;
        let active = ids[0];
        ids.forEach(id => {
            const el = document.getElementById(id);
            if (el && el.getBoundingClientRect().top - probe <= 1) active = id;
        });
        return active;
    };

    const highlight = () => {
        if (railDots.length) {
            const ra = activeFor(railDots.map(d => d.dataset.target));
            railDots.forEach(d => d.classList.toggle('active', d.dataset.target === ra));
        }
        if (tabBtns.length) {
            const ta = activeFor(tabBtns.map(t => t.dataset.target));
            tabBtns.forEach(t => t.classList.toggle('active', t.dataset.target === ta));
        }
    };

    // --- Prev / Next flip buttons: walk through every major section in order ---
    const flipOrder = ['hero', 'about', 'experience', 'blue-team', 'skills', 'extra',
        'education', 'featured-cert', 'certificates', 'mindset', 'dashboard', 'contact'];
    const flipSections = flipOrder
        .map(id => document.getElementById(id))
        .filter(Boolean);

    const currentIndex = () => {
        const probe = window.innerHeight * 0.35;
        let idx = 0;
        flipSections.forEach((s, i) => {
            if (s.getBoundingClientRect().top - probe <= 1) idx = i;
        });
        return idx;
    };

    const prevBtn = document.getElementById('flip-prev');
    const nextBtn = document.getElementById('flip-next');

    prevBtn && prevBtn.addEventListener('click', () => {
        scrollTo(flipSections[Math.max(0, currentIndex() - 1)]);
    });
    nextBtn && nextBtn.addEventListener('click', () => {
        scrollTo(flipSections[Math.min(flipSections.length - 1, currentIndex() + 1)]);
    });

    const updateState = () => {
        highlight();
        const i = currentIndex();
        if (prevBtn) prevBtn.classList.toggle('disabled', i <= 0);
        if (nextBtn) nextBtn.classList.toggle('disabled', i >= flipSections.length - 1);
    };

    window.addEventListener('scroll', updateState, { passive: true });
    window.addEventListener('resize', updateState, { passive: true });
    updateState();
});
