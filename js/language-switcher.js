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
            "exp_val": "Penetration Tester — Jupiter SR · SOC Analyst L1 — Freedom Cloud Kazakhstan",
            "edu_label": "Education",
            "edu_val": "Astana IT University — Cybersecurity (graduated 2026)",
            "cert_label": "Certifications & Training",
            "cert_val": "DarkControl Prompt Injection · AI Security University · CyberShield CSCSA · Red Hat RH124 attendance",
            "lang_label": "Languages",
            "lang_val": "Kazakh · Russian C1 · English B1 · Chinese HSK5"
        },
        "hero": {
            "whoami": "WHOAMI",
            "name1": "DAUREN",
            "name2": "KOSHKENBEK",
            "role1": "PENETRATION TESTER",
            "role2": "SOC ANALYST L1",
            "blurb": "I assess web applications and network services in authorized engagements, while monitoring threats and investigating alerts in a SOC. My defensive experience informs my offensive work.",
            "work": "VIEW MY WORK",
            "cv": "DOWNLOAD CV"
        },
        "about": {
            "eyebrow": "// 02",
            "dossier": "OPERATOR DOSSIER",
            "desc": "I am Dauren Koshkenbek, a 2026 Cybersecurity graduate of Astana IT University. I work as a Penetration Tester at Jupiter SR and a SOC Analyst L1 at Freedom Cloud Kazakhstan.\n\nMy offensive work covers reconnaissance, enumeration and vulnerability assessment of web applications and network services. I use Kali Linux, Nmap, Burp Suite, Metasploit and SQLMap within authorized scopes, then document evidence and remediation guidance.\n\nIn the SOC, I monitor Splunk alerts, examine network, endpoint and system logs, identify indicators of compromise and escalate incidents. I previously worked as a SOC Analyst L1 at Jupiter SR and a Network Specialist at Kazakhtelecom JSC.\n\nI developed HackShield, a gamified cybersecurity training project, and contributed to the OYNA sports platform.",
            "fact_loc": "Astana, Kazakhstan",
            "fact_edu": "Astana IT University",
            "fact_lang": "KZ / RU / EN / CN",
            "fact_open": "Open to opportunities"
        },
        "goals": {
            "short_title": "CURRENT FOCUS",
            "short_desc": "Web application security and vulnerability assessment",
            "long_title": "OPEN TO",
            "long_desc": "Penetration Tester and Cybersecurity Specialist roles"
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
            "note": "I use reconnaissance, validation and reporting in authorized penetration tests, informed by my SOC experience."
        },
        "arsenal": {
            "eyebrow": "// 04",
            "subtitle": "CONTINUOUSLY LEARNING"
        },
        "exp": {
            "title": "EXPERIENCE",
            "group": {
                "company": "Jupiter SR",
                "note": "Career progression: SOC Analyst L1 → Penetration Tester",
                "date": "September 2025 – Present"
            },
            "job1": {
                "role": "Penetration Tester",
                "company": "Jupiter SR",
                "date": "June 2026 – Present",
                "list1": "Remote contract penetration testing of web applications and network services",
                "list2": "Reconnaissance, enumeration and vulnerability assessment",
                "list3": "Validation with Nmap, Burp Suite, Metasploit and SQLMap in authorized scopes",
                "list4": "Findings documented with evidence and remediation guidance"
            },
            "job2": {
                "role": "SOC Analyst L1",
                "company": "Freedom Cloud Kazakhstan",
                "date": "February 2026 – Present",
                "list1": "Monitor and triage alerts in Splunk SIEM",
                "list2": "Analyze network, endpoint and system logs for suspicious activity and IOCs",
                "list3": "Escalate confirmed threats following SOC procedures",
                "list4": "Support continuous monitoring for enterprise and government clients"
            },
            "job3": {
                "role": "SOC Analyst L1",
                "company": "Jupiter SR",
                "date": "September 2025 – June 2026",
                "list1": "Remote contract work in an international SOC",
                "list2": "Monitored alerts and analyzed logs using SIEM tools",
                "list3": "Escalated incidents and supported threat detection"
            },
            "job4": {
                "role": "Network Specialist",
                "company": "Kazakhtelecom JSC",
                "date": "January – June 2025",
                "list1": "Supported network security work in a telecom environment",
                "list2": "Assisted with secure network infrastructure operations",
                "list3": "Monitored and analyzed network security events"
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
                "desc": "I contributed to OYNA, an amateur sports platform for skill-based matchmaking and connecting organizers with players."
            }
        },
        "cert": {
            "eyebrow": "// 06",
            "featured_title": "CREDENTIAL VAULT",
            "collection_tag": "CREDENTIALS & TRAINING",
            "featured_subtitle": "Industry-recognized professional training",
            "darkcontrol": {
                "title": "Certified Practitioner in Prompt Injection and Input Integrity",
                "short": "Prompt Injection & Input Integrity",
                "issuer": "DarkControl Certify · 15 Oct 2026",
                "badge": "PRACTITIONER CERTIFICATE"
            },
            "aisec": {
                "title": "Introduction to AI Security",
                "issuer": "AI Security University · 29 Sep 2026 · 2 hours",
                "badge": "COURSE COMPLETION"
            },
            "cscsa": {
                "title": "CyberShield Certified SOC Analyst (CSCSA)",
                "issuer": "CyberShield Academy · State Technical Service (STS)",
                "badge": "CERTIFICATION"
            },
            "rh": {
                "title": "Red Hat System Administration I (RH124)",
                "issuer": "Red Hat Training and Certification · 11 Jul 2025",
                "badge": "ATTENDANCE CERTIFICATE"
            },
            "diploma": {
                "title": "Bachelor's Diploma — Cybersecurity",
                "issuer": "Astana IT University · 30 Jun 2026 · BD № 00040351726",
                "short": "Bachelor's degree, Cybersecurity",
                "badge": "BACHELOR'S DEGREE"
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
            "training": "AUTHORIZED TESTING",
            "term": "TERMINAL",
            "term_hint": "TRY 'hunt'",
            "term_ph": "help",
            "featured": "FEATURED_PROJECTS",
            "tools": "SKILLS & TOOLS",
            "certs": "CERTIFICATES & TRAINING",
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
                "n": "KØZ",
                "d": "Breach intelligence, public profiles, local password and phone analysis. Explore incidents, filter evidence and export a private report."
            }
        },
        "ghost": {
            "launch": "INTERCEPT SIGNAL",
            "simulation": "PLAYABLE SIMULATION",
            "title": "GHOST PACKET",
            "description": "Intercept three rogue packets as they race through a simulated network. Time the capture and inspect each trace.",
            "play": "PLAY SIGNAL HUNT"
        },
        "sec": {
            "about": "ABOUT",
            "about_tag": "OPERATOR DOSSIER",
            "exp_tag": "PENTEST + SOC WORK"
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
            "help": "whoami  role  skills  experience  projects  certs  education  tools  hunt  contact  cv [en|ru|kz]  lang  clear",
            "hunt": "Tuning into the rogue signal...",
            "notfound": "command not found. type \"help\".",
            "role": "Penetration Tester | SOC Analyst L1",
            "motto": "Blue Team visibility. Red Team validation.",
            "skills": "SIEM · Log analysis · Linux · Windows · Networking · Web pentesting basics",
            "experience": "Jupiter SR · Sep 2025–present\n  ↳ Penetration Tester · promoted Jun 2026\n  ↳ SOC Analyst L1 · Sep 2025–Jun 2026\nFreedom Cloud Kazakhstan · SOC Analyst L1 · Feb 2026–present\nKazakhtelecom JSC · Network Specialist · Jan–Jun 2025",
            "projects": "HackShield · gamified cybersecurity training (diploma project)\nOYNA · amateur sports matchmaking platform\nSecurity Tools · scanner, OSINT lookup, KØZ\nGhost Packet · interactive simulated signal hunt",
            "certs": "DarkControl Prompt Injection & Input Integrity · AI Security University: Introduction to AI Security · CyberShield CSCSA · Red Hat RH124 (course attendance) · Bachelor in Cybersecurity (AITU)",
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
            "exp_val": "Пентестер — Jupiter SR · SOC-аналитик L1 — Freedom Cloud Kazakhstan",
            "edu_label": "Образование",
            "edu_val": "Astana IT University — Кибербезопасность (выпуск 2026)",
            "cert_label": "Сертификаты и обучение",
            "cert_val": "DarkControl Prompt Injection · AI Security University · CyberShield CSCSA · Red Hat RH124 (участие в курсе)",
            "lang_label": "Языки",
            "lang_val": "Казахский · Русский C1 · Английский B1 · Китайский HSK5"
        },
        "hero": {
            "whoami": "КТО Я",
            "name1": "ДАУРЕН",
            "name2": "КОШКЕНБЕК",
            "role1": "ПЕНТЕСТЕР",
            "role2": "SOC-АНАЛИТИК L1",
            "blurb": "Проверяю безопасность веб-приложений и сетевых сервисов в рамках согласованных задач, а также анализирую угрозы и оповещения в SOC. Опыт защиты помогает мне в пентесте.",
            "work": "МОИ РАБОТЫ",
            "cv": "СКАЧАТЬ CV"
        },
        "about": {
            "eyebrow": "// 02",
            "dossier": "ДОСЬЕ ОПЕРАТОРА",
            "desc": "Я Даурен Кошкенбек, выпускник Astana IT University по специальности «Кибербезопасность» (2026). Работаю пентестером в Jupiter SR и SOC-аналитиком L1 в Freedom Cloud Kazakhstan.\n\nВ пентесте занимаюсь разведкой, перечислением сервисов и оценкой уязвимостей веб-приложений и сетевой инфраструктуры. Использую Kali Linux, Nmap, Burp Suite, Metasploit и SQLMap в согласованных рамках; готовлю отчёты с доказательствами и рекомендациями.\n\nВ SOC обрабатываю оповещения Splunk, анализирую сетевые и системные логи, ищу индикаторы компрометации и передаю инциденты на эскалацию. Ранее работал SOC-аналитиком L1 в Jupiter SR и сетевым специалистом в Kazakhtelecom JSC.\n\nРазработал HackShield — игровой проект для обучения кибербезопасности — и участвовал в разработке спортивной платформы OYNA.",
            "fact_loc": "Астана, Казахстан",
            "fact_edu": "Astana IT University",
            "fact_lang": "KZ / RU / EN / CN",
            "fact_open": "Открыт к предложениям"
        },
        "goals": {
            "short_title": "ТЕКУЩИЙ ФОКУС",
            "short_desc": "Безопасность веб-приложений и оценка уязвимостей",
            "long_title": "ОТКРЫТ К ПРЕДЛОЖЕНИЯМ",
            "long_desc": "Пентестер и специалист по кибербезопасности"
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
            "note": "В согласованных пентестах применяю разведку, проверку уязвимостей и отчётность с опорой на опыт работы в SOC."
        },
        "arsenal": {
            "eyebrow": "// 04",
            "subtitle": "ПОСТОЯННОЕ ОБУЧЕНИЕ"
        },
        "exp": {
            "title": "ОПЫТ РАБОТЫ",
            "group": {
                "company": "Jupiter SR",
                "note": "Карьерный рост: SOC-аналитик L1 → пентестер",
                "date": "Сентябрь 2025 – настоящее время"
            },
            "job1": {
                "role": "Пентестер",
                "company": "Jupiter SR",
                "date": "Июнь 2026 – настоящее время",
                "list1": "Удалённое контрактное тестирование веб-приложений и сетевых сервисов",
                "list2": "Разведка, перечисление сервисов и оценка уязвимостей",
                "list3": "Проверка с Nmap, Burp Suite, Metasploit и SQLMap в согласованных рамках",
                "list4": "Отчёты с доказательствами и рекомендациями по устранению"
            },
            "job2": {
                "role": "SOC-аналитик L1",
                "company": "Freedom Cloud Kazakhstan",
                "date": "Февраль 2026 – настоящее время",
                "list1": "Мониторинг и первичная обработка оповещений в Splunk SIEM",
                "list2": "Анализ сетевых, системных и endpoint-логов на подозрительную активность и IOC",
                "list3": "Эскалация подтверждённых угроз по процедурам SOC",
                "list4": "Непрерывный мониторинг для корпоративных и государственных клиентов"
            },
            "job3": {
                "role": "SOC-аналитик L1",
                "company": "Jupiter SR",
                "date": "Сентябрь 2025 – июнь 2026",
                "list1": "Удалённая контрактная работа в международном SOC",
                "list2": "Мониторинг оповещений и анализ логов с помощью SIEM",
                "list3": "Эскалация инцидентов и участие в обнаружении угроз"
            },
            "job4": {
                "role": "Сетевой специалист",
                "company": "Kazakhtelecom JSC",
                "date": "Январь – июнь 2025",
                "list1": "Работа по сетевой безопасности в телекоммуникационной среде",
                "list2": "Помощь в поддержке защищённой сетевой инфраструктуры",
                "list3": "Мониторинг и анализ событий сетевой безопасности"
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
                "desc": "Участвовал в разработке OYNA — платформы для любительского спорта с подбором по уровню и поиском организаторов и игроков."
            }
        },
        "cert": {
            "eyebrow": "// 06",
            "featured_title": "ХРАНИЛИЩЕ КВАЛИФИКАЦИЙ",
            "collection_tag": "КВАЛИФИКАЦИИ И ОБУЧЕНИЕ",
            "featured_subtitle": "Профессиональное обучение с международным признанием",
            "darkcontrol": {
                "title": "Certified Practitioner in Prompt Injection and Input Integrity",
                "short": "Prompt Injection & Input Integrity",
                "issuer": "DarkControl Certify · 15 окт 2026",
                "badge": "СЕРТИФИКАТ ПРАКТИКА"
            },
            "aisec": {
                "title": "Introduction to AI Security",
                "issuer": "AI Security University · 29 сен 2026 · 2 часа",
                "badge": "ПРОЙДЕН КУРС"
            },
            "cscsa": {
                "title": "CyberShield Certified SOC Analyst (CSCSA)",
                "issuer": "CyberShield Academy · State Technical Service (STS)",
                "badge": "СЕРТИФИКАЦИЯ"
            },
            "rh": {
                "title": "Red Hat System Administration I (RH124)",
                "issuer": "Red Hat Training and Certification · 11 июл 2025",
                "badge": "СЕРТИФИКАТ ОБ УЧАСТИИ"
            },
            "diploma": {
                "title": "Диплом бакалавра — Кибербезопасность",
                "issuer": "Astana IT University · 30 июн 2026 · BD № 00040351726",
                "short": "Бакалавр, Кибербезопасность",
                "badge": "ДИПЛОМ БАКАЛАВРА"
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
            "training": "СОГЛАСОВАННЫЙ ПЕНТЕСТ",
            "term": "ТЕРМИНАЛ",
            "term_hint": "ПОПРОБУЙТЕ 'hunt'",
            "term_ph": "help",
            "featured": "ПРОЕКТЫ",
            "tools": "НАВЫКИ И ИНСТРУМЕНТЫ",
            "certs": "СЕРТИФИКАТЫ И ОБУЧЕНИЕ",
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
                "n": "KØZ",
                "d": "Аналитика утечек, публичные профили, локальный разбор паролей и телефонов. Каталог инцидентов, фильтры и экспорт отчёта."
            }
        },
        "ghost": {
            "launch": "ПЕРЕХВАТИТЬ СИГНАЛ",
            "simulation": "ИГРОВАЯ СИМУЛЯЦИЯ",
            "title": "GHOST PACKET",
            "description": "Перехватите три подозрительных пакета в смоделированной сети. Поймайте момент и изучите каждый след.",
            "play": "НАЧАТЬ ОХОТУ ЗА СИГНАЛОМ"
        },
        "sec": {
            "about": "ОБО МНЕ",
            "about_tag": "ДОСЬЕ ОПЕРАТОРА",
            "exp_tag": "ПЕНТЕСТ + SOC"
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
            "help": "whoami  role  skills  experience  projects  certs  education  tools  hunt  contact  cv [en|ru|kz]  lang  clear",
            "hunt": "Настраиваю приём подозрительного сигнала...",
            "notfound": "команда не найдена. введите \"help\".",
            "role": "Пентестер | SOC-аналитик L1",
            "motto": "Blue Team — видимость. Red Team — проверка.",
            "skills": "SIEM · Анализ логов · Linux · Windows · Сети · Основы веб-пентеста",
            "experience": "Jupiter SR · сен 2025–наст. время\n  ↳ Пентестер · повышение в июне 2026\n  ↳ SOC-аналитик L1 · сен 2025–июн 2026\nFreedom Cloud Kazakhstan · SOC-аналитик L1 · фев 2026–наст. время\nKazakhtelecom JSC · сетевой специалист · янв–июн 2025",
            "projects": "HackShield · геймифицированное обучение кибербезопасности (диплом)\nOYNA · платформа для любительского спорта\nИнструменты · сканер, OSINT, проверка утечек\nGhost Packet · игровая охота за сигналом",
            "certs": "DarkControl Prompt Injection & Input Integrity · AI Security University: Introduction to AI Security · CyberShield CSCSA · Red Hat RH124 (участие в курсе) · Бакалавр кибербезопасности (AITU)",
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
