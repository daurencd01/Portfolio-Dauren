---
name: KD_SEC Portfolio
description: SOC-console bento portfolio for Koshkenbek Dauren, SOC analyst growing into pentesting
colors:
  void: "#060b09"
  panel: "#09110e"
  panel-hi: "#0d1813"
  line: "#14302a"
  line-hi: "#21503f"
  signal-green: "#26e884"
  signal-red: "#ff4a4a"
  signal-blue: "#4796ff"
  signal-cyan: "#43e3ff"
  signal-amber: "#ffb84a"
  text: "#d8e8e0"
  text-dim: "#8aa398"
  text-mute: "#78927f"
typography:
  display:
    fontFamily: "Tiny5, JetBrains Mono, monospace"
    fontSize: "clamp(2.7rem, 4.2vw, 5.4rem)"
    fontWeight: 400
    lineHeight: 0.92
    letterSpacing: "0.01em"
  heading:
    fontFamily: "Tiny5, JetBrains Mono, monospace"
    fontSize: "clamp(2.1rem, 3.6vw, 3rem)"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "0.02em"
  title:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "normal"
  body:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "11px"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.14em"
rounded:
  sm: "2px"
  md: "4px"
  lg: "6px"
spacing:
  xs: "8px"
  sm: "14px"
  md: "16px"
  lg: "34px"
  xl: "92px"
components:
  button-primary:
    backgroundColor: "{colors.signal-green}"
    textColor: "#03150c"
    rounded: "{rounded.sm}"
    padding: "14px 22px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.text}"
    rounded: "{rounded.sm}"
    padding: "14px 22px"
  panel:
    backgroundColor: "{colors.panel}"
    rounded: "{rounded.md}"
    padding: "16px"
  tag:
    backgroundColor: "rgba(38, 232, 132, 0.06)"
    textColor: "{colors.signal-green}"
    rounded: "{rounded.sm}"
  status-pill:
    backgroundColor: "rgba(38, 232, 132, 0.07)"
    textColor: "{colors.signal-green}"
    rounded: "{rounded.sm}"
---

# Design System: KD_SEC Portfolio

## Overview

**Creative North Star: "The Analyst's Console Wall"**

The whole portfolio is one SOC wall: a bento of live-feeling panels on a green-tinted near-black void, corner-bracketed like monitor bezels, lit by a perspective grid floor and a faint scanline. The first viewport is the wall itself (identity with a 3D operator ID card, a WebGL threat globe, a simulated event feed, skill status bars, MITRE ATT&CK techniques, Blue/Red team cards, a working terminal, featured projects, tools, certifications). Below it the long-form sections (About, Experience, Projects, Skills, Certs, Contact) keep the same panel language so a recruiter can verify every claim.

Signal color carries meaning: green = primary action / online / verified, red = offense / danger, blue = defense, amber = a secondary technique tag, cyan only inside the ID-card tag. Anything decorative (globe feed, threat counter, ATT&CK list, skill bars) is labeled SIMULATED or self-assessed and never presented as telemetry.

**Key Characteristics:**
- Green-tinted near-black (never `#000`), hairline green-teal borders, 11px L-shaped corner brackets in the signal green.
- Two voices: Tiny5 pixel display (name, section titles, big numerals) and JetBrains Mono for everything else.
- 3D as interaction, not wallpaper: pointer-tilted panels (2-3deg), a pointer-driven 3D ID card with layered chips at different depths, a draggable WebGL globe, tile lift on hover, perspective floor.
- Boot sequence then staggered panel power-on (one authored entrance); everything is visible without JS motion and honors `prefers-reduced-motion`.
- HR mode is a deliberate light, print-friendly summary that reuses the same tokens.

## Colors

- **Void** (`#060b09`): page ground with two soft radial washes (green top-left, blue top-right).
- **Panel / Panel-hi** (`#09110e` / `#0d1813`): panel fill, always a vertical gradient with a pointer-following radial highlight.
- **Line / Line-hi** (`#14302a` / `#21503f`): 1px borders; line-hi on hover and interactive chips.
- **Signal Green** (`#26e884`): CTA fill, active tab, online dot, verified pills, status bars, terminal prompt.
- **Signal Red** (`#ff4a4a`): Red Team card, attack arcs, threat times, "in training" tag.
- **Signal Blue** (`#4796ff`): Blue Team card and defensive labels.
- **Signal Amber** (`#ffb84a`): alternating ATT&CK id tags, roadmap "goal" state.
- **Text / Dim / Mute** (`#d8e8e0` / `#8aa398` / `#78927f`): all at least 4.5:1 on the void.

### Named Rules
**The Simulated-Is-Labeled Rule.** Any number that looks live (event feed, counter, status bars) carries a SIMULATED or self-assessed label next to it.
**The Depth-With-Offset Rule.** Glows and shadows carry a y offset; no zero-offset halo on resting elements.

## Typography

- **Display / Heading (Tiny5, 400):** hero name, section titles, chain step numerals, contact headline. Use only at 28px and above; supports Cyrillic. Pixelify Sans was rejected because its C reads as O.
- **Everything else (JetBrains Mono):** UI labels 11px uppercase with 0.1-0.14em tracking, body 13px, reading paragraphs 14px in About. Long prose keeps a 72ch measure.
- Hero name uses container-query sizing (`13.2cqw`, max 5.4rem) so it never runs under the ID card.

## Layout

Max width 1740px centered, 34px gutters. The home wall is a 12-column grid with a 14px gap: hero (7) beside the right column (5: threats, then status + ATT&CK); Blue (4) / Red (4) / Terminal (4); Projects (5) / Skills (4) / Certs (3); a full-width strip with quote, 01-07 progress dots and the CTA. Below 1220px panels go 6/6, below 760px a single column with the ID card above the name and a bottom tab bar replacing the top tabs. Long-form sections use `sec-h` headers (chevron, Tiny5 title, mono tag).

## Elevation & Depth

Flat panels with corner brackets; depth comes from real 3D transforms and stacking: `perspective(1200px)` tilt on `[data-tilt]` panels, a `preserve-3d` ID card whose chips sit at translateZ 54-100px, tile hover `translateZ(14px)`, and a perspective grid floor under the wall. Shadows are used only under lifted elements (offset + blur).

## Components

- **Panel:** 4px radius, `--line` border, gradient fill, two corner brackets (top-left, bottom-right) in signal color.
- **Panel header:** `> TITLE_IN_CAPS` in 11-12px tracked uppercase, optional right tag or "VIEW ALL ->".
- **Buttons:** 3px/2px radius, 12px bold tracked uppercase; primary = green fill with dark ink, ghost = hairline border.
- **Status pill / OPEN TO WORK:** green outline, pulsing dot, always visible in the top bar.
- **Segmented bar:** repeating 4px/6px stripes, filled with green; used for self-assessed levels and languages.
- **Tile:** icon by CSS mask (colorable), 11px label; lifts in 3D on hover.
- **ID card:** duotone green photo, scanning line, pointer sheen, corner brackets, chips ACCESS GRANTED / HACK EXPLOIT SECURE / BLUE + RED.
- **Terminal:** real command interpreter (help, whoami, role, skills, experience, projects, certs, education, tools, contact, cv, lang, clear, open <section>), history and Tab completion, bilingual output.
- **Threat globe:** Three.js sphere of real land dots (Kazakhstan highlighted, Astana ringed), red inbound arcs fired by each simulated event, drag / pause / zoom.

## Do's and Don'ts

### Do:
- **Do** keep every new string bilingual (`data-i18n` EN + RU in `js/language-switcher.js`).
- **Do** label simulated data and keep IPs in documentation ranges (192.0.2.x, 198.51.100.x, 203.0.113.x).
- **Do** test HR mode (`body.recruiter-mode`) after touching shared components; it only re-maps tokens and hides the wall.
- **Do** keep UI text at 11px or above and body text at 12px or above.

### Don't:
- **Don't** put a 40px icon tile above a heading as page structure; tool cards use a path line plus a command sample instead.
- **Don't** use Pixelify Sans or any pixel face below 28px or without Cyrillic support.
- **Don't** invent metrics, employers, certificates or projects; Habitica Mod and other reference-image items are not in the evidence on hand.
- **Don't** add zero-offset glows to resting elements.
