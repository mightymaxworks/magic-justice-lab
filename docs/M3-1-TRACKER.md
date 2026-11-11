# MAGIC JusTICe Lab — M3.1 engineering tracker

Updated: 2026-11-11. CI run #46 passed for commit 7bb702ac. Cloudflare staging remains unverified from available tools; source commits alone do not prove deployment.

| ID | Subtask | Status | Evidence / gate |
| --- | --- | --- | --- |
| M3.1-01 | Route architecture | Implemented; CI passed (run #46) | Hash-based client routing for 8 routes in src/main.tsx |
| M3.1-02 | Home and shared layout | Implemented; CI passed (run #46) | Reusable header, footer, page cards |
| M3.1-03 | Our Purpose | Draft implemented; CI passed; institutional content review pending | Purpose, principles, scope disclaimer |
| M3.1-04 | Innovation Labs | Draft implemented; CI passed; institutional content review pending | Four research themes, prototype disclaimer |
| M3.1-05 | Projects | Scaffold implemented; approved project content pending | No unapproved project claims |
| M3.1-06 | Innovation Challenges | Scaffold implemented; approvals pending | No open submissions |
| M3.1-07 | MAGIC Ideas | Safe informational placeholder | No collection of personal information |
| M3.1-08 | Insights & Events | Scaffold implemented; editorial content pending | No unapproved announcements |
| M3.1-09 | Collaborate | Scaffold implemented; verified contact channel pending | No fabricated contact address |
| M3.1-10 | Mobile navigation | Implemented; CI passed; device verification pending | Menu toggle and responsive CSS |
| M3.1-11 | Accessibility | Partially implemented; audit pending | Skip link, nav labels, focus states, reduced motion |
| M3.1-12 | Branding | Implemented; CI passed; visual verification pending | MAGIC JusTICe Lab in UI and metadata |
| M3.1-13 | Automated CI | Verified pass for commit 7bb702ac | GitHub Actions CI run #46: lint, typecheck, tests, build all succeeded |
| M3.1-14 | Cloudflare staging | Unverified | Deploy workflow configured for develop; live site and health endpoint could not be accessed from verification environment; no deployment success claim |
| M3.1-15 | Browser visual regression | Not started | Add screenshots/Playwright when runner is configured |
| M3.1-16 | Cloudflare Access / security review | Not started | Decide internal preview protection and data policy |

## Release boundaries

- M3 public pages are informational; no personal data collection.
- M4 private submissions and M5 approvals are separate future releases.
- Public hosting and durable storage stay in managed cloud, per OurOwn ADR-001; contributed nodes only execute authorised compute.
- This file is a task register, not a claim that the release is approved or production-ready.
