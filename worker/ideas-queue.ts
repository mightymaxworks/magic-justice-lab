/// <reference types="@cloudflare/workers-types" />

import { reviewerPage } from "./ideas-reviewer";

export interface IdeasQueueEnv {
  IDEAS_TEST_QUEUE?: R2Bucket;
  IDEAS_TEST_ADMIN_TOKEN?: string;
}

const prefix = "magic-ideas-test/";
const statuses = ["received", "follow-up", "shortlisted", "closed"] as const;
type Status = (typeof statuses)[number];

interface Submission {
  id: string;
  title: string;
  description: string;
  contactEmail: string;
  verifiedEmail: boolean;
  verification?: string;
  expiresAt?: number;
  sender: string;
  status: Status;
  updatedAt: string;
}

function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

async function authorized(request: Request, token: string) {
  const supplied = request.headers.get("Authorization");
  if (!supplied?.startsWith("Bearer ") || supplied.length > 512) return false;

  const encoder = new TextEncoder();
  const [left, right] = await Promise.all(
    [supplied.slice(7), token].map(value => crypto.subtle.digest("SHA-256", encoder.encode(value))),
  );
  const subtle = crypto.subtle as SubtleCrypto & { timingSafeEqual(a: ArrayBuffer, b: ArrayBuffer): boolean };
  return subtle.timingSafeEqual(left, right);
}

export async function handleIdeasQueue(request: Request, env: IdeasQueueEnv) {
  const bucket = env.IDEAS_TEST_QUEUE;
  const token = env.IDEAS_TEST_ADMIN_TOKEN;
  if (!bucket || !token || token.length < 32) return json({ error: "Not found" }, 404);
  const url = new URL(request.url);
  if (url.pathname === "/api/ideas/test-queue/reviewer" && request.method === "GET") {
    return new Response(reviewerPage, { headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "Content-Security-Policy": "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; connect-src 'self'; frame-ancestors 'none'; form-action 'none'",
    } });
  }
  if (!(await authorized(request, token))) return json({ error: "Unauthorized" }, 401);

  const parts = url.pathname.split("/");
  const id = parts[4];

  if (url.pathname === "/api/ideas/test-queue" && request.method === "GET") {
    const page = await bucket.list({ prefix, limit: 25, cursor: url.searchParams.get("cursor") ?? undefined });
    const submissions = await Promise.all(page.objects.map(async object => {
      const stored = await bucket.get(object.key);
      if (!stored) return null;
      const entry = await stored.json<Submission>();
      return entry.verifiedEmail ? { ...entry, version: stored.httpEtag } : null;
    }));
    return json({ submissions: submissions.filter(Boolean), cursor: page.truncated ? page.cursor : null });
  }

  const fixturePath = "/api/ideas/test-queue/fixture";
  const intakePath = "/api/ideas/test-queue/submit";
  if ((url.pathname === fixturePath || url.pathname === intakePath) && request.method === "POST") {
    const verifiedEmail = url.pathname === fixturePath;
    const fixture: Submission = {
      id: crypto.randomUUID(),
      title: "Fictional example: clearer guidance for tournament appeals",
      description: "A synthetic submission for testing the MAGIC Ideas review workflow.",
      contactEmail: "contributor@example.org",
      verifiedEmail,
      sender: "magic-ideas@example.org",
      status: "received",
      updatedAt: new Date().toISOString(),
      ...(!verifiedEmail && { verification: crypto.randomUUID(), expiresAt: Date.now() + 15 * 60_000 }),
    };
    const stored = await bucket.put(prefix + fixture.id, JSON.stringify(fixture), {
      httpMetadata: { contentType: "application/json" },
    });
    return json({ ...fixture, version: stored.httpEtag }, 201);
  }

  if (parts.length === 6 && parts[5] === "verify" && /^[0-9a-f-]{36}$/.test(id ?? "") && request.method === "POST") {
    const key = prefix + id;
    const stored = await bucket.get(key);
    if (!stored) return json({ error: "Not found" }, 404);
    const entry = await stored.json<Submission>();
    if (entry.verifiedEmail) return json({ error: "This link has already been used" }, 409);
    if (!entry.expiresAt || entry.expiresAt <= Date.now() || request.headers.get("X-Test-Verification") !== entry.verification) {
      return json({ error: "Invalid or expired verification" }, 400);
    }
    delete entry.verification;
    delete entry.expiresAt;
    entry.verifiedEmail = true;
    entry.updatedAt = new Date().toISOString();
    const result = await bucket.put(key, JSON.stringify(entry), { onlyIf: { etagMatches: stored.etag } });
    if (!result) return json({ error: "This link has already been used" }, 409);
    return json({ ...entry, version: result.httpEtag });
  }

  if (parts.length === 6 && parts[5] === "status" && /^[0-9a-f-]{36}$/.test(id ?? "") && request.method === "PUT") {
    const status = url.searchParams.get("value");
    const version = request.headers.get("If-Match");
    if (!statuses.includes(status as Status) || !version) return json({ error: "Status and version are required" }, 400);

    const key = prefix + id;
    const stored = await bucket.get(key);
    if (!stored) return json({ error: "Not found" }, 404);
    if (stored.httpEtag !== version) return json({ error: "Refresh the submission and retry" }, 412);

    const entry = await stored.json<Submission>();
    if (!entry.verifiedEmail) return json({ error: "Not found" }, 404);
    const updated = { ...entry, status: status as Status, updatedAt: new Date().toISOString() };
    const result = await bucket.put(key, JSON.stringify(updated), { onlyIf: { etagMatches: stored.etag } });
    if (!result) return json({ error: "Refresh the submission and retry" }, 412);
    return json({ ...updated, version: result.httpEtag });
  }

  return json({ error: "Not found" }, 404);
}
