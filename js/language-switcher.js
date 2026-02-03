// Language Configuration and Logic
const translations = {
    en: {
        nav: { hr: "HR MODE", about: "ABOUT", exp: "EXPERIENCE", dashboard: "SOC-DASH", modules: "KNOWLEDGE" },
        hero: { name: "KOSHKENBEK DAUREN", title: "CYBERSECURITY SPECIALIST", role1: "SOC ANALYST L1", role2: "PENTESTER (in training)", tagline: "\"Defending systems. Simulating attacks. Securing the future.\"", scroll: "SCROLL_DOWN" },
        about: { desc: "Koshkenbek Dauren is a 3rd-year Cybersecurity student at Astana IT University and a SOC Analyst L1 with hands-on experience in real-world security monitoring.\n\nCurrently working at Sr Holding, a Chinese company, where I have been part of the Security Operations Center for over 5 months. My responsibilities include continuous monitoring, log analysis, and initial incident investigation across network, endpoint, and system-level events.\n\nWhile my professional experience is focused on Blue Team operations, I am actively transitioning toward penetration testing. I am studying offensive security independently, practicing with Kali Linux and its toolset, and building a strong foundation in ethical hacking methodologies.\n\nIn parallel, I am developing my own technical initiatives and mini-startups, including OYNA and CyberQuest Arena, combining cybersecurity knowledge with product and platform thinking." },
        goals: { short_title: "SHORT-TERM GOAL", short_desc: "SOC Analyst L2 / Blue Team Engineer", long_title: "LONG-TERM GOAL", long_desc: "Penetration Tester with strong defensive background" },
        exp: {
            title: "PROFESSIONAL EXPERIENCE",
            job1: {
                role: "SOC Analyst L1",
                company: "GTS — Information Security of Kazakhstan",
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
        dash: { title: "LIVE SOC DASHBOARD", threats: "THREATS BLOCKED", uptime: "SYSTEM UPTIME" },
        mindset: { title: "HOW I THINK", blue_h: "BLUE TEAM MINDSET", blue_desc: "I focus on visibility, detection logic, and understanding what is normal versus suspicious behavior in systems and networks.", red_h: "RED TEAM MINDSET", red_desc: "I analyze systems from an attacker’s perspective, looking for misconfigurations, weak points, and realistic attack paths." },
        blue: { title: "BLUE TEAM SKILLS", card1: { title: "SOC MONITORING", desc: "Real-time analysis of security alerts and SIEM logs." }, card2: { title: "INCIDENT DETECTION", desc: "Triage, investigation, and threat analysis." } },
        red: { title: "RED TEAM SKILLS", card1: { title: "PENTESTING FUNDAMENTALS", desc: "Web & Network security basics, ethical hacking mindset." }, card2: { title: "VULNERABILITY ASSESSMENT", desc: "Systematic identification and prioritization of security weaknesses." } },
        skills: { title: "TOOLS & TECHNOLOGIES" },
        archives: { title: "EDUCATION & CERTIFICATIONS", cert: "CERTIFICATE", edu: "EDUCATION", e1: { title: "Astana IT University", time: "3rd year student", desc: "Bachelor’s Degree — Cybersecurity" }, c1: { title: "Exploratory Data Analysis for Machine Learning", provider: "IBM" }, c2: { title: "Securing Cloud and Hybrid Networks", provider: "LearnQuest" }, c3: { title: "Next-Generation Firewalls and Intrusion Prevention", provider: "LearnQuest" }, c4: { title: "Supervised Machine Learning: Regression", provider: "IBM" } },
        languages: { title: "LANGUAGES", kk: "Kazakh — Native", ru: "Russian — C2", en: "English — A2", zh: "Chinese — HSK 5" },
        projects: { title: "PROJECTS / INITIATIVES", p1: { title: "CyberQuest Arena", desc: "Cybersecurity learning and challenge-based platform focused on developing practical defensive and offensive security skills through hands-on scenarios." }, p2: { title: "OYNA", desc: "Kazakhstan’s first platform for amateur sports, enabling fair matchmaking by skill level and connecting verified organizers and players." } },
        contact: { title: "INITIATE CONTACT", subtitle: "Open to cybersecurity opportunities and collaboration", btn: "TRANSMIT" }
    },
    ru: {
        nav: { hr: "HR РЕЖИМ", about: "ОБО МНЕ", exp: "ОПЫТ РАБОТЫ", dashboard: "SOC-ДАШБОРД", modules: "ЗНАНИЯ" },
        hero: { name: "КОШКЕНБЕК ДАУРЕН", title: "СПЕЦИАЛИСТ ПО КИБЕРБЕЗОПАСНОСТИ", role1: "SOC АНАЛИТИК", role2: "ПЕНТЕСТЕР", tagline: "\"Защита систем. Симуляция атак. Безопасное будущее.\"", scroll: "ВНИЗ" },
        about: { desc: "Koshkenbek Dauren — студент 3 курса Astana IT University по направлению Cybersecurity и SOC Analyst L1 с практическим опытом работы в центре мониторинга безопасности.\n\nНа данный момент более 5 месяцев работаю в китайской компании Sr Holding в роли SOC Analyst L1. Занимаюсь постоянным мониторингом событий безопасности, анализом логов, сетевого трафика и endpoint-событий, а также первичной обработкой и классификацией инцидентов.\n\nМой коммерческий опыт сосредоточен на Blue Team, однако я активно развиваюсь в направлении penetration testing. Изучаю offensive security, уверенно работаю с Kali Linux и его инструментами, осваиваю подходы этичного хакинга и уязвимостей.\n\nПараллельно разрабатываю собственные мини-проекты и стартапы, такие как OYNA и CyberQuest Arena, совмещая кибербезопасность с продуктовым мышлением." },
        goals: { short_title: "КРАТКОСРОЧНАЯ ЦЕЛЬ", short_desc: "SOC Analyst L2 / Blue Team Engineer", long_title: "ДОЛГОСРОЧНАЯ ЦЕЛЬ", long_desc: "Penetration Tester с сильным защитным бэкграундом" },
        exp: {
            title: "ОПЫТ РАБОТЫ",
            job1: {
                role: "SOC Analyst L1",
                company: "GTS — Information Security of Kazakhstan",
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
        dash: { title: "LIVE SOC ДАШБОРД", threats: "УГРОЗ ОТРАЖЕНО", uptime: "АПТАЙМ" },
        mindset: { title: "КАК Я МЫШЛЮ", blue_h: "МЫШЛЕНИЕ BLUE TEAM", blue_desc: "Я фокусируюсь на видимости, логике обнаружения и понимании того, что является нормальным, а что подозрительным поведением в системах и сетях.", red_h: "МЫШЛЕНИЕ RED TEAM", red_desc: "Я анализирую системы с точки зрения атакующего, ищу ошибки конфигурации, слабые места и реалистичные пути атаки." },
        blue: { title: "НАВЫКИ BLUE TEAM", card1: { title: "SOC МОНИТОРИНГ", desc: "Анализ угроз в реальном времени и работа с логами." }, card2: { title: "ОБНАРУЖЕНИЕ ИНЦИДЕНТОВ", desc: "Три аж, расследование и анализ угроз." } },
        red: { title: "НАВЫКИ RED TEAM", card1: { title: "ОСНОВЫ PENTESTING", desc: "Основы веб и сетевой безопасности, этичный хакинг." }, card2: { title: "ОЦЕНКА УЯЗВИМОСТЕЙ", desc: "Систематическое выявление и приоритизация слабых мест." } },
        skills: { title: "ИНСТРУМЕНТЫ И ТЕХНОЛОГИИ" },
        archives: { title: "ОБРАЗОВАНИЕ И СЕРТИФИКАТЫ", cert: "СЕРТИФИКАТ", edu: "ОБРАЗОВАНИЕ", e1: { title: "Astana IT University", time: "Студент 3 курса", desc: "Бакалавриат — Кибербезопасность" }, c1: { title: "Exploratory Data Analysis для Machine Learning", provider: "IBM" }, c2: { title: "Securing Cloud and Hybrid Networks", provider: "LearnQuest" }, c3: { title: "Next-Generation Firewalls and Intrusion Prevention", provider: "LearnQuest" }, c4: { title: "Supervised Machine Learning: Regression", provider: "IBM" } },
        languages: { title: "ЯЗЫКИ", kk: "Казахский — Родной", ru: "Русский — C2", en: "Английский — A2", zh: "Китайский — HSK 5" },
        projects: { title: "ПРОЕКТЫ / ИНИЦИАТИВЫ", p1: { title: "CyberQuest Arena", desc: "Обучающая платформа по кибербезопасности с практическими заданиями и челленджами, направленными на развитие навыков Blue Team и Red Team." }, p2: { title: "OYNA", desc: "Первая в Казахстане платформа для любительского спорта с подбором по уровню, позволяющая находить честные игры, проверенных организаторов и игроков своего уровня." } },
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
