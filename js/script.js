document.addEventListener('DOMContentLoaded', () => {

    // --- Canvas Logs (Interactive Background) ---
    const canvas = document.getElementById('cyber-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }
            draw() {
                // Get current calculated theme color from CSS root
                const themeColor = getComputedStyle(document.documentElement).getPropertyValue('--theme-color').trim();
                ctx.fillStyle = themeColor || '#00e5ff';
                ctx.globalAlpha = 0.3;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        for (let i = 0; i < 50; i++) particles.push(new Particle());

        function animate() {
            if (!document.body.classList.contains('recruiter-mode')) {
                ctx.clearRect(0, 0, width, height);
                // Re-fetch color to support smooth scroll transition
                const themeColor = getComputedStyle(document.documentElement).getPropertyValue('--theme-color').trim();

                particles.forEach(p => {
                    p.update();
                    p.draw();
                });

                // Simple Connect
                particles.forEach((p, index) => {
                    for (let j = index + 1; j < particles.length; j++) {
                        const dx = p.x - particles[j].x;
                        const dy = p.y - particles[j].y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist < 100) {
                            ctx.strokeStyle = themeColor || '#00e5ff';
                            ctx.globalAlpha = 0.1 * (1 - dist / 100);
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(p.x, p.y);
                            ctx.lineTo(particles[j].x, particles[j].y);
                            ctx.stroke();
                        }
                    }
                });
            }
            requestAnimationFrame(animate);
        }
        animate();
    }

    // --- Dashboard Fake Data ---
    setInterval(() => {
        if (Math.random() > 0.7) {
            const el = document.getElementById('threat-count');
            if (el) {
                let val = parseInt(el.innerText.replace(',', ''));
                el.innerText = (val + 1).toLocaleString();
            }
        }
        // Log simulator
        const logs = [
            "Scanning port 443...", "Packet flow normal.", "Anomaly detected in sector 4.", "Firewall rule updated."
        ];
        const logFeed = document.getElementById('log-feed');
        if (logFeed && Math.random() > 0.8) {
            logFeed.innerText = logs[Math.floor(Math.random() * logs.length)] + " [" + new Date().toLocaleTimeString() + "]";
        }
    }, 1000);

    // --- Scroll Fade In ---
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
});
