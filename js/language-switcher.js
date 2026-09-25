// EN/RU translations + language switching (keys referenced by data-i18n)
const translations = {
    "en": {
        "nav": {
            "home": "HOME",
            "about": "ABOUT",
            "exp": "EXPERIENCE",
            "projects": "PROJECTS",
            "skills": "SKILLS",
            "certs": "CERTS",
            "contact": "CONTACT",
            "hr": "HR",
            "open": "OPEN TO WORK",
            "tz": "ASTANA (UTC+5)"
        },
        "tab": {
            "home": "Home",
            "exp": "Work",
            "skills": "Skills",
            "projects": "Projects",
            "contact": "Contact"
        },
        "hr": {
            "tooltip": "Recruiter view — clean summary with CV, contacts & key facts",
            "available": "Open to work · Astana, Kazakhstan",
            "exp_label": "Experience",
            "exp_val": "SOC Analyst L1 · Blue Team — Sauyt Lab, Sr Holding",
            "edu_label": "Education",
            "edu_val": "Astana IT University — Cybersecurity (graduated 2026)",
            "cert_label": "Certifications",
            "cert_val": "Red Hat RH124 · CyberShield CSCSA (STS)",
            "lang_label": "Languages",
            "lang_val": "Kazakh · Russian C1 · English B1 · Chinese HSK5"
        },
        "hero": {
            "whoami": "WHOAMI",
            "name1": "DAUREN",
            "name2": "KOSHKENBEK",
            "role1": "SOC ANALYST L1",
            "role2": "PENTESTER (IN TRAINING)",
            "blurb": "I'm a cybersecurity specialist focused on security monitoring, incident analysis and offensive security. I enjoy turning complex security data into clear insights and building practical solutions.",
            "work": "VIEW MY WORK",
            "cv": "DOWNLOAD CV"
        },
        "about": {
            "eyebrow": "// 02",
            "dossier": "OPERATOR DOSSIER",
            "desc": "I am Koshkenbek Dauren, a Cybersecurity graduate of Astana IT University (Class of 2026) and a SOC Analyst L1 with hands-on experience in security monitoring.\n\nI currently work as a SOC Analyst L1 at Sauyt Lab (Freedom), supporting national-level information security operations in Kazakhstan. Previously, I worked in an international SOC environment at Sr Holding (China), where I monitored security events and analyzed logs from network, endpoint, and system sources.\n\nMy main focus is Blue Team operations, including alert triage, incident investigation, and security monitoring. At the same time, I am developing offensive security skills and studying penetration testing using Kali Linux.\n\nIn parallel, I build practical projects and initiatives, including HackShield and OYNA, combining cybersecurity knowledge with real-world product development.",
            "fact_loc": "Astana, Kazakhstan",
            "fact_edu": "Astana IT University",
            "fact_lang": "KZ / RU / EN / CN",
            "fact_open": "Open to opportunities"
        },
        "goals": {
            "short_title": "SHORT-TERM GOAL",
            "short_desc": "SOC Analyst L2 / Blue Team Engineer",
            "long_title": "LONG-TERM GOAL",
            "long_desc": "Penetration Tester with strong defensive background"
        },
        "focus": {
            "title": "FOCUS AREAS",
            "subtitle": "WHAT I DO",
            "offensive": {
                "title": "OFFENSIVE SECURITY",
                "l1": "Web Pentesting",
                "l2": "Network Security",
                "l3": "Vulnerability Research"
            },
            "defensive": {
                "title": "DEFENSIVE SECURITY",
                "l1": "SOC Monitoring",
                "l2": "Log Analysis",
                "l3": "Incident Response"
            },
            "development": {
                "title": "DEVELOPMENT",
                "l1": "Web Applications",
                "l2": "Security Tools",
                "l3": "Automation"
            },
            "research": {
                "title": "RESEARCH",
                "l1": "Threat Analysis",
                "l2": "Security Education",
                "l3": "New Technologies"
            }
        },
        "chain": {
            "eyebrow": "// 03",
            "title": "ATTACK CHAIN & SKILLS",
            "tag": "TOOLS. MINDSET. RESULTS.",
            "subtitle": "FROM RECONNAISSANCE TO IMPACT",
            "s1": {
                "title": "RECON"
            },
            "s2": {
                "title": "ENUMERATION"
            },
            "s3": {
                "title": "EXPLOITATION"
            },
            "s4": {
                "title": "PRIVILEGE ESCALATION"
            },
            "s5": {
                "title": "POST-EXPLOITATION"
            },
            "s6": {
                "title": "REPORTING"
            },
            "note": "The offensive part of this chain is what I am training toward; the defensive side is what I do at work."
        },
        "arsenal": {
            "eyebrow": "// 04",
            "subtitle": "CONTINUOUSLY LEARNING"
        },
        "exp": {
            "title": "EXPERIENCE",
            "job1": {
                "role": "SOC Analyst L1",
                "company": "Sauyt Lab (Freedom)",
                "date": "February 03, 2026 – Present",
                "list1": "Security event monitoring in SOC environment",
                "list2": "Log analysis from network, endpoint, and system sources",
                "list3": "Initial alert triage and incident investigation",
                "list4": "Identification of suspicious activity and escalation",
                "list5": "Working within a high-responsibility national security environment"
            },
            "job2": {
                "role": "SOC Analyst L1",
                "company": "Sr Holding (China)",
                "date": "September 01, 2025 – February 01, 2026",
                "list1": "Security event monitoring in SOC environment",
                "list2": "Log analysis from network, endpoint, and system sources",
                "list3": "Initial incident triage and alert investigation",
                "list4": "Identification of suspicious activity and escalation when required",
                "list5": "Working with security monitoring tools and dashboards"
            },
            "job3": {
                "role": "Network Security Project Participant",
                "company": "Kazakhtelecom (Sapa+)",
                "date": "January 20, 2025 – June 20, 2025",
                "list1": "Participation in a network security project",
                "list2": "Support of secure network infrastructure",
                "list3": "Monitoring and basic analysis of network security events",
                "list4": "Working within a large enterprise telecom environment"
            }
        },
        "dash": {
            "title": "SOC DASHBOARD",
            "demo": "SIMULATION",
            "threats": "THREATS BLOCKED",
            "uptime": "SYSTEM UPTIME"
        },
        "mindset": {
            "title": "HOW I THINK",
            "blue_h": "BLUE TEAM MINDSET",
            "blue_desc": "I focus on visibility, detection logic, and understanding what is normal versus suspicious behavior in systems and networks.",
            "red_h": "RED TEAM MINDSET",
            "red_desc": "I analyze systems from an attacker’s perspective, looking for misconfigurations, weak points, and realistic attack paths."
        },
        "blue": {
            "title": "BLUE TEAM SKILLS",
            "card1": {
                "title": "SOC MONITORING",
                "desc": "Real-time analysis of security alerts and SIEM logs."
            },
            "card2": {
                "title": "INCIDENT DETECTION",
                "desc": "Triage, investigation, and threat analysis."
            }
        },
        "red": {
            "title": "RED TEAM SKILLS",
            "card1": {
                "title": "PENTESTING FUNDAMENTALS",
                "desc": "Web & Network security basics, ethical hacking mindset."
            },
            "card2": {
                "title": "VULNERABILITY ASSESSMENT",
                "desc": "Systematic identification and prioritization of security weaknesses."
            }
        },
        "skills": {
            "title": "TOOLS & TECHNOLOGIES",
            "offensive": "OFFENSIVE",
            "defensive": "DEFENSIVE",
            "platforms": "OS & TOOLS"
        },
        "archives": {
            "title": "EDUCATION & CERTIFICATIONS",
            "cert": "CERTIFICATE",
            "edu": "EDUCATION",
            "e1": {
                "title": "Astana IT University",
                "time": "Graduated in 2026",
                "desc": "Bachelor’s Degree — Cybersecurity"
            },
            "c1": {
                "title": "Exploratory Data Analysis for Machine Learning",
                "provider": "IBM"
            },
            "c2": {
                "title": "Securing Cloud and Hybrid Networks",
                "provider": "LearnQuest"
            },
            "c3": {
                "title": "Next-Generation Firewalls and Intrusion Prevention",
                "provider": "LearnQuest"
            },
            "c4": {
                "title": "Supervised Machine Learning: Regression",
                "provider": "IBM"
            }
        },
        "languages": {
            "title": "LANGUAGES",
            "kk": "Kazakh — Native",
            "ru": "Russian — C1",
            "en": "English — B1",
            "zh": "Chinese — HSK 5"
        },
        "projects": {
            "eyebrow": "// 05",
            "tag": "REAL PROJECTS. REAL IMPACT.",
            "title": "PROJECTS",
            "diploma": "DIPLOMA",
            "p1": {
                "title": "HackShield",
                "desc": "My graduation (diploma) project — a gamified cybersecurity training platform with interactive missions, challenges and a 2D game for practical skill-building."
            },
            "p2": {
                "title": "OYNA",
                "desc": "Kazakhstan’s first platform for amateur sports, enabling fair matchmaking by skill level and connecting verified organizers and players."
            }
        },
        "cert": {
            "eyebrow": "// 06",
            "featured_title": "CERTIFICATION VAULT",
            "verified_tag": "VERIFIED CREDENTIALS",
            "verified": "VERIFIED",
            "featured_subtitle": "Industry-recognized professional training",
            "cscsa": {
                "title": "CyberShield Certified SOC Analyst (CSCSA)",
                "issuer": "CyberShield Academy · State Technical Service (STS)"
            },
            "rh": {
                "title": "Red Hat System Administration I (RH124)",
                "issuer": "Red Hat Training and Certification"
            },
            "diploma": {
                "title": "Bachelor's Diploma — Cybersecurity",
                "issuer": "Astana IT University · BD № 00040351726",
                "short": "Bachelor's degree, Cybersecurity"
            }
        },
        "contact": {
            "eyebrow": "// 07",
            "tag": "LET'S CONNECT",
            "title": "CONTACT",
            "subtitle": "Open to cybersecurity opportunities and collaboration",
            "btn": "TRANSMIT",
            "quote": "Security is not a product, but a process.",
            "quote_author": "— Bruce Schneier"
        },
        "a11y": {
            "skip": "Skip to content"
        },
        "brand": {
            "sub": "DAUREN KOSHKENBEK"
        },
        "p": {
            "threats": "LIVE_THREATS",
            "sim": "SIMULATED",
            "events": "EVENTS (SIMULATED)",
            "status": "SYSTEM_STATUS",
            "self": "Self-assessed proficiency, not telemetry.",
            "viewall": "VIEW ALL",
            "blue": "BLUE TEAM",
            "blue_sub": "DETECT / ANALYZE / RESPOND",
            "red": "RED TEAM",
            "red_sub": "FIND / EXPLOIT / VALIDATE",
            "training": "IN TRAINING",
            "term": "TERMINAL",
            "term_hint": "TYPE 'help'",
            "term_ph": "help",
            "featured": "FEATURED_PROJECTS",
            "tools": "SKILLS & TOOLS",
            "certs": "CERTIFICATIONS",
            "live": "VIEW LIVE",
            "open": "OPEN TOOL",
            "cta": "LET'S WORK TOGETHER",
            "goal": "GOAL",
            "pause": "Pause globe rotation",
            "play": "Resume globe rotation"
        },
        "st": {
            "siem": "SIEM Monitoring",
            "log": "Log Analysis",
            "ta": "Threat Analysis",
            "ir": "Incident Response"
        },
        "ev": {
            "login": "Suspicious login attempt",
            "ps": "PowerShell execution",
            "scan": "Port scan detected",
            "shell": "Web shell upload",
            "auth": "Failed authentication"
        },
        "mt": {
            "t1190": "Exploit Public-Facing App",
            "t1110": "Brute Force",
            "t1059": "Command and Scripting Interpreter",
            "t1046": "Network Service Scanning",
            "t1071": "Application Layer Protocol"
        },
        "team": {
            "b1": "Security monitoring (SIEM)",
            "b2": "Log analysis & incident investigation",
            "b3": "Threat analysis",
            "b4": "Security reporting",
            "r1": "Reconnaissance & enumeration",
            "r2": "Web application testing",
            "r3": "Network & infrastructure testing",
            "r4": "Privilege escalation"
        },
        "grp": {
            "off": "Offensive Security",
            "def": "Defensive Security",
            "dev": "Development"
        },
        "tools": {
            "title": "Security Tools",
            "disclaimer": "Passive checks only, for assets you own or are authorized to test.",
            "scanner": {
                "n": "Web Security Scanner",
                "d": "TLS, HTTP security headers, cookies, CORS and exposed files, scored A–F with a downloadable PDF report."
            },
            "osint": {
                "n": "OSINT Lookup",
                "d": "Passive reconnaissance from public sources: WHOIS/RDAP, DNS, certificate-transparency subdomains and Wayback history."
            },
            "exposure": {
                "n": "Exposure Check",
                "d": "Email breach exposure, username footprint and a client-side k-anonymity password check. The password never leaves your browser."
            }
        },
        "sec": {
            "about": "ABOUT",
            "about_tag": "OPERATOR DOSSIER",
            "exp_tag": "REAL SOC WORK"
        },
        "c": {
            "head1": "Let's build",
            "head2": "secure things"
        },
        "foot": {
            "blue": "BLUE DEFENSE",
            "red": "RED OFFENSE"
        },
        "term": {
            "help_h": "Available commands:",
            "help": "whoami  role  skills  experience  projects  certs  education  tools  contact  cv  lang  clear",
            "notfound": "command not found. type \"help\".",
            "role": "SOC Analyst L1 | Pentester (in training)",
            "motto": "Blue Team visibility. Red Team validation.",
            "skills": "SIEM · Log analysis · Linux · Windows · Networking · Web pentesting basics",
            "experience": "Sauyt Lab (Freedom) · SOC Analyst L1 · 2026-now\nSr Holding (China) · SOC Analyst L1 · 2025-2026\nKazakhtelecom (Sapa+) · Network Security Project · 2025",
            "projects": "HackShield · gamified cybersecurity training (diploma project)\nOYNA · amateur sports matchmaking platform\nSecurity Tools · scanner, OSINT lookup, exposure check",
            "certs": "CyberShield CSCSA · Red Hat RH124 · Bachelor in Cybersecurity (AITU)",
            "education": "Astana IT University · Cybersecurity · graduated 2026",
            "tools": "scanner.html  osint.html  exposure.html  (passive checks only)",
            "contact": "daurencd@gmail.com · t.me/yellowcd · github.com/daurencd01",
            "cv": "Downloading CV…",
            "together": "Let's work together!",
            "lang": "language switched",
            "sudo": "nice try. this attempt has been logged (simulation)."
        }
    },
    "ru": {
        "nav": {
            "home": "ГЛАВНАЯ",
            "about": "ОБО МНЕ",
            "exp": "ОПЫТ",
            "projects": "ПРОЕКТЫ",
            "skills": "НАВЫКИ",
            "certs": "СЕРТИФИКАТЫ",
            "contact": "КОНТАКТЫ",
            "hr": "HR",
            "open": "ОТКРЫТ К РАБОТЕ",
            "tz": "АСТАНА (UTC+5)"
        },
        "tab": {
            "home": "Главная",
            "exp": "Опыт",
            "skills": "Навыки",
            "projects": "Проекты",
            "contact": "Контакты"
        },
        "hr": {
            "tooltip": "Режим для рекрутёра — чистая сводка: CV, контакты и ключевые факты",
            "available": "Открыт к предложениям · Астана, Казахстан",
            "exp_label": "Опыт",
            "exp_val": "SOC-аналитик L1 · Blue Team — Sauyt Lab, Sr Holding",
            "edu_label": "Образование",
            "edu_val": "Astana IT University — Кибербезопасность (выпуск 2026)",
            "cert_label": "Сертификаты",
            "cert_val": "Red Hat RH124 · CyberShield CSCSA (STS)",
            "lang_label": "Языки",
            "lang_val": "Казахский · Русский C1 · Английский B1 · Китайский HSK5"
        },
        "hero": {
            "whoami": "КТО Я",
            "name1": "ДАУРЕН",
            "name2": "КОШКЕНБЕК",
            "role1": "SOC-АНАЛИТИК L1",
            "role2": "ПЕНТЕСТЕР (В ОБУЧЕНИИ)",
            "blurb": "Я специалист по кибербезопасности: мониторинг безопасности, анализ инцидентов и наступательная безопасность. Люблю превращать сложные данные безопасности в понятные выводы и создавать практичные решения.",
            "work": "МОИ РАБОТЫ",
            "cv": "СКАЧАТЬ CV"
        },
        "about": {
            "eyebrow": "// 02",
            "dossier": "ДОСЬЕ ОПЕРАТОРА",
            "desc": "Я Кошкенбек Даурен — выпускник Astana IT University по специальности Кибербезопасность (выпуск 2026) и SOC Analyst L1 с практическим опытом мониторинга безопасности.\n\nВ настоящее время я работаю SOC аналитиком (L1) в Sauyt Lab (Freedom), поддерживая операции по информационной безопасности национального уровня в Казахстане. Ранее я работал в международном SOC в компании Sr Holding (Китай), где занимался мониторингом событий безопасности и анализом логов сети, конечных точек и систем.\n\nМой основной фокус — операции Blue Team, включая триаж предупреждений, расследование инцидентов и мониторинг безопасности. В то же время я развиваю навыки наступательной безопасности (offensive security) и изучаю тестирование на проникновение с использованием Kali Linux.\n\nПараллельно я создаю практические проекты, такие как HackShield и OYNA, объединяя знания в области кибербезопасности с разработкой реальных продуктов.",
            "fact_loc": "Астана, Казахстан",
            "fact_edu": "Astana IT University",
            "fact_lang": "KZ / RU / EN / CN",
            "fact_open": "Открыт к предложениям"
        },
        "goals": {
            "short_title": "КРАТКОСРОЧНАЯ ЦЕЛЬ",
            "short_desc": "SOC Analyst L2 / Blue Team Engineer",
            "long_title": "ДОЛГОСРОЧНАЯ ЦЕЛЬ",
            "long_desc": "Penetration Tester с сильным защитным бэкграундом"
        },
        "focus": {
            "title": "ОБЛАСТИ ФОКУСА",
            "subtitle": "ЧЕМ Я ЗАНИМАЮСЬ",
            "offensive": {
                "title": "НАСТУПАТЕЛЬНАЯ БЕЗОПАСНОСТЬ",
                "l1": "Web-пентест",
                "l2": "Сетевая безопасность",
                "l3": "Поиск уязвимостей"
            },
            "defensive": {
                "title": "ЗАЩИТНАЯ БЕЗОПАСНОСТЬ",
                "l1": "SOC-мониторинг",
                "l2": "Анализ логов",
                "l3": "Реагирование на инциденты"
            },
            "development": {
                "title": "РАЗРАБОТКА",
                "l1": "Веб-приложения",
                "l2": "Инструменты безопасности",
                "l3": "Автоматизация"
            },
            "research": {
                "title": "ИССЛЕДОВАНИЯ",
                "l1": "Анализ угроз",
                "l2": "Обучение по безопасности",
                "l3": "Новые технологии"
            }
        },
        "chain": {
            "eyebrow": "// 03",
            "title": "ЦЕПОЧКА АТАКИ И НАВЫКИ",
            "tag": "ИНСТРУМЕНТЫ. МЫШЛЕНИЕ. РЕЗУЛЬТАТ.",
            "subtitle": "ОТ РАЗВЕДКИ ДО РЕЗУЛЬТАТА",
            "s1": {
                "title": "РАЗВЕДКА"
            },
            "s2": {
                "title": "ENUMERATION"
            },
            "s3": {
                "title": "ЭКСПЛУАТАЦИЯ"
            },
            "s4": {
                "title": "ПОВЫШЕНИЕ ПРИВИЛЕГИЙ"
            },
            "s5": {
                "title": "POST-EXPLOITATION"
            },
            "s6": {
                "title": "ОТЧЁТНОСТЬ"
            },
            "note": "Наступательную часть цепочки я осваиваю; защитную часть выполняю на работе."
        },
        "arsenal": {
            "eyebrow": "// 04",
            "subtitle": "ПОСТОЯННОЕ ОБУЧЕНИЕ"
        },
        "exp": {
            "title": "ОПЫТ РАБОТЫ",
            "job1": {
                "role": "SOC Analyst L1",
                "company": "Sauyt Lab (Freedom)",
                "date": "3 февраля 2026 – По настоящее время",
                "list1": "Мониторинг событий безопасности в SOC",
                "list2": "Анализ логов сетевых устройств, endpoint и систем",
                "list3": "Первичная обработка алертов и инцидентов",
                "list4": "Выявление подозрительной активности и эскалация",
                "list5": "Работа в среде с повышенными требованиями к безопасности"
            },
            "job2": {
                "role": "SOC Analyst L1",
                "company": "Sr Holding (China)",
                "date": "1 сентября 2025 – 1 февраля 2026",
                "list1": "Мониторинг событий безопасности в SOC",
                "list2": "Анализ логов сетевых устройств, endpoint и систем",
                "list3": "Первичная обработка алертов и инцидентов",
                "list4": "Выявление подозрительной активности и эскалация",
                "list5": "Работа с инструментами мониторинга безопасности"
            },
            "job3": {
                "role": "Участник проекта сетевой безопасности",
                "company": "Kazakhtelecom (Sapa+)",
                "date": "20 января 2025 – 20 июня 2025",
                "list1": "Участие в проекте сетевой безопасности",
                "list2": "Поддержка защищённой сетевой инфраструктуры",
                "list3": "Мониторинг и базовый анализ событий сетевой безопасности",
                "list4": "Работа в крупной телекоммуникационной компании"
            }
        },
        "dash": {
            "title": "SOC ДАШБОРД",
            "demo": "СИМУЛЯЦИЯ",
            "threats": "УГРОЗ ОТРАЖЕНО",
            "uptime": "АПТАЙМ"
        },
        "mindset": {
            "title": "КАК Я МЫШЛЮ",
            "blue_h": "МЫШЛЕНИЕ BLUE TEAM",
            "blue_desc": "Я фокусируюсь на видимости, логике обнаружения и понимании того, что является нормальным, а что подозрительным поведением в системах и сетях.",
            "red_h": "МЫШЛЕНИЕ RED TEAM",
            "red_desc": "Я анализирую системы с точки зрения атакующего, ищу ошибки конфигурации, слабые места и реалистичные пути атаки."
        },
        "blue": {
            "title": "НАВЫКИ BLUE TEAM",
            "card1": {
                "title": "SOC МОНИТОРИНГ",
                "desc": "Анализ угроз в реальном времени и работа с логами."
            },
            "card2": {
                "title": "ОБНАРУЖЕНИЕ ИНЦИДЕНТОВ",
                "desc": "Три аж, расследование и анализ угроз."
            }
        },
        "red": {
            "title": "НАВЫКИ RED TEAM",
            "card1": {
                "title": "ОСНОВЫ PENTESTING",
                "desc": "Основы веб и сетевой безопасности, этичный хакинг."
            },
            "card2": {
                "title": "ОЦЕНКА УЯЗВИМОСТЕЙ",
                "desc": "Систематическое выявление и приоритизация слабых мест."
            }
        },
        "skills": {
            "title": "ИНСТРУМЕНТЫ И ТЕХНОЛОГИИ",
            "offensive": "АТАКА (RED)",
            "defensive": "ЗАЩИТА (BLUE)",
            "platforms": "ОС И ИНСТРУМЕНТЫ"
        },
        "archives": {
            "title": "ОБРАЗОВАНИЕ И СЕРТИФИКАТЫ",
            "cert": "СЕРТИФИКАТ",
            "edu": "ОБРАЗОВАНИЕ",
            "e1": {
                "title": "Astana IT University",
                "time": "Выпускник 2026",
                "desc": "Бакалавриат — Кибербезопасность"
            },
            "c1": {
                "title": "Exploratory Data Analysis для Machine Learning",
                "provider": "IBM"
            },
            "c2": {
                "title": "Securing Cloud and Hybrid Networks",
                "provider": "LearnQuest"
            },
            "c3": {
                "title": "Next-Generation Firewalls and Intrusion Prevention",
                "provider": "LearnQuest"
            },
            "c4": {
                "title": "Supervised Machine Learning: Regression",
                "provider": "IBM"
            }
        },
        "languages": {
            "title": "ЯЗЫКИ",
            "kk": "Казахский — Родной",
            "ru": "Русский — C1",
            "en": "Английский — B1",
            "zh": "Китайский — HSK 5"
        },
        "projects": {
            "eyebrow": "// 05",
            "tag": "РЕАЛЬНЫЕ ПРОЕКТЫ. РЕАЛЬНЫЙ РЕЗУЛЬТАТ.",
            "title": "ПРОЕКТЫ",
            "diploma": "ДИПЛОМ",
            "p1": {
                "title": "HackShield",
                "desc": "Моя дипломная работа — геймифицированная платформа для обучения кибербезопасности с интерактивными миссиями, заданиями и 2D-игрой для практической прокачки навыков."
            },
            "p2": {
                "title": "OYNA",
                "desc": "Первая в Казахстане платформа для любительского спорта с подбором по уровню, позволяющая находить честные игры, проверенных организаторов и игроков своего уровня."
            }
        },
        "cert": {
            "eyebrow": "// 06",
            "featured_title": "ХРАНИЛИЩЕ СЕРТИФИКАТОВ",
            "verified_tag": "ПОДТВЕРЖДЁННЫЕ СЕРТИФИКАТЫ",
            "verified": "ПОДТВЕРЖДЕНО",
            "featured_subtitle": "Профессиональное обучение с международным признанием",
            "cscsa": {
                "title": "CyberShield Certified SOC Analyst (CSCSA)",
                "issuer": "CyberShield Academy · State Technical Service (STS)"
            },
            "rh": {
                "title": "Red Hat System Administration I (RH124)",
                "issuer": "Red Hat Training and Certification"
            },
            "diploma": {
                "title": "Диплом бакалавра — Кибербезопасность",
                "issuer": "Astana IT University · BD № 00040351726",
                "short": "Бакалавр, Кибербезопасность"
            }
        },
        "contact": {
            "eyebrow": "// 07",
            "tag": "ДАВАЙТЕ СВЯЖЕМСЯ",
            "title": "КОНТАКТЫ",
            "subtitle": "Открыт для предложений и совместных проектов в сфере кибербезопасности",
            "btn": "ОТПРАВИТЬ",
            "quote": "Безопасность — это не продукт, а процесс.",
            "quote_author": "— Брюс Шнайер"
        },
        "a11y": {
            "skip": "Перейти к содержимому"
        },
        "brand": {
            "sub": "КОШКЕНБЕК ДАУРЕН"
        },
        "p": {
            "threats": "ЖИВЫЕ_УГРОЗЫ",
            "sim": "СИМУЛЯЦИЯ",
            "events": "СОБЫТИЙ (СИМУЛЯЦИЯ)",
            "status": "СТАТУС_НАВЫКОВ",
            "self": "Самооценка навыков, не телеметрия.",
            "viewall": "ВСЕ",
            "blue": "BLUE TEAM",
            "blue_sub": "ОБНАРУЖИТЬ / ПРОАНАЛИЗИРОВАТЬ / ОТРЕАГИРОВАТЬ",
            "red": "RED TEAM",
            "red_sub": "НАЙТИ / ЭКСПЛУАТИРОВАТЬ / ПОДТВЕРДИТЬ",
            "training": "В ОБУЧЕНИИ",
            "term": "ТЕРМИНАЛ",
            "term_hint": "ВВЕДИТЕ 'help'",
            "term_ph": "help",
            "featured": "ПРОЕКТЫ",
            "tools": "НАВЫКИ И ИНСТРУМЕНТЫ",
            "certs": "СЕРТИФИКАТЫ",
            "live": "ОТКРЫТЬ",
            "open": "ОТКРЫТЬ",
            "cta": "ДАВАЙТЕ РАБОТАТЬ ВМЕСТЕ",
            "goal": "ЦЕЛЬ",
            "pause": "Остановить вращение глобуса",
            "play": "Возобновить вращение глобуса"
        },
        "st": {
            "siem": "SIEM-мониторинг",
            "log": "Анализ логов",
            "ta": "Анализ угроз",
            "ir": "Реагирование на инциденты"
        },
        "ev": {
            "login": "Подозрительная попытка входа",
            "ps": "Запуск PowerShell",
            "scan": "Обнаружено сканирование портов",
            "shell": "Загрузка веб-шелла",
            "auth": "Неудачная аутентификация"
        },
        "mt": {
            "t1190": "Эксплуатация публичных сервисов",
            "t1110": "Подбор паролей",
            "t1059": "Интерпретаторы команд и скриптов",
            "t1046": "Сканирование сетевых служб",
            "t1071": "Протоколы прикладного уровня"
        },
        "team": {
            "b1": "Мониторинг безопасности (SIEM)",
            "b2": "Анализ логов и расследование инцидентов",
            "b3": "Анализ угроз",
            "b4": "Отчётность по безопасности",
            "r1": "Разведка и enumeration",
            "r2": "Тестирование веб-приложений",
            "r3": "Тестирование сетей и инфраструктуры",
            "r4": "Повышение привилегий"
        },
        "grp": {
            "off": "Наступательная безопасность",
            "def": "Защитная безопасность",
            "dev": "Разработка"
        },
        "tools": {
            "title": "Инструменты безопасности",
            "disclaimer": "Только пассивные проверки, для ваших ресурсов или с разрешения владельца.",
            "scanner": {
                "n": "Web Security Scanner",
                "d": "TLS, HTTP-заголовки безопасности, cookie, CORS и открытые файлы, оценка A–F и PDF-отчёт."
            },
            "osint": {
                "n": "OSINT Lookup",
                "d": "Пассивная разведка по открытым источникам: WHOIS/RDAP, DNS, поддомены из Certificate Transparency и история Wayback."
            },
            "exposure": {
                "n": "Exposure Check",
                "d": "Утечки email, следы username и проверка пароля по k-anonymity на стороне клиента. Пароль не покидает браузер."
            }
        },
        "sec": {
            "about": "ОБО МНЕ",
            "about_tag": "ДОСЬЕ ОПЕРАТОРА",
            "exp_tag": "РЕАЛЬНАЯ РАБОТА В SOC"
        },
        "c": {
            "head1": "Создаём",
            "head2": "безопасные вещи"
        },
        "foot": {
            "blue": "BLUE DEFENSE",
            "red": "RED OFFENSE"
        },
        "term": {
            "help_h": "Доступные команды:",
            "help": "whoami  role  skills  experience  projects  certs  education  tools  contact  cv  lang  clear",
            "notfound": "команда не найдена. введите \"help\".",
            "role": "SOC-аналитик L1 | Пентестер (в обучении)",
            "motto": "Blue Team — видимость. Red Team — проверка.",
            "skills": "SIEM · Анализ логов · Linux · Windows · Сети · Основы веб-пентеста",
            "experience": "Sauyt Lab (Freedom) · SOC Analyst L1 · 2026-наст. время\nSr Holding (Китай) · SOC Analyst L1 · 2025-2026\nKazakhtelecom (Sapa+) · проект сетевой безопасности · 2025",
            "projects": "HackShield · геймифицированное обучение кибербезопасности (диплом)\nOYNA · платформа для любительского спорта\nИнструменты · сканер, OSINT, проверка утечек",
            "certs": "CyberShield CSCSA · Red Hat RH124 · Бакалавр кибербезопасности (AITU)",
            "education": "Astana IT University · Кибербезопасность · выпуск 2026",
            "tools": "scanner.html  osint.html  exposure.html  (только пассивные проверки)",
            "contact": "daurencd@gmail.com · t.me/yellowcd · github.com/daurencd01",
            "cv": "Скачиваю CV…",
            "together": "Давайте работать вместе!",
            "lang": "язык переключён",
            "sudo": "хорошая попытка. действие записано в журнал (симуляция)."
        }
    }
};

const STORE_KEY = 'kd-lang';
let currentLang = 'en';

function t(key, lang) {
    return key.split('.').reduce((o, i) => (o ? o[i] : null), translations[lang || currentLang]);
}

function updateLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;
    document.documentElement.dataset.langReady = '1';
    document.querySelectorAll('#lang-switch button').forEach(b => b.classList.toggle('active', b.dataset.lang === lang));

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const txt = t(el.getAttribute('data-i18n'), lang);
        if (txt) el.textContent = txt;
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const txt = t(el.getAttribute('data-i18n-placeholder'), lang);
        if (txt) el.placeholder = txt;
    });
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const txt = t(el.getAttribute('data-i18n-title'), lang);
        if (txt) el.title = txt;
    });
    try { localStorage.setItem(STORE_KEY, lang); } catch (e) { /* storage unavailable */ }
    window.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
}

document.addEventListener('DOMContentLoaded', () => {
    const langSwitch = document.getElementById('lang-switch');
    if (langSwitch) {
        langSwitch.addEventListener('click', (e) => {
            const btn = e.target.closest('button[data-lang]');
            if (btn) updateLanguage(btn.dataset.lang);
        });
    }
    let start = 'en';
    try {
        const saved = localStorage.getItem(STORE_KEY);
        if (saved && translations[saved]) start = saved;
        else if ((navigator.language || '').toLowerCase().startsWith('ru')) start = 'ru';
    } catch (e) { /* ignore */ }
    updateLanguage(start);
});
