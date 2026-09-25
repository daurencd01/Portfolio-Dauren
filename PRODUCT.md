# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Existing codebase: static HTML/CSS/vanilla JS front end (no framework/build step), served by a small Node.js dev server (`server.js`) that emulates Vercel Serverless Functions for local development. Deployed on Vercel (live at daurencd.xyz) with Upstash Redis for rate-limiting/caching on the API side.

## Users

Primary audience is broad by design (confirmed): HR/recruiters and hiring managers in cybersecurity — both local Kazakhstan employers and international/remote-friendly companies — as well as the security community/professional network (peers, mentors, potential collaborators). The site serves both an active job/opportunity search and longer-term personal-brand/networking.

## Product Purpose

A personal cybersecurity portfolio for Koshkenbek Dauren (KD_SEC) that proves real, working skill rather than just claiming it: a SOC analyst's actual work history, real certifications and diploma, real self-built projects, and three live, functioning security tools a visitor can actually run. Success is a recruiter or peer coming away convinced of hands-on competence and reaching out (download CV, contact, or try a tool).

## Positioning

Confirmed: a SOC/Blue Team practitioner actively leveling up into Red Team/offensive security — not a student claiming pentesting skill, and not a pure generalist developer. The site's own structure should keep reflecting this arc: real Blue Team job experience as the credibility base, an explicit "(in training)" honesty on the pentester role, and an Attack Chain / methodology section framed as the path being built toward rather than mastered.

## Operating Context

- Recruiter/HR mode: a dedicated toggle that swaps the flashy portfolio view for a clean, printable-feeling summary card (photo, role, key facts, CV/contact links) — used when a recruiter wants facts fast.
- Bilingual EN/RU (data-i18n driven), serving both Kazakhstan/Russian-speaking and international audiences; some content is also useful in Kazakh (diploma) and the profile notes Kazakh/Russian/English/Chinese language ability.
- Visited on both desktop and mobile; mobile gets its own bottom tab bar navigation, desktop gets a floating section-dot rail + prev/next flip buttons.
- Three additional live tool pages (`/scanner.html`, `/osint.html`, `/exposure.html`) are part of the product, not just links out — they are real, working, passive-only security tools with their own legal/educational disclaimers.
- CV download, direct contact methods (email, GitHub, Telegram, Instagram, LinkedIn) are primary conversion actions.

## Capabilities and Constraints

- Sections: hero, about (operator dossier + focus areas), professional experience, attack-chain/skills pipeline, security-arsenal tools grid, projects, education, certification vault (incl. diploma), general certificates archive, "how I think" mindset, a simulated live-threat feed + counter (labeled SIMULATED), contact.
- Must preserve existing interactive behavior when doing design work: boot/intro animation, particle canvas background with a blue→red scroll-driven theme-color gradient, HR-mode toggle, EN/RU language switcher (`js/language-switcher.js`, keyed by `data-i18n`), section-nav highlighting, and the (simulated/labeled-as-simulation) SOC dashboard counters.
- Real, verifiable evidence must stay accurate: do not fabricate metrics, employers, dates, or credentials not already confirmed in the codebase or by the user.
- The three tool pages perform only passive, legal, educational checks (explicitly disclaimed) — never active exploitation.

## Brand Commitments

- Name/handle: "KD_SEC". Full name: Koshkenbek Dauren.
- Visual system (redesigned 2026-09-25 from the user's reference image): SOC-console bento wall, green-tinted near-black, neon green primary with red (offense), blue (defense), amber/cyan minor accents; Tiny5 pixel display + JetBrains Mono UI; corner-bracketed panels, 3D-tilting panels/ID card, WebGL threat globe. Documented in DESIGN.md.
- Recruiter mode intentionally switches to a plain light, print-friendly theme (token remap) - this contrast is deliberate, not a bug to unify away.
- Reference-image content that is NOT in the evidence on hand (Habitica Mod project, HackTheBox/eJPT/Security+/OSCP entries, inflated skill percentages) must not be shipped as fact.

## Evidence on Hand

- Real employers/roles: SOC Analyst L1 at Sauyt Lab (Freedom, Feb 2026–present) and Sr Holding (China, Sep 2025–Feb 2026); Network Security Project Participant at Kazakhtelecom (Sapa+, Jan–Jun 2025).
- Real education: Bachelor's degree, Cybersecurity (6B06106), Astana IT University, awarded 2026-06-30, BD № 00040351726 — diploma PDF on file at `assets/certificates/050614501880-20260813153532211.pdf`, rendered to `assets/certificates/diploma.png` for display.
- Real certifications: CyberShield Certified SOC Analyst (CSCSA) via CyberShield Academy/State Technical Service; Red Hat System Administration I (RH124). Plus a general archive of IBM/LearnQuest course certificates.
- Real self-built projects: HackShield (diploma/graduation project, gamified cybersecurity training platform, live at hackshield-play-nexus.vercel.app) and OYNA (amateur sports matchmaking platform, live at oyna-play.vercel.app).
- Real, live, functioning tools built by the user: Web Security Scanner, OSINT Lookup, Exposure Check (see README.md for their actual mechanisms — TLS/header scoring, WHOIS/DNS/CT-log/Wayback recon, k-anonymity breach checks).
- Languages: Kazakh (native), Russian (C1), English (B1), Chinese (HSK5).
- No testimonials, press, case studies, or benchmark numbers exist — the SOC dashboard's "threats blocked" counter and the hero's "active scans / vulnerabilities" stat tiles are explicitly labeled simulation/decoration and must stay labeled as such; they are not real telemetry and must never be presented as real.

## Product Principles

1. Prove, don't just claim — every credibility element (job, cert, diploma, project) should be real, verifiable, and linked/viewable where possible.
2. Honesty about level — "(in training)" / "developing" framing for offensive-security skill stays; do not inflate positioning beyond what Evidence on Hand supports.
3. Blue-to-Red arc is the throughline — Blue Team is the proven foundation, Red Team is the visible direction of growth; keep this narrative coherent across sections rather than presenting two disconnected skill sets.
4. Recruiter speed vs. depth are both first-class — HR mode must stay a genuinely fast, clean path; the full portfolio can stay expressive/visual for peers and deeper reviewers.
5. Bilingual by default — new copy should ship with both EN and RU `data-i18n` entries, not English-only.

## Accessibility & Inclusion

No formally required standard confirmed. Existing implementation already provides `:focus-visible` outlines on interactive controls and a `prefers-reduced-motion` fallback for the intro/scanline/rail animations — preserve both when extending the design system.
