const themeConfig = {
    colors: {
        blue: [0, 229, 255], // RGB
        red: [255, 0, 60]    // RGB
    }
};

function interpolateColor(color1, color2, factor) {
    if (arguments.length < 3) return color1;
    let result = color1.slice();
    for (let i = 0; i < 3; i++) {
        result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
    }
    return `rgb(${result[0]}, ${result[1]}, ${result[2]})`;
}

// Function exported for use by HR mode to force reset
function updateThemeScroll() {
    if (document.body.classList.contains('recruiter-mode')) return;

    const scrollTop = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = Math.min(Math.max(scrollTop / docHeight, 0), 1);

    const newColor = interpolateColor(themeConfig.colors.blue, themeConfig.colors.red, scrollPercent);
    document.documentElement.style.setProperty('--theme-color', newColor);
    document.documentElement.style.setProperty('--theme-shadow', newColor.replace('rgb', 'rgba').replace(')', ', 0.4)'));
}

document.addEventListener('scroll', updateThemeScroll);
