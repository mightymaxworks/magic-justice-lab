#!/usr/bin/env bash
set -euo pipefail
# Run from repository root. Requires authenticated Wrangler access.
BUCKET="${R2_BUCKET:-magic-lab-assets}"
ROOT="${1:-public/images}"
FILES=(hero-magic-lab.webp gallery-collaboration.webp gallery-heritage.webp gallery-technology.webp)
for name in "${FILES[@]}"; do
  file="${ROOT}/${name}"
  if [[ ! -f "$file" ]]; then echo "Missing $file" >&2; exit 1; fi
  mime="$(file --mime-type -b "$file")"
  if [[ "$mime" != "image/webp" ]]; then echo "Invalid MIME for $file: $mime" >&2; exit 1; fi
  size="$(wc -c < "$file" | tr -d ' ')"
  if (( size > 2097152 )); then echo "File exceeds 2MB: $file" >&2; exit 1; fi
  echo "Uploading $name ($size bytes)"
  npx wrangler r2 object put "${BUCKET}/published/magic-justice-lab/${name}" --file="$file" --content-type=image/webp --remote
done
echo "Upload completed; verify the live URLs and cache before declaring release."
