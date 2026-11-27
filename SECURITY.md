# Security Policy

## Architecture & Threat Model
**Sovittelu Lapsille** is a strictly client-side, zero-backend Progressive Web App (PWA). It maintains no server databases, no user accounts, no authentication tokens, and no external network telemetry. All session data stays exclusively in the user's local browser storage and is cleared automatically or via the one-tap session reset.

## Supported Versions
Only the latest public release on the `main` branch (deployed at `https://sovittelulapsille.pages.dev`) is actively maintained and receives security updates.

## Reporting a Vulnerability
Because this tool is used by children, families, and public libraries, we take client-side security (such as XSS prevention, Service Worker cache integrity, and local state sanitization) seriously.

If you discover a security or privacy issue:
1. **Do not** disclose it publicly in a GitHub Issue until it has been reviewed.
2. Report the details privately to the project maintainer (`serezhem@gmail.com`) with steps to reproduce.
3. We will acknowledge your report within 72 hours and publish a fix as quickly as possible.
