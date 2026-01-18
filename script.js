document.addEventListener('DOMContentLoaded', () => {

    // --- Configuration ---
    const config = {
        scrollTheme: true,
        colors: {
            blue: [0, 229, 255], // RGB
            red: [255, 0, 60]    // RGB
        }
    };

    // --- Translations ---
    const translations = {
        en: {
            nav: { hr: "HR MODE", about: "ABOUT", exp: "EXPERIENCE", dashboard: "SOC-DASH", modules: "KNOWLEDGE" },
            hero: { name: "KOSHKENBEK DAUREN", title: "CYBERSECURITY SPECIALIST", role1: "SOC ANALYST L1", role2: "PENTESTER (in training)", tagline: "\"Defending systems. Simulating attacks. Securing the future.\"", scroll: "SCROLL_DOWN" },
            about: { desc: "Koshkenbek Dauren is a 3rd-year Cybersecurity student at Astana IT University and a SOC Analyst L1 with hands-on experience in real-world security monitoring.\n\nCurrently working at Sr Holding, a Chinese company, where I have been part of the Security Operations Center for over 5 months. My responsibilities include continuous monitoring, log analysis, and initial incident investigation across network, endpoint, and system-level events.\n\nWhile my professional experience is focused on Blue Team operations, I am actively transitioning toward penetration testing. I am studying offensive security independently, practicing with Kali Linux and its toolset, and building a strong foundation in ethical hacking methodologies.\n\nIn parallel, I am developing my own technical initiatives and mini-startups, including OYNA and CyberQuest Arena, combining cybersecurity knowledge with product and platform thinking." },
            goals: { short_title: "SHORT-TERM GOAL", short_desc: "SOC Analyst L2 / Blue Team Engineer", long_title: "LONG-TERM GOAL", long_desc: "Penetration Tester with strong defensive background" },
            exp: { title: "PROFESSIONAL EXPERIENCE", role: "SOC Analyst L1", company: "Sr Holding (China)", date: "5 months – Present", list1: "Security event monitoring in SOC environment", list2: "Log analysis from network, endpoint, and system sources", list3: "Initial incident triage and alert investigation", list4: "Identification of suspicious activity and escalation when required", list5: "Working with security monitoring tools and dashboards" },
            dash: { title: "LIVE SOC DASHBOARD", threats: "THREATS BLOCKED", uptime: "SYSTEM UPTIME" },
            mindset: { title: "HOW I THINK", blue_h: "BLUE TEAM MINDSET", blue_desc: "I focus on visibility, detection logic, and understanding what is normal versus suspicious behavior in systems and networks.", red_h: "RED TEAM MINDSET", red_desc: "I analyze systems from an attacker’s perspective, looking for misconfigurations, weak points, and realistic attack paths." },
            blue: { title: "BLUE TEAM SKILLS", card1: { title: "SOC MONITORING", desc: "Real-time analysis of security alerts and SIEM logs." }, card2: { title: "INCIDENT DETECTION", desc: "Triage, investigation, and threat analysis." } },
            red: { title: "RED TEAM SKILLS", card1: { title: "PENTESTING FUNDAMENTALS", desc: "Web & Network security basics, ethical hacking mindset." }, card2: { title: "VULNERABILITY ASSESSMENT", desc: "Systematic identification and prioritization of security weaknesses." } },
            skills: { title: "TOOLS & TECHNOLOGIES" },
            archives: { title: "EDUCATION & CERTIFICATIONS", cert: "CERTIFICATE", edu: "EDUCATION", e1: { title: "Astana IT University", time: "3rd year student", desc: "Bachelor’s Degree — Cybersecurity" }, c1: { title: "Exploratory Data Analysis for Machine Learning", provider: "IBM" }, c2: { title: "Securing Cloud and Hybrid Networks", provider: "LearnQuest" }, c3: { title: "Next-Generation Firewalls and Intrusion Prevention", provider: "LearnQuest" }, c4: { title: "Supervised Machine Learning: Regression", provider: "IBM" } },
            languages: { title: "LANGUAGES", kk: "Kazakh — Native", ru: "Russian — C2", en: "English — B2", zh: "Chinese — HSK 6" },
            projects: { title: "PROJECTS / INITIATIVES", p1: { title: "OYNA", desc: "Cyber-related mini startup focused on interactive and educational concepts." }, p2: { title: "CyberQuest Arena", desc: "Cybersecurity learning and challenge-based project aimed at developing practical security skills." } },
            contact: { title: "INITIATE CONTACT", p_name: "CODENAME", p_email: "LINK_FREQUENCY (EMAIL)", p_msg: "TRANSMISSION DATA", btn: "TRANSMIT" }
        },
        ru: {
            nav: { hr: "HR РЕЖИМ", about: "ОБО МНЕ", exp: "ОПЫТ РАБОТЫ", dashboard: "SOC-ДАШБОРД", modules: "ЗНАНИЯ" },
            hero: { name: "КОШКЕНБЕК ДАУРЕН", title: "СПЕЦИАЛИСТ ПО КИБЕРБЕЗОПАСНОСТИ", role1: "SOC АНАЛИТИК", role2: "ПЕНТЕСТЕР", tagline: "\"Защита систем. Симуляция атак. Безопасное будущее.\"", scroll: "ВНИЗ" },
            about: { desc: "Koshkenbek Dauren — студент 3 курса Astana IT University по направлению Cybersecurity и SOC Analyst L1 с практическим опытом работы в центре мониторинга безопасности.\n\nНа данный момент более 5 месяцев работаю в китайской компании Sr Holding в роли SOC Analyst L1. Занимаюсь постоянным мониторингом событий безопасности, анализом логов, сетевого трафика и endpoint-событий, а также первичной обработкой и классификацией инцидентов.\n\nМой коммерческий опыт сосредоточен на Blue Team, однако я активно развиваюсь в направлении penetration testing. Изучаю offensive security, уверенно работаю с Kali Linux и его инструментами, осваиваю подходы этичного хакинга и уязвимостей.\n\nПараллельно разрабатываю собственные мини-проекты и стартапы, такие как OYNA и CyberQuest Arena, совмещая кибербезопасность с продуктовым мышлением." },
            goals: { short_title: "КРАТКОСРОЧНАЯ ЦЕЛЬ", short_desc: "SOC Analyst L2 / Blue Team Engineer", long_title: "ДОЛГОСРОЧНАЯ ЦЕЛЬ", long_desc: "Penetration Tester с сильным защитным бэкграундом" },
            exp: { title: "ОПЫТ РАБОТЫ", role: "SOC Analyst L1", company: "Sr Holding (China)", date: "5 месяцев – По настоящее время", list1: "Мониторинг событий безопасности в SOC", list2: "Анализ логов сетевых устройств, endpoint и систем", list3: "Первичная обработка алертов и инцидентов", list4: "Выявление подозрительной активности и эскалация", list5: "Работа с системами мониторинга и аналитическими панелями" },
            dash: { title: "LIVE SOC ДАШБОРД", threats: "УГРОЗ ОТРАЖЕНО", uptime: "АПТАЙМ" },
            mindset: { title: "КАК Я МЫШЛЮ", blue_h: "МЫШЛЕНИЕ BLUE TEAM", blue_desc: "Я фокусируюсь на видимости, логике обнаружения и понимании того, что является нормальным, а что подозрительным поведением в системах и сетях.", red_h: "МЫШЛЕНИЕ RED TEAM", red_desc: "Я анализирую системы с точки зрения атакующего, ищу ошибки конфигурации, слабые места и реалистичные пути атаки." },
            blue: { title: "НАВЫКИ BLUE TEAM", card1: { title: "SOC МОНИТОРИНГ", desc: "Анализ угроз в реальном времени и работа с логами." }, card2: { title: "ОБНАРУЖЕНИЕ ИНЦИДЕНТОВ", desc: "Три аж, расследование и анализ угроз." } },
            red: { title: "НАВЫКИ RED TEAM", card1: { title: "ОСНОВЫ PENTESTING", desc: "Основы веб и сетевой безопасности, этичный хакинг." }, card2: { title: "ОЦЕНКА УЯЗВИМОСТЕЙ", desc: "Систематическое выявление и приоритизация слабых мест." } },
            skills: { title: "ИНСТРУМЕНТЫ И ТЕХНОЛОГИИ" },
            archives: { title: "ОБРАЗОВАНИЕ И СЕРТИФИКАТЫ", cert: "СЕРТИФИКАТ", edu: "ОБРАЗОВАНИЕ", e1: { title: "Astana IT University", time: "Студент 3 курса", desc: "Бакалавриат — Кибербезопасность" }, c1: { title: "Exploratory Data Analysis for Machine Learning", provider: "IBM" }, c2: { title: "Securing Cloud and Hybrid Networks", provider: "LearnQuest" }, c3: { title: "Next-Generation Firewalls and Intrusion Prevention", provider: "LearnQuest" }, c4: { title: "Supervised Machine Learning: Regression", provider: "IBM" } },
            languages: { title: "ЯЗЫКИ", kk: "Казахский — Родной", ru: "Русский — C2", en: "Английский — B2", zh: "Китайский — HSK 6" },
            projects: { title: "ПРОЕКТЫ / ИНИЦИАТИВЫ", p1: { title: "OYNA", desc: "Кибер-стартап, ориентированный на интерактивные и образовательные концепции." }, p2: { title: "CyberQuest Arena", desc: "Проект по обучению кибербезопасности, нацеленный на развитие практических навыков." } },
            contact: { title: "ИНИЦИИРОВАТЬ КОНТАКТ", p_name: "КОДОВОЕ ИМЯ", p_email: "ЧАСТОТА СВЯЗИ (EMAIL)", p_msg: "ДАННЫЕ ПЕРЕДАЧИ", btn: "ОТПРАВИТЬ" }
        }
    };

    // --- State & interpolation ---
    let currentLang = 'en';
    let isRecruiterMode = false;

    // --- Core 1: Scroll-Based Theme ---
    function interpolateColor(color1, color2, factor) {
        if (arguments.length < 3) return color1;
        let result = color1.slice();
        for (let i = 0; i < 3; i++) {
            result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
        }
        return `rgb(${result[0]}, ${result[1]}, ${result[2]})`;
    }

    window.addEventListener('scroll', () => {
        if (isRecruiterMode) return;

        const scrollTop = window.scrollY;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = Math.min(Math.max(scrollTop / docHeight, 0), 1);

        const newColor = interpolateColor(config.colors.blue, config.colors.red, scrollPercent);
        document.documentElement.style.setProperty('--theme-color', newColor);
        document.documentElement.style.setProperty('--theme-shadow', newColor.replace('rgb', 'rgba').replace(')', ', 0.4)'));
    });

    // --- Core 2: HR Mode Toggle ---
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
                // Trigger scroll event to reset color
                window.dispatchEvent(new Event('scroll'));
            }
        });
    }

    // --- Core 3: Canvas Logs (Interactive Background) ---
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
                ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--theme-color');
                ctx.globalAlpha = 0.3;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        for (let i = 0; i < 50; i++) particles.push(new Particle());

        function animate() {
            if (!isRecruiterMode) {
                ctx.clearRect(0, 0, width, height);
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
                            ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--theme-color');
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

    // --- Language Logic ---
    function updateLanguage(lang) {
        currentLang = lang;
        document.querySelectorAll('#lang-switch span').forEach(s => s.classList.remove('active'));
        document.querySelector(`#lang-switch span[data-lang="${lang}"]`).classList.add('active');

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const txt = key.split('.').reduce((o, i) => o[i], translations[lang]);
            if (txt) {
                // Check if it's the about text to preserve line breaks
                if (key === 'about.desc') {
                    el.innerText = txt; // innerText preserves \n
                } else {
                    el.innerText = txt;
                }
            }
        });
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            const txt = key.split('.').reduce((o, i) => o[i], translations[lang]);
            if (txt) el.placeholder = txt;
        });
    }

    document.getElementById('lang-switch').addEventListener('click', (e) => {
        const lang = e.target.getAttribute('data-lang');
        if (lang) updateLanguage(lang);
    });

    // Default Init
    updateLanguage('en');

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
