# Deployment and release gates

## Staging

1. Create a Cloudflare API token scoped to Workers Scripts Edit and account resources as required.
2. In GitHub, configure the `staging` environment with `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` as environment secrets.
3. Run the staging workflow from the `develop` branch. The workflow runs lint, typecheck, tests and build before deployment.
4. Verify the staging `workers.dev` URL and `/api/health` response.

## Production

The production workflow is manual and must be protected by a GitHub environment with required reviewers. Never share staging secrets with production. Do not enable public idea submissions until D1, consent, Turnstile, moderation and audit controls have been verified.

## Branch protection

Protect `main`: require pull requests and passing CI checks, restrict force pushes, and require approval before merge. Do not mark complete until GitHub confirms the rules are active.

## Institutional content

Do not publish internal JusTICe strategy documents or unapproved institutional claims. Keep the public website isolated from confidential justice-sector systems and OurOwn compute nodes.
