// HR mode: swaps the console for a clean, light, print-friendly recruiter summary.
document.addEventListener('DOMContentLoaded', () => {
    const hrSwitch = document.getElementById('hr-switch');
    if (!hrSwitch) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const toggle = () => {
        const on = !document.body.classList.contains('recruiter-mode');
        document.body.classList.toggle('recruiter-mode', on);
        hrSwitch.classList.toggle('active', on);
        hrSwitch.setAttribute('aria-checked', on ? 'true' : 'false');
        window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    };

    hrSwitch.addEventListener('click', toggle);
});
