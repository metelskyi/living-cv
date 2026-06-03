# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x     | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it privately.

**Do not open a public GitHub issue.**

Instead, email the maintainer at **metelskiiigor@gmail.com** or open a private advisory at:

https://github.com/metelskyi/living-cv/security/advisories/new

You should receive a response within 48 hours. If you do not, please follow up.

## Responsible Disclosure

We kindly ask that you:
- Give us reasonable time to fix the issue before disclosing it publicly.
- Provide a clear description of the vulnerability and a proof of concept if possible.
- Do not access or modify user data without explicit permission.

## Security Measures

- Authentication is handled via GitHub OAuth (admin-only access).
- All secrets and tokens are stored in environment variables (Vercel / .env.local), never committed.
- Dependabot is enabled for automated dependency scanning.
- GitHub secret scanning is active for the repository.
