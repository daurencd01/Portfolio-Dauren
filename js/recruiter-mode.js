document.addEventListener('DOMContentLoaded', () => {
    let isRecruiterMode = false;
    const hrSwitch = document.getElementById('hr-switch');

    if (hrSwitch) {
        hrSwitch.addEventListener('click', () => {
            isRecruiterMode = !isRecruiterMode;
            document.body.classList.toggle('recruiter-mode', isRecruiterMode);
            hrSwitch.classList.toggle('active', isRecruiterMode);

            // Reset color if HR mode ON
            if (isRecruiterMode) {
                document.documentElement.style.setProperty('--theme-color', '#333');
            } else {
                // Trigger scroll event to reset color to correct timeline point
                window.dispatchEvent(new Event('scroll'));
            }
        });
    }
});
