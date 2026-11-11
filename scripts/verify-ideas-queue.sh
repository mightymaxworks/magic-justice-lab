#!/usr/bin/env bash
set -euo pipefail

test_dir="$(mktemp -d)"
test_token="$(openssl rand -hex 32)"
port=8791
base="http://127.0.0.1:$port/api/ideas/test-queue"

npx --no-install wrangler dev --env ideas-test --ip 127.0.0.1 --port "$port" \
  --persist-to "$test_dir/data" --var "IDEAS_TEST_ADMIN_TOKEN:$test_token" >"$test_dir/worker.log" 2>&1 &
worker_pid=$!
trap 'kill "$worker_pid" 2>/dev/null || true; rm -rf "$test_dir"' EXIT

for attempt in $(seq 1 40); do
  if curl -fsS --max-time 2 "http://127.0.0.1:$port/api/health" >/dev/null 2>&1; then break; fi
  if ! kill -0 "$worker_pid" 2>/dev/null || [[ "$attempt" == 40 ]]; then
    sed '/IDEAS_TEST_ADMIN_TOKEN/d' "$test_dir/worker.log" >&2
    exit 1
  fi
  sleep 1
done

auth=(-H "Authorization: Bearer $test_token")
[[ "$(curl -sS -o /dev/null -w '%{http_code}' "$base")" == 401 ]]
pending="$(curl -fsS "${auth[@]}" -X POST "$base/submit")"
id="$(jq -er .id <<<"$pending")"
verification="$(jq -er .verification <<<"$pending")"
curl -fsS "${auth[@]}" "$base" | jq -e '.submissions == []' >/dev/null
[[ "$(curl -sS -o /dev/null -w '%{http_code}' "${auth[@]}" -X POST "$base/$id/verify")" == 400 ]]
verified="$(curl -fsS "${auth[@]}" -H "X-Test-Verification: $verification" -X POST "$base/$id/verify")"
version="$(jq -er .version <<<"$verified")"
[[ "$(curl -sS -o /dev/null -w '%{http_code}' "${auth[@]}" -H "X-Test-Verification: $verification" -X POST "$base/$id/verify")" == 409 ]]
curl -fsS "${auth[@]}" -H "If-Match: $version" -X PUT "$base/$id/status?value=shortlisted" |
  jq -e '.status == "shortlisted" and .verifiedEmail == true' >/dev/null
curl -fsS "${auth[@]}" "$base" |
  jq -e '.submissions | length == 1 and .[0].status == "shortlisted"' >/dev/null
echo "Synthetic intake, verification, private queue and status updates passed against local R2."
