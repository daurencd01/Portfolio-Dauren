// CV language picker: EN / RU / KZ. Independent from the site UI language.
window.KDCv = (function () {
    const KEY = 'kd-cv-lang';
    const FILES = {
        en: 'assets/cv/Koshkenbek_Dauren_CV_EN.pdf',
        ru: 'assets/cv/Koshkenbek_Dauren_CV_RU.pdf',
        kz: 'assets/cv/Koshkenbek_Dauren_CV_KZ.pdf'
    };
    const NAMES = {
        en: 'Koshkenbek_Dauren_CV_EN.pdf',
        ru: 'Koshkenbek_Dauren_CV_RU.pdf',
        kz: 'Koshkenbek_Dauren_CV_KZ.pdf'
    };
    let current = 'en';

    function apply(lang) {
        if (!FILES[lang]) return;
        current = lang;
        document.querySelectorAll('.js-cv-link').forEach((a) => {
            a.href = FILES[lang];
            a.setAttribute('download', NAMES[lang]);
        });
        document.querySelectorAll('.cv-lang-group button').forEach((b) => {
            b.classList.toggle('active', b.dataset.cvlang === lang);
        });
        try { localStorage.setItem(KEY, lang); } catch (e) { /* storage unavailable */ }
    }

    function get() { return current; }

    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('.cv-lang-group').forEach((group) => {
            group.addEventListener('click', (e) => {
                const btn = e.target.closest('button[data-cvlang]');
                if (btn) apply(btn.dataset.cvlang);
            });
        });

        let start = 'en';
        try {
            const saved = localStorage.getItem(KEY);
            if (saved && FILES[saved]) start = saved;
        } catch (e) { /* ignore */ }
        apply(start);
    });

    return { apply, get };
})();
