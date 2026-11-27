# Sovittelu Lapsille

**Open-Source, Local-First Conflict Mediation Progressive Web App (PWA)**

* **Live Prototype:** [https://sovittelulapsille.pages.dev](https://sovittelulapsille.pages.dev)
* **License:** MIT
* **Architecture:** Zero-Backend • Zero-Tracking • Zero-AI Tokens • Offline-First

---

## Overview

**Sovittelu Lapsille** (*Mediation for Children*) is a dependency-free, browser-native Progressive Web App designed to guide children (ages 6–14), families, educators, and public librarians through structured conflict de-escalation and restorative self-mediation.

Grounded in over 13 years of frontline municipal conflict mediation practice in Helsinki (200+ family, youth, and community cases annually) and a Montessori-validated educational board game, the application translates restorative justice methodology into calm, step-by-step interactive prompts.

> **Independent Initiative:** This is an independent, non-commercial open-source civic-tech project developed outside of municipal employment.

---

## Core Architectural Principles

* **100% Local-First & Private by Design:** All session state resides strictly on the user's device (`localStorage` / memory) and clears automatically or on demand. There are no user accounts, no backend servers, no analytics, and zero telemetry—ensuring strict GDPR and child-safety compliance.
* **Offline-Resilient PWA:** Powered by standard W3C Service Workers and Cache API, the app becomes instantly available offline after a single load—ideal for QR-code stations in public libraries, schools, and community centers.
* **Zero-Token Sustainability:** By encoding structured restorative pedagogy into lightweight, deterministic vanilla JavaScript rather than cloud LLMs, the tool operates indefinitely with near-zero energy footprint and zero recurring API or hosting costs.
* **Accessible & Inclusive:** Designed for pre-readers, dyslexic users, and neurodivergent children (ADHD/sensory sensitivity), utilizing browser-native Web Speech API (`window.speechSynthesis`) for local audio narration without cloud calls.

---

## Roadmap & Milestones

The current live deployment serves as a functional proof-of-concept. Upcoming development focuses on clean-room engineering and public-space readiness:

1. **Milestone 1 — Human-Led Code Audit & Clean Architecture:** Line-by-line manual audit and refactoring into dependency-free, modular vanilla HTML5/CSS3/ES6+ JavaScript (`<100 KB` payload), hardened Service Worker caching, and deterministic shared-device session reset.
2. **Milestone 2 — Modular Internationalization (i18n):** Decoupling branching dialogue flows and UI strings into lightweight JSON locale packs (**Finnish, English, Swedish, and Russian**) so educators and translators can add languages without touching core logic.
3. **Milestone 3 — WCAG AAA Accessibility & Helsinki Pilots:** Full ARIA semantics, keyboard navigation, high-contrast/low-stimulation modes, resilient offline `speechSynthesis` narration, and observational usability pilots with families and public libraries in Helsinki.
4. **Milestone 4 — Self-Hosting & QR-Deployment Toolkit (v1.0):** Printable offline QR-poster templates and documentation enabling schools, libraries, and civic groups worldwide to fork and deploy private instances in minutes.

---

## Local Development & Self-Hosting

No build tools, package managers (`npm`), or backend runtimes are required.

1. Clone or download this repository:
   ```bash
   git clone [https://github.com/Olhil/sovittelulapsille.git](https://github.com/Olhil/sovittelulapsille.git)
