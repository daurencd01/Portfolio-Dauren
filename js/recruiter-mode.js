document.addEventListener('DOMContentLoaded', () => {
    let isRecruiterMode = false;
    const hrSwitch = document.getElementById('hr-switch');

    const toggle = () => {
        isRecruiterMode = !isRecruiterMode;
        document.body.classList.toggle('recruiter-mode', isRecruiterMode);
        hrSwitch.classList.toggle('active', isRecruiterMode);
        hrSwitch.setAttribute('aria-checked', isRecruiterMode ? 'true' : 'false');

        if (isRecruiterMode) {
            // Flatten the dynamic neon theme to a neutral print-friendly tone
            document.documentElement.style.setProperty('--theme-color', '#333');
            // Bring the recruiter straight to the summary card at the top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            // Restore the scroll-driven neon theme
            window.dispatchEvent(new Event('scroll'));
        }
    };

    if (hrSwitch) {
        hrSwitch.addEventListener('click', toggle);
        hrSwitch.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggle();
            }
        });
    }
});
