// Language Configuration and Logic
const translations = {
    en: {
        nav: { hr: "HR MODE", about: "ABOUT", exp: "EXPERIENCE", dashboard: "SOC-DASH", modules: "MODULES" },
        hero: { name: "KOSHKENBEK DAUREN", title: "CYBERSECURITY SPECIALIST", role1: "SOC ANALYST L1", role2: "PENTESTER (in training)", tagline: "\"Protecting systems. Testing security. Learning every day.\"", scroll: "SCROLL_DOWN" },
        about: { desc: "I study Cybersecurity at Astana IT University (3rd year). I also work as a SOC Analyst L1.\n\nI work at Sr Holding (China). I have been there for 5 months. I monitor security events. I check logs and find problems.\n\nI focus on Blue Team work now. But I also learn Red Team skills. I practice with Kali Linux. I want to become a Penetration Tester.\n\nI also build my own projects. I made OYNA and CyberQuest Arena. I like to make useful tools." },
        goals: { short_title: "SHORT-TERM GOAL", short_desc: "SOC Analyst L2 / Blue Team Engineer", long_title: "LONG-TERM GOAL", long_desc: "Penetration Tester with defense skills" },
        exp: { title: "PROFESSIONAL EXPERIENCE", role: "SOC Analyst L1", company: "Sr Holding (China)", date: "5 months – Present", list1: "I monitor security events in the SOC.", list2: "I check logs from networks and systems.", list3: "I analyze alerts and incidents.", list4: "I report suspicious activity.", list5: "I use security tools every day." },
        dash: { title: "LIVE SOC DASHBOARD", threats: "THREATS BLOCKED", uptime: "SYSTEM UPTIME" },
        mindset: { title: "HOW I THINK", blue_h: "BLUE TEAM MINDSET", blue_desc: "I watch for bad activity. I want to know what is normal and what is dangerous.", red_h: "RED TEAM MINDSET", red_desc: "I think like an attacker. I look for weak spots in the system." },
        blue: { title: "BLUE TEAM SKILLS", card1: { title: "SOC MONITORING", desc: "Checking alerts and SIEM logs in real time." }, card2: { title: "INCIDENT DETECTION", desc: "Finding and analyzing security reports." } },
        red: { title: "RED TEAM SKILLS", card1: { title: "PENTESTING BASICS", desc: "Web and Network security basics. Ethical hacking." }, card2: { title: "FINDING WEAKNESSES", desc: "Finding and listing security problems." } },
        skills: { title: "TOOLS & TECHNOLOGIES" },
        archives: { title: "EDUCATION & CERTIFICATIONS", cert: "CERTIFICATE", edu: "EDUCATION", e1: { title: "Astana IT University", time: "3rd year student", desc: "Bachelor’s Degree — Cybersecurity" }, c1: { title: "Exploratory Data Analysis for Machine Learning", provider: "IBM" }, c2: { title: "Securing Cloud and Hybrid Networks", provider: "LearnQuest" }, c3: { title: "Next-Generation Firewalls and Intrusion Prevention", provider: "LearnQuest" }, c4: { title: "Supervised Machine Learning: Regression", provider: "IBM" } },
        languages: { title: "LANGUAGES", kk: "Kazakh — Native", ru: "Russian — C2", en: "English — B2", zh: "Chinese — HSK 6" },
        projects: { title: "PROJECTS / INITIATIVES", p1: { title: "CyberQuest Arena", desc: "A platform to learn cybersecurity. It has tasks for Blue Team and Red Team skills." }, p2: { title: "OYNA", desc: "A sports platform for Kazakhstan. It matches players by skill level in fair games." } },
        contact: { title: "CONTACT ME", subtitle: "Open to work and learning in cybersecurity.", btn: "SEND" }
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
