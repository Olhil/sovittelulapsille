# Contributing to Sovittelu Lapsille

Thank you for your interest in making restorative conflict mediation accessible, private, and free for children, families, and public spaces worldwide.

---

## Core Engineering & Governance Rules

To guarantee long-term maintainability, security for minors, and alignment with open-web standards, all contributions must adhere to the following rules:

1. **Strict Human-Authored Code Policy:**
   While the initial proof-of-concept prototype was built to validate domain workflows, all ongoing codebase refactoring, localization architecture, and accessibility features are **100% human-written and manually audited**. Do not submit pull requests containing auto-generated AI code.
2. **Zero Runtime Dependencies:**
   The core application must remain pure, idiomatic **HTML5, CSS3, and vanilla ES6+ JavaScript**. Do not introduce `npm` packages, external JavaScript frameworks, third-party CSS libraries, or external CDN links.
3. **Zero Network Calls & Zero Telemetry:**
   The application must never make external HTTP requests (no analytics, no remote fonts, no cloud Text-to-Speech APIs, no tracking pixels). Everything must run offline in the browser.

---

## Ways to Contribute

### 1. Translations & Cultural Adaptation (i18n)
Our goal is to decouple all mediation scripts and interface strings into modular JSON locale files (`locales/fi.json`, `locales/en.json`, `locales/sv.json`, `locales/ru.json`).
* If you are a native speaker, mediator, or educator, you will be able to fork a locale file and adapt prompts for your language and cultural context without modifying application logic.
* Keep language calm, non-punitive, age-appropriate (ages 6–14), and clear for neurodivergent readers.

### 2. Accessibility & Cross-Browser Testing
We target **WCAG AAA** compliance and reliable offline behavior across low-end tablets and smartphones:
* Test Service Worker caching and offline reloads on **iOS Safari**, **Android Chrome**, and desktop browsers.
* Verify screen-reader navigation, keyboard focus order, high-contrast readability, and local browser `window.speechSynthesis` behavior.

### 3. Public-Space & Library Pilots
If you test **Sovittelu Lapsille** via QR codes in a classroom, library, or youth center, open a GitHub Issue to share qualitative UX observations (without sharing any personal or sensitive user data).

---

## License

By contributing to this repository, you agree that your contributions will be licensed under the **MIT License**.
