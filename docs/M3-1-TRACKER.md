# MAGIC JusTICe Lab — M3.1 engineering tracker

Updated: 2026-11-11. CI run #46 passed for commit 7bb702ac; subsequent favicon changes require fresh verification. Cloudflare staging remains unverified from available tools; source commits alone do not prove deployment.

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

| M3.1-17 | Favicon | Implemented; CI/deployment pending | SVG monogram at public/favicon.svg; linked in index.html; tests/favicon.test.ts; commit e40378b8 |\n\n## Release boundaries

- M3 public pages are informational; no personal data collection.
- M4 private submissions and M5 approvals are separate future releases.
- Public hosting and durable storage stay in managed cloud, per OurOwn ADR-001; contributed nodes only execute authorised compute.
- This file is a task register, not a claim that the release is approved or production-ready.

## M3.2 — Bhutan-inspired visual refresh (2026-11-11)

- [x] Translate artist-impression visual language into lightweight SVG/CSS Himalayan silhouette, gold-violet highlights, and warm editorial presentation (commits c18611b3 and 4532fb3a).
- [x] Add homepage narrative and direct link to Innovation Challenges.
- [ ] Confirm CI success for latest commits and Cloudflare staging deployment.
- [ ] Browser review: desktop, mobile, typography, contrast, and official JusTICe spelling.
- [ ] Obtain approval to publish artist impressions as **conceptual renderings**, with explicit non-photographic captions.
- [ ] Upload approved optimized WebP/AVIF imagery through a binary-capable Git workflow; the current GitHub text-file tool cannot safely publish the supplied PNGs.
- [ ] Populate real project and event content following institutional review.

Do not label concept renders as photographs of a completed lab, and do not publish an unverified node count or service status shown in the concepts.
