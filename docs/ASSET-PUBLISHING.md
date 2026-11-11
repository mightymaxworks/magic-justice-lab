# MAGIC JusTICe Lab media publishing

## Status
Cloudflare R2 bucket `magic-lab-assets` and Worker binding `LAB_ASSETS` confirmed in dashboard by the project owner. Website image routes and allowlist have been implemented. **Binary image upload is not yet complete**.

## Asset policy
- Keep the five supplied PNG artist impressions unchanged as masters, outside the public bucket.
- Publish only approved, optimized WebP derivatives.
- Public delivery is GET/HEAD-only via `/images/<approved filename>`.
- R2 keys are under `published/magic-justice-lab/`.
- No public upload API, no shared account-wide credentials, no secrets in GitHub.

## Current four approved paths
- `hero-magic-lab.webp`
- `gallery-collaboration.webp`
- `gallery-heritage.webp`
- `gallery-technology.webp`

## Operator publishing procedure (temporary fallback)
The prepared ZIP contains `public/images/<filename>` for all four. From an authenticated deployment environment, unzip into the repository and run `bash scripts/publish-lab-images.sh`. This requires authenticated Wrangler and access to the four binary files. The script checks file presence, WebP MIME type and a 2 MB per-file limit before uploading to R2. This is a fallback, **not yet ChatGPT autonomous binary transfer**.

## Long-term transfer integration
Build a restricted media-publishing service with:
1. Cloudflare Access-protected ingestion (verify JWT issuer, audience, signature, expiry).
2. Short-lived upload intent, strict image allowlist, content verification, maximum size and integrity hash.
3. Private original storage, explicit approval before public derivative publication.
4. Audit logs, revocation, deduplication and rollback.
5. An actual supported ChatGPT-connected binary transfer mechanism; validate end-to-end before declaring autonomous upload.

Do not publish credentials in chat or source. Do not claim the images are live until all four URLs return HTTP 200 and `image/webp` and have been reviewed in a browser.
