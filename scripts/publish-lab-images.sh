#!/usr/bin/env bash
set -euo pipefail

bucket="${R2_BUCKET:-magic-lab-assets}"
prefix="${R2_PREFIX:-published/magic-justice-lab}"
root="${1:-media/publish}"
public_base="${PUBLIC_IMAGE_BASE:-https://magic-justice-lab.mightymaxworks.workers.dev/images}"
shift "$(( $# > 0 ))"
if (( $# > 0 )); then
  files=("$@")
else
  files=(hero-magic-lab.webp gallery-collaboration.webp gallery-heritage.webp gallery-technology.webp)
fi

download_dir="$(mktemp -d)"
trap 'rm -rf -- "$download_dir"' EXIT

probe() {
  curl --silent --show-error --retry 3 --max-time 30 \
    --output "$download_dir/$1" --write-out '%{http_code} %{content_type}' \
    "${public_base%/}/$1"
}

missing=()
for name in "${files[@]}"; do
  [[ "$name" =~ ^[a-z0-9][a-z0-9-]*\.webp$ ]] || { echo "Invalid filename: $name" >&2; exit 1; }
  file="$root/$name"
  [[ -f "$file" && "$(file --mime-type -b "$file")" == image/webp ]] || { echo "Missing or invalid WebP: $file" >&2; exit 1; }
  if (( $(wc -c < "$file") > 2097152 )); then
    echo "Image exceeds 2 MiB: $file" >&2
    exit 1
  fi
  result="$(probe "$name")"
  case "$result" in
    '200 image/webp')
      cmp -s "$file" "$download_dir/$name" || { echo "Published image differs: $name" >&2; exit 1; }
      ;;
    '404 '*)
      [[ "$(cat "$download_dir/$name")" == 'Image not yet published' ]] || { echo "Unexpected 404 for $name" >&2; exit 1; }
      missing+=("$name")
      ;;
    *)
      echo "Unexpected image response for $name: $result" >&2
      exit 1
      ;;
  esac
done

for name in "${missing[@]}"; do
  echo "Publishing $name"
  npx --no-install wrangler r2 object put "$bucket/$prefix/$name" \
    --file="$root/$name" --content-type=image/webp --remote
done

for name in "${files[@]}"; do
  [[ "$(probe "$name")" == '200 image/webp' ]] &&
    cmp -s "$root/$name" "$download_dir/$name" || { echo "Live verification failed: $name" >&2; exit 1; }
  echo "Verified $name (HTTP 200, image/webp, matching bytes)"
done
