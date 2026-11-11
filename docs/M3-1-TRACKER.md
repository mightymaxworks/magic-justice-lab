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

## M3.2 implementation update — gallery and catalogue

- [x] Conceptual Innovation Labs gallery using lightweight SVG/CSS visual motifs inspired by the five supplied artist impressions.
- [x] Project lifecycle schema: Concept, Prototype, Pilot, Operational.
- [x] Publication gate: only `approved: true` projects are displayed; illustrative research themes are not published as actual projects.
- [x] Automated source-level tests for gallery disclaimer and approval gate.
- [ ] Confirm latest CI/build and staging deployment.
- [ ] Upload actual artist-impression PNGs in optimized form and label as proposed-facility renderings.
- [ ] Review on real desktop/mobile browser and obtain institutional approval for gallery and text.
- [ ] Add editorial workflow and real project metadata (owner, review date, safeguards, outcomes).

This is a code-complete first slice, **not** a verified live release.

## M3.2 image integration — current state

- [x] Original supplied PNGs retained in the conversation working environment; do not modify originals.
- [x] Four optimized WebP files prepared under `public/images/` in a local ZIP: `hero-magic-lab.webp`, `gallery-collaboration.webp`, `gallery-heritage.webp`, `gallery-technology.webp`.
- [x] Website references these four paths; includes missing-image fallback, captions and responsive image layout.
- [x] Removed generic SVG gallery and mountain art.
- [ ] **BLOCKER: binary WebP files not yet committed to GitHub or published to Cloudflare.** GitHub text-file actions cannot upload the local binary images. Upload all four to the repository's `public/images/` folder using a binary-capable workflow. The staging deploy will then copy them into the public assets.
- [ ] Confirm CI and staging deployment after binary upload; inspect image URLs and mobile/desktop presentation.

**Do not mark image publication complete until all four URLs return real image content.**

## M3.2 R2 publishing infrastructure — November 11, 2026
- [x] User reports Cloudflare R2 bucket `magic-lab-assets` created (not independently verified).
- [x] Configure staging and production `LAB_ASSETS` R2 bindings in `wrangler.toml`.
- [x] Add GET/HEAD-only, explicit filename allowlist for `/images/*.webp` backed by `published/magic-justice-lab/` keys.
- [x] Prevent unauthorised public upload endpoints.
- [ ] Verify Wrangler deploy and R2 binding against actual Cloudflare account.
- [ ] Establish restricted server-to-R2 upload integration with verifiable ChatGPT attachment transfer; no broad API token in chat.
- [ ] Publish four WebP assets and check actual 200 responses, Content-Type and desktop/mobile layouts.


## M3.2 automatic media release — November 11, 2026

- [x] Audited develop at `b4879872`: CI and staging deployment succeeded. The live health endpoint returned 200 and the four approved routes reported missing R2 objects.
- [x] Recovered four WebP derivatives from the prepared archive. All four decoded successfully at 1500 × 844. The five original PNGs were absent from the archive and were not modified.
- [x] Verified binary transfer to GitHub using matching Git blob hashes. Staging takes the derivatives from `media/publish/` and attempts R2 publication after deployment.
- [x] Publishing commit `a99ada67`: [CI passed](https://github.com/mightymaxworks/magic-justice-lab/actions/runs/43021788038), and [staging published and verified all four R2 images](https://github.com/mightymaxworks/magic-justice-lab/actions/runs/43021788333).
- [x] Visually reviewed the live homepage hero and Innovation Labs gallery on desktop.
- [ ] Confirm the automated desktop and mobile browser checks on the staging run.
- [ ] Locate the five original PNGs for byte-for-byte preservation checks.
