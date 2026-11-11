# MAGIC JusTICe Lab media publishing

## Status
Staging deployment runs the R2 publisher after deploying the Worker. See the
GitHub Actions run for the deployed commit and the milestone tracker for live verification.

## Asset policy
- Keep the five supplied PNG artist impressions unchanged as masters, outside the public bucket.
- Publish only approved, optimized WebP derivatives.
- Public delivery is GET/HEAD-only via `/images/<approved filename>`.
- R2 keys are under `published/magic-justice-lab/`.
- No public upload API, no shared account-wide credentials, no credentials in repository files.

## Current four approved paths
- `hero-magic-lab.webp`
- `gallery-collaboration.webp`
- `gallery-heritage.webp`
- `gallery-technology.webp`

## Publish from ChatGPT through GitHub Actions

1. Make the approved WebPs available to ChatGPT. Keep the source PNGs private.
2. Validate the four derivatives and place them in `media/publish/` using Git
   binary blobs. Verify each returned blob SHA matches the local Git object hash.
3. Push the commit to `develop`. Deploy staging uses the existing staging
   environment secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.
   The token needs permission to write objects to R2. Keep it in GitHub Actions
   secrets. If a run fails, rerun Deploy staging from `develop` after fixing it.
4. Check the publish step. It requires HTTP 200, `image/webp`, and a byte-for-byte
   match for every public URL. Review the hero and gallery at desktop and mobile widths.

The workflow serializes staging deployments and publishing. The publisher skips
identical images, stops if a public object differs and uploads only when the
Worker confirms the approved key is missing. Publish revisions under new names
and update the Worker allowlist and site references together.

## Reuse for OurOwn projects

Copy the publishing script and staging workflow step. Set `R2_BUCKET`,
`R2_PREFIX` and `PUBLIC_IMAGE_BASE` for the project and pass the approved WebP
filenames after the input directory. The public route must return
`404 Image not yet published` for a missing allowlisted object, and serve
the exact R2 bytes with `Content-Type: image/webp` when present. Configure a
project-specific Actions environment and Cloudflare credential with only the
required permissions. Keep the input directory outside the website build.
