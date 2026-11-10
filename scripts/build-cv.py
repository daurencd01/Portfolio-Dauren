"""Build the portfolio's downloadable CVs from the reviewed LinkedIn facts."""

from html import escape
from pathlib import Path
from shutil import copyfile

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "cv"
FONT = Path("C:/Windows/Fonts/DejaVuSans.ttf")
FONT_BOLD = Path("C:/Windows/Fonts/DejaVuSans-Bold.ttf")
pdfmetrics.registerFont(TTFont("DVS", str(FONT)))
pdfmetrics.registerFont(TTFont("DVS-Bold", str(FONT_BOLD)))
pdfmetrics.registerFontFamily("DVS", normal="DVS", bold="DVS-Bold")

NAVY = colors.HexColor("#101b2c")
BLUE = colors.HexColor("#1874c8")
INK = colors.HexColor("#1c2637")
MUTED = colors.HexColor("#526174")
LINE = colors.HexColor("#d7e1ec")
PAGE_W, PAGE_H = A4
LEFT = 42
RIGHT = PAGE_W - 42
WIDTH = RIGHT - LEFT

DATA = {
    "EN": {
        "name": "DAUREN KOSHKENBEK",
        "role": "Penetration Tester  |  SOC Analyst L1",
        "summary_title": "PROFILE",
        "summary": "Cybersecurity graduate of Astana IT University (2026). Penetration Tester at Jupiter SR and SOC Analyst L1 at Freedom Cloud Kazakhstan. Focused on authorized web and network vulnerability assessment, SIEM monitoring, alert triage and threat detection.",
        "experience": "EXPERIENCE",
        "jobs": [
            ("Penetration Tester · Jupiter SR", "Jun 2026 – Present",
             "Remote contract. Reconnaissance, enumeration and vulnerability assessment of web applications and network services. Validate findings with Nmap, Burp Suite, Metasploit and SQLMap; provide evidence and remediation guidance."),
            ("SOC Analyst L1 · Freedom Cloud Kazakhstan", "Feb 2026 – Present",
             "Monitor and triage Splunk SIEM alerts; analyze network, endpoint and system logs for suspicious activity and IOCs. Escalate incidents and support continuous monitoring."),
            ("SOC Analyst L1 · Jupiter SR", "Sep 2025 – Jun 2026",
             "Remote contract in an international SOC. Monitored alerts, analyzed logs with SIEM tools and escalated incidents."),
            ("Network Specialist · Kazakhtelecom JSC", "Jan – Jun 2025",
             "Supported secure network infrastructure and assisted with network security monitoring and analysis."),
        ],
        "education": "EDUCATION",
        "degree": "Astana IT University · Bachelor's degree in Cybersecurity · Sep 2023 – Jun 2026",
        "projects": "PROJECTS",
        "project_items": [
            "HackShield · Developed a gamified cybersecurity training platform as a graduation project.",
            "OYNA · Contributed to product development of an amateur sports platform.",
        ],
        "certs": "CERTIFICATIONS & TRAINING",
        "cert_items": [
            "Certified Practitioner in Prompt Injection and Input Integrity · DarkControl",
            "Introduction to AI Security · AI Security University",
            "CyberShield Certified SOC Analyst (CSCSA) · State Technical Service",
            "Red Hat System Administration I (RH124) · attendance certificate",
            "Next-Generation Firewalls and Intrusion Prevention · LearnQuest",
            "Securing Cloud and Hybrid Networks · LearnQuest",
            "Exploratory Data Analysis for Machine Learning · IBM",
            "Supervised Machine Learning: Regression · IBM",
        ],
        "skills": "SKILLS & LANGUAGES",
        "skill_text": "Burp Suite · Nmap · Kali Linux · Metasploit · SQLMap · Splunk SIEM · log and IOC analysis · web and network security",
        "languages": "Kazakh (native) · Russian (C1) · English (B1) · Chinese (HSK 5)",
    },
    "RU": {
        "name": "ДАУРЕН КОШКЕНБЕК",
        "role": "Пентестер  |  SOC-аналитик L1",
        "summary_title": "ПРОФИЛЬ",
        "summary": "Выпускник Astana IT University по специальности «Кибербезопасность» (2026). Пентестер в Jupiter SR и SOC-аналитик L1 в Freedom Cloud Kazakhstan. Специализация: согласованная оценка уязвимостей веб-приложений и сетей, мониторинг SIEM, обработка оповещений и обнаружение угроз.",
        "experience": "ОПЫТ РАБОТЫ",
        "jobs": [
            ("Пентестер · Jupiter SR", "Июн 2026 – н. в.",
             "Удалённый контракт. Разведка и оценка уязвимостей веб-приложений и сетевых сервисов. Проверка с Nmap, Burp Suite, Metasploit и SQLMap; отчёты с доказательствами и рекомендациями."),
            ("SOC-аналитик L1 · Freedom Cloud Kazakhstan", "Фев 2026 – н. в.",
             "Мониторинг и обработка оповещений Splunk SIEM, анализ сетевых, системных и endpoint-логов и IOC. Эскалация инцидентов и непрерывный мониторинг."),
            ("SOC-аналитик L1 · Jupiter SR", "Сен 2025 – июн 2026",
             "Удалённый контракт в международном SOC. Мониторинг оповещений, анализ логов с помощью SIEM и эскалация инцидентов."),
            ("Сетевой специалист · Kazakhtelecom JSC", "Янв – июн 2025",
             "Поддержка защищённой сетевой инфраструктуры, мониторинг и анализ событий сетевой безопасности."),
        ],
        "education": "ОБРАЗОВАНИЕ",
        "degree": "Astana IT University · Бакалавр кибербезопасности · Сен 2023 – июн 2026",
        "projects": "ПРОЕКТЫ",
        "project_items": [
            "HackShield · Разработал игровую платформу обучения кибербезопасности как дипломный проект.",
            "OYNA · Участвовал в разработке платформы для любительского спорта.",
        ],
        "certs": "СЕРТИФИКАТЫ И ОБУЧЕНИЕ",
        "cert_items": [
            "Certified Practitioner in Prompt Injection and Input Integrity · DarkControl",
            "Introduction to AI Security · AI Security University",
            "CyberShield Certified SOC Analyst (CSCSA) · State Technical Service",
            "Red Hat System Administration I (RH124) · сертификат об участии",
            "Next-Generation Firewalls and Intrusion Prevention · LearnQuest",
            "Securing Cloud and Hybrid Networks · LearnQuest",
            "Exploratory Data Analysis for Machine Learning · IBM",
            "Supervised Machine Learning: Regression · IBM",
        ],
        "skills": "НАВЫКИ И ЯЗЫКИ",
        "skill_text": "Burp Suite · Nmap · Kali Linux · Metasploit · SQLMap · Splunk SIEM · анализ логов и IOC · безопасность веб-приложений и сетей",
        "languages": "Казахский (родной) · Русский (C1) · Английский (B1) · Китайский (HSK 5)",
    },
    "KZ": {
        "name": "ДӘУРЕН ҚОШКЕНБЕК",
        "role": "Пентестер  |  SOC талдаушысы L1",
        "summary_title": "ПРОФИЛЬ",
        "summary": "Astana IT University киберқауіпсіздік мамандығының 2026 жылғы түлегі. Jupiter SR компаниясында пентестер, Freedom Cloud Kazakhstan компаниясында SOC талдаушысы L1. Рұқсат етілген веб және желілік осалдықтарды бағалау, SIEM мониторингі және қауіптерді анықтау бағытында жұмыс істейді.",
        "experience": "ЖҰМЫС ТӘЖІРИБЕСІ",
        "jobs": [
            ("Пентестер · Jupiter SR", "Маусым 2026 – қазір",
             "Қашықтан келісімшарт. Веб-қосымшалар мен желілік сервистерді зерттеу және осалдықтарды бағалау. Nmap, Burp Suite, Metasploit және SQLMap арқылы тексеру; дәлелдер мен түзету ұсыныстарын дайындау."),
            ("SOC талдаушысы L1 · Freedom Cloud Kazakhstan", "Ақпан 2026 – қазір",
             "Splunk SIEM ескертулерін бақылау және өңдеу, желі, жүйе және endpoint журналдарын, IOC көрсеткіштерін талдау. Инциденттерді әрі қарай қарауға жіберу."),
            ("SOC талдаушысы L1 · Jupiter SR", "Қыркүйек 2025 – маусым 2026",
             "Халықаралық SOC-та қашықтан келісімшарттық жұмыс. Ескертулер мен журналдарды талдау, инциденттерді әрі қарай жіберу."),
            ("Желілік маман · Kazakhtelecom JSC", "Қаңтар – маусым 2025",
             "Қауіпсіз желілік инфрақұрылымды қолдау, желілік қауіпсіздік оқиғаларын бақылау және талдау."),
        ],
        "education": "БІЛІМ",
        "degree": "Astana IT University · Киберқауіпсіздік бакалавры · Қыркүйек 2023 – маусым 2026",
        "projects": "ЖОБАЛАР",
        "project_items": [
            "HackShield · Дипломдық жоба ретінде киберқауіпсіздікті оқытатын ойын платформасын әзірледі.",
            "OYNA · Әуесқой спорт платформасын әзірлеуге қатысты.",
        ],
        "certs": "СЕРТИФИКАТТАР ЖӘНЕ ОҚУ",
        "cert_items": [
            "Certified Practitioner in Prompt Injection and Input Integrity · DarkControl",
            "Introduction to AI Security · AI Security University",
            "CyberShield Certified SOC Analyst (CSCSA) · State Technical Service",
            "Red Hat System Administration I (RH124) · қатысу сертификаты",
            "Next-Generation Firewalls and Intrusion Prevention · LearnQuest",
            "Securing Cloud and Hybrid Networks · LearnQuest",
            "Exploratory Data Analysis for Machine Learning · IBM",
            "Supervised Machine Learning: Regression · IBM",
        ],
        "skills": "ДАҒДЫЛАР МЕН ТІЛДЕР",
        "skill_text": "Burp Suite · Nmap · Kali Linux · Metasploit · SQLMap · Splunk SIEM · журналдар мен IOC талдауы · веб және желі қауіпсіздігі",
        "languages": "Қазақ тілі (ана тілі) · Орыс тілі (C1) · Ағылшын тілі (B1) · Қытай тілі (HSK 5)",
    },
}


def paragraph(c, value, y, *, size=9.0, leading=13.0, color=INK, bold=False, indent=0):
    style = ParagraphStyle(
        "body", fontName="DVS-Bold" if bold else "DVS",
        fontSize=size, leading=leading, textColor=color, alignment=TA_LEFT,
    )
    p = Paragraph(escape(value), style)
    _, height = p.wrap(WIDTH - indent, PAGE_H)
    p.drawOn(c, LEFT + indent, y - height)
    return y - height


def section(c, title, y):
    y -= 14
    c.setFillColor(BLUE)
    c.setFont("DVS-Bold", 9.0)
    c.drawString(LEFT, y, title)
    c.setStrokeColor(LINE)
    c.setLineWidth(0.7)
    c.line(LEFT, y - 4, RIGHT, y - 4)
    return y - 12


def build(lang, data):
    path = OUT / f"Koshkenbek_Dauren_CV_{lang}.pdf"
    c = canvas.Canvas(str(path), pagesize=A4, pageCompression=1)
    c.setTitle(f"Dauren Koshkenbek CV ({lang})")
    c.setAuthor("Dauren Koshkenbek")
    c.setFillColor(NAVY)
    c.rect(0, PAGE_H - 104, PAGE_W, 104, fill=1, stroke=0)
    c.setFillColor(colors.white)
    c.setFont("DVS-Bold", 19)
    c.drawString(LEFT, PAGE_H - 40, data["name"])
    c.setFont("DVS", 10)
    c.drawString(LEFT, PAGE_H - 60, data["role"])
    c.setFont("DVS", 7.5)
    c.drawString(LEFT, PAGE_H - 79, "Astana, Kazakhstan  ·  daurencd@gmail.com  ·  daurencd.xyz")
    c.drawString(LEFT, PAGE_H - 92, "linkedin.com/in/dauren-koshkenbek-6b90a9358  ·  github.com/daurencd01")
    y = PAGE_H - 119

    y = section(c, data["summary_title"], y)
    y = paragraph(c, data["summary"], y) - 2

    y = section(c, data["experience"], y)
    for role, dates, detail in data["jobs"]:
        y = paragraph(c, role, y, size=9.1, leading=13.3, bold=True)
        y = paragraph(c, dates, y, size=8.1, leading=11.3, color=MUTED)
        y = paragraph(c, detail, y, size=8.7, leading=12.8) - 6

    y = section(c, data["education"], y)
    y = paragraph(c, data["degree"], y) - 1

    y = section(c, data["projects"], y)
    for item in data["project_items"]:
        y = paragraph(c, item, y) - 2

    y = section(c, data["certs"], y)
    for item in data["cert_items"]:
        y = paragraph(c, "• " + item, y, size=8.4, leading=11.8) - 0.5

    y = section(c, data["skills"], y)
    y = paragraph(c, data["skill_text"], y, size=8.5, leading=12.0) - 3
    y = paragraph(c, data["languages"], y, size=8.5, leading=12.0)
    if y < 25:
        raise RuntimeError(f"{lang} CV overflows page: bottom y={y:.1f}")
    c.save()
    print(f"{lang}: {path} (bottom y={y:.1f})")


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    for code, content in DATA.items():
        build(code, content)
    copyfile(OUT / "Koshkenbek_Dauren_CV_EN.pdf", OUT / "Koshkenbek_Dauren_CV.pdf")
