// Language Configuration and Logic
const translations = {
    en: {
        nav: { hr: "HR MODE", about: "ABOUT", exp: "EXPERIENCE", dashboard: "SOC-DASH", modules: "SKILLS", projects: "PROJECTS", top: "TOP", certs: "CERTS", contact: "CONTACT" },
        tab: { about: "About", exp: "Work", skills: "Skills", projects: "Projects", contact: "Contact" },
        hr: { tooltip: "Recruiter view — clean summary with CV, contacts & key facts", available: "Open to work · Astana, Kazakhstan", exp_label: "Experience", exp_val: "SOC Analyst L1 · Blue Team — Sauyt Lab, Sr Holding", edu_label: "Education", edu_val: "Astana IT University — Cybersecurity (graduated 2026)", cert_label: "Certifications", cert_val: "Red Hat RH124 · CyberShield CSCSA (STS)", lang_label: "Languages", lang_val: "Kazakh · Russian C1 · English B1 · Chinese HSK5" },
        hero: { name: "KOSHKENBEK DAUREN", title: "CYBERSECURITY SPECIALIST", role1: "SOC ANALYST L1", role2: "PENTESTER (in training)", tagline: "\"Defending systems. Simulating attacks. Securing the future.\"", scroll: "SCROLL_DOWN", cv: "DOWNLOAD CV" },
        about: { desc: "I am Koshkenbek Dauren, a Cybersecurity graduate of Astana IT University (Class of 2026) and a SOC Analyst L1 with hands-on experience in security monitoring.\n\nI currently work as a SOC Analyst L1 at Sauyt Lab (Freedom), supporting national-level information security operations in Kazakhstan. Previously, I worked in an international SOC environment at Sr Holding (China), where I monitored security events and analyzed logs from network, endpoint, and system sources.\n\nMy main focus is Blue Team operations, including alert triage, incident investigation, and security monitoring. At the same time, I am developing offensive security skills and studying penetration testing using Kali Linux.\n\nIn parallel, I build practical projects and initiatives, including HackShield and OYNA, combining cybersecurity knowledge with real-world product development." },
        goals: { short_title: "SHORT-TERM GOAL", short_desc: "SOC Analyst L2 / Blue Team Engineer", long_title: "LONG-TERM GOAL", long_desc: "Penetration Tester with strong defensive background" },
        exp: {
            title: "PROFESSIONAL EXPERIENCE",
            job1: {
                role: "SOC Analyst L1",
                company: "Sauyt Lab (Freedom)",
                date: "February 03, 2026 – Present",
                list1: "Security event monitoring in SOC environment",
                list2: "Log analysis from network, endpoint, and system sources",
                list3: "Initial alert triage and incident investigation",
                list4: "Identification of suspicious activity and escalation",
                list5: "Working within a high-responsibility national security environment"
            },
            job2: {
                role: "SOC Analyst L1",
                company: "Sr Holding (China)",
                date: "September 01, 2025 – February 01, 2026",
                list1: "Security event monitoring in SOC environment",
                list2: "Log analysis from network, endpoint, and system sources",
                list3: "Initial incident triage and alert investigation",
                list4: "Identification of suspicious activity and escalation when required",
                list5: "Working with security monitoring tools and dashboards"
            },
            job3: {
                role: "Network Security Project Participant",
                company: "Kazakhtelecom (Sapa+)",
                date: "January 20, 2025 – June 20, 2025",
                list1: "Participation in a network security project",
                list2: "Support of secure network infrastructure",
                list3: "Monitoring and basic analysis of network security events",
                list4: "Working within a large enterprise telecom environment"
            }
        },
        dash: { title: "SOC DASHBOARD", demo: "SIMULATION", threats: "THREATS BLOCKED", uptime: "SYSTEM UPTIME" },
        mindset: { title: "HOW I THINK", blue_h: "BLUE TEAM MINDSET", blue_desc: "I focus on visibility, detection logic, and understanding what is normal versus suspicious behavior in systems and networks.", red_h: "RED TEAM MINDSET", red_desc: "I analyze systems from an attacker’s perspective, looking for misconfigurations, weak points, and realistic attack paths." },
        blue: { title: "BLUE TEAM SKILLS", card1: { title: "SOC MONITORING", desc: "Real-time analysis of security alerts and SIEM logs." }, card2: { title: "INCIDENT DETECTION", desc: "Triage, investigation, and threat analysis." } },
        red: { title: "RED TEAM SKILLS", card1: { title: "PENTESTING FUNDAMENTALS", desc: "Web & Network security basics, ethical hacking mindset." }, card2: { title: "VULNERABILITY ASSESSMENT", desc: "Systematic identification and prioritization of security weaknesses." } },
        skills: { title: "TOOLS & TECHNOLOGIES", offensive: "OFFENSIVE", defensive: "DEFENSIVE", platforms: "OS & TOOLS" },
        archives: { title: "EDUCATION & CERTIFICATIONS", cert: "CERTIFICATE", edu: "EDUCATION", e1: { title: "Astana IT University", time: "Graduated in 2026", desc: "Bachelor’s Degree — Cybersecurity" }, c1: { title: "Exploratory Data Analysis for Machine Learning", provider: "IBM" }, c2: { title: "Securing Cloud and Hybrid Networks", provider: "LearnQuest" }, c3: { title: "Next-Generation Firewalls and Intrusion Prevention", provider: "LearnQuest" }, c4: { title: "Supervised Machine Learning: Regression", provider: "IBM" } },
        languages: { title: "LANGUAGES", kk: "Kazakh — Native", ru: "Russian — C1", en: "English — B1", zh: "Chinese — HSK 5" },
        projects: { title: "PROJECTS / INITIATIVES", diploma: "DIPLOMA", p1: { title: "HackShield", desc: "My graduation (diploma) project — a gamified cybersecurity training platform with interactive missions, challenges and a 2D game for practical skill-building." }, p2: { title: "OYNA", desc: "Kazakhstan’s first platform for amateur sports, enabling fair matchmaking by skill level and connecting verified organizers and players." } },
        contact: { title: "INITIATE CONTACT", subtitle: "Open to cybersecurity opportunities and collaboration", btn: "TRANSMIT" }
    },
    ru: {
        nav: { hr: "HR РЕЖИМ", about: "ОБО МНЕ", exp: "ОПЫТ РАБОТЫ", dashboard: "SOC-ДАШБОРД", modules: "НАВЫКИ", projects: "ПРОЕКТЫ", top: "ВВЕРХ", certs: "СЕРТЫ", contact: "КОНТАКТЫ" },
        tab: { about: "О себе", exp: "Опыт", skills: "Навыки", projects: "Проекты", contact: "Контакт" },
        hr: { tooltip: "Режим для рекрутёра — чистая сводка: CV, контакты и ключевые факты", available: "Открыт к предложениям · Астана, Казахстан", exp_label: "Опыт", exp_val: "SOC-аналитик L1 · Blue Team — Sauyt Lab, Sr Holding", edu_label: "Образование", edu_val: "Astana IT University — Кибербезопасность (выпуск 2026)", cert_label: "Сертификаты", cert_val: "Red Hat RH124 · CyberShield CSCSA (STS)", lang_label: "Языки", lang_val: "Казахский · Русский C1 · Английский B1 · Китайский HSK5" },
        hero: { name: "КОШКЕНБЕК ДАУРЕН", title: "СПЕЦИАЛИСТ ПО КИБЕРБЕЗОПАСНОСТИ", role1: "SOC АНАЛИТИК", role2: "ПЕНТЕСТЕР", tagline: "\"Защита систем. Симуляция атак. Безопасное будущее.\"", scroll: "ВНИЗ", cv: "СКАЧАТЬ CV" },
        about: { desc: "Я Кошкенбек Даурен — выпускник Astana IT University по специальности Кибербезопасность (выпуск 2026) и SOC Analyst L1 с практическим опытом мониторинга безопасности.\n\nВ настоящее время я работаю SOC аналитиком (L1) в Sauyt Lab (Freedom), поддерживая операции по информационной безопасности национального уровня в Казахстане. Ранее я работал в международном SOC в компании Sr Holding (Китай), где занимался мониторингом событий безопасности и анализом логов сети, конечных точек и систем.\n\nМой основной фокус — операции Blue Team, включая триаж предупреждений, расследование инцидентов и мониторинг безопасности. В то же время я развиваю навыки наступательной безопасности (offensive security) и изучаю тестирование на проникновение с использованием Kali Linux.\n\nПараллельно я создаю практические проекты, такие как HackShield и OYNA, объединяя знания в области кибербезопасности с разработкой реальных продуктов." },
        goals: { short_title: "КРАТКОСРОЧНАЯ ЦЕЛЬ", short_desc: "SOC Analyst L2 / Blue Team Engineer", long_title: "ДОЛГОСРОЧНАЯ ЦЕЛЬ", long_desc: "Penetration Tester с сильным защитным бэкграундом" },
        exp: {
            title: "ОПЫТ РАБОТЫ",
            job1: {
                role: "SOC Analyst L1",
                company: "Sauyt Lab (Freedom)",
                date: "3 февраля 2026 – По настоящее время",
                list1: "Мониторинг событий безопасности в SOC",
                list2: "Анализ логов сетевых устройств, endpoint и систем",
                list3: "Первичная обработка алертов и инцидентов",
                list4: "Выявление подозрительной активности и эскалация",
                list5: "Работа в среде с повышенными требованиями к безопасности"
            },
            job2: {
                role: "SOC Analyst L1",
                company: "Sr Holding (China)",
                date: "1 сентября 2025 – 1 февраля 2026",
                list1: "Мониторинг событий безопасности в SOC",
                list2: "Анализ логов сетевых устройств, endpoint и систем",
                list3: "Первичная обработка алертов и инцидентов",
                list4: "Выявление подозрительной активности и эскалация",
                list5: "Работа с инструментами мониторинга безопасности"
            },
            job3: {
                role: "Участник проекта сетевой безопасности",
                company: "Kazakhtelecom (Sapa+)",
                date: "20 января 2025 – 20 июня 2025",
                list1: "Участие в проекте сетевой безопасности",
                list2: "Поддержка защищённой сетевой инфраструктуры",
                list3: "Мониторинг и базовый анализ событий сетевой безопасности",
                list4: "Работа в крупной телекоммуникационной компании"
            }
        },
        dash: { title: "SOC ДАШБОРД", demo: "СИМУЛЯЦИЯ", threats: "УГРОЗ ОТРАЖЕНО", uptime: "АПТАЙМ" },
        mindset: { title: "КАК Я МЫШЛЮ", blue_h: "МЫШЛЕНИЕ BLUE TEAM", blue_desc: "Я фокусируюсь на видимости, логике обнаружения и понимании того, что является нормальным, а что подозрительным поведением в системах и сетях.", red_h: "МЫШЛЕНИЕ RED TEAM", red_desc: "Я анализирую системы с точки зрения атакующего, ищу ошибки конфигурации, слабые места и реалистичные пути атаки." },
        blue: { title: "НАВЫКИ BLUE TEAM", card1: { title: "SOC МОНИТОРИНГ", desc: "Анализ угроз в реальном времени и работа с логами." }, card2: { title: "ОБНАРУЖЕНИЕ ИНЦИДЕНТОВ", desc: "Три аж, расследование и анализ угроз." } },
        red: { title: "НАВЫКИ RED TEAM", card1: { title: "ОСНОВЫ PENTESTING", desc: "Основы веб и сетевой безопасности, этичный хакинг." }, card2: { title: "ОЦЕНКА УЯЗВИМОСТЕЙ", desc: "Систематическое выявление и приоритизация слабых мест." } },
        skills: { title: "ИНСТРУМЕНТЫ И ТЕХНОЛОГИИ", offensive: "АТАКА (RED)", defensive: "ЗАЩИТА (BLUE)", platforms: "ОС И ИНСТРУМЕНТЫ" },
        archives: { title: "ОБРАЗОВАНИЕ И СЕРТИФИКАТЫ", cert: "СЕРТИФИКАТ", edu: "ОБРАЗОВАНИЕ", e1: { title: "Astana IT University", time: "Выпускник 2026", desc: "Бакалавриат — Кибербезопасность" }, c1: { title: "Exploratory Data Analysis для Machine Learning", provider: "IBM" }, c2: { title: "Securing Cloud and Hybrid Networks", provider: "LearnQuest" }, c3: { title: "Next-Generation Firewalls and Intrusion Prevention", provider: "LearnQuest" }, c4: { title: "Supervised Machine Learning: Regression", provider: "IBM" } },
        languages: { title: "ЯЗЫКИ", kk: "Казахский — Родной", ru: "Русский — C1", en: "Английский — B1", zh: "Китайский — HSK 5" },
        projects: { title: "ПРОЕКТЫ / ИНИЦИАТИВЫ", diploma: "ДИПЛОМ", p1: { title: "HackShield", desc: "Моя дипломная работа — геймифицированная платформа для обучения кибербезопасности с интерактивными миссиями, заданиями и 2D-игрой для практической прокачки навыков." }, p2: { title: "OYNA", desc: "Первая в Казахстане платформа для любительского спорта с подбором по уровню, позволяющая находить честные игры, проверенных организаторов и игроков своего уровня." } },
        contact: { title: "ИНИЦИИРОВАТЬ КОНТАКТ", subtitle: "Открыт для предложений и совместных проектов в сфере кибербезопасности", btn: "ОТПРАВИТЬ" }
    }
};

let currentLang = 'en';

function updateLanguage(lang) {
    currentLang = lang;
    document.querySelectorAll('#lang-switch span').forEach(s => s.classList.remove('active'));

    // Safety check for null elements
    const activeSpan = document.querySelector(`#lang-switch span[data-lang="${lang}"]`);
    if (activeSpan) activeSpan.classList.add('active');

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const txt = key.split('.').reduce((o, i) => (o ? o[i] : null), translations[lang]);
        if (txt) {
            if (key === 'about.desc') {
                el.innerText = txt; // preserve breaks
            } else {
                el.innerText = txt;
            }
        }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        const txt = key.split('.').reduce((o, i) => (o ? o[i] : null), translations[lang]);
        if (txt) el.placeholder = txt;
    });

    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        const txt = key.split('.').reduce((o, i) => (o ? o[i] : null), translations[lang]);
        if (txt) el.title = txt;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const langSwitch = document.getElementById('lang-switch');
    if (langSwitch) {
        langSwitch.addEventListener('click', (e) => {
            const lang = e.target.getAttribute('data-lang');
            if (lang) updateLanguage(lang);
        });
    }
    // Init
    updateLanguage('en');
});
