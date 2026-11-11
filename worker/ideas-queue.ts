/// <reference types="@cloudflare/workers-types" />

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
  verifiedEmail: true;
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
  if (!(await authorized(request, token))) return json({ error: "Unauthorized" }, 401);

  const url = new URL(request.url);
  const parts = url.pathname.split("/");
  const id = parts[4];

  if (url.pathname === "/api/ideas/test-queue" && request.method === "GET") {
    const page = await bucket.list({ prefix, limit: 25, cursor: url.searchParams.get("cursor") ?? undefined });
    const submissions = await Promise.all(page.objects.map(async object => {
      const stored = await bucket.get(object.key);
      return stored ? { ...await stored.json<Submission>(), version: stored.httpEtag } : null;
    }));
    return json({ submissions: submissions.filter(Boolean), cursor: page.truncated ? page.cursor : null });
  }

  if (url.pathname === "/api/ideas/test-queue/fixture" && request.method === "POST") {
    const fixture: Submission = {
      id: crypto.randomUUID(),
      title: "Fictional example: clearer guidance for tournament appeals",
      description: "A synthetic submission for testing the MAGIC Ideas review workflow.",
      contactEmail: "contributor@example.org",
      verifiedEmail: true,
      sender: "magic-ideas@example.org",
      status: "received",
      updatedAt: new Date().toISOString(),
    };
    const stored = await bucket.put(prefix + fixture.id, JSON.stringify(fixture), {
      httpMetadata: { contentType: "application/json" },
    });
    return json({ ...fixture, version: stored.httpEtag }, 201);
  }

  if (parts.length === 6 && parts[5] === "status" && /^[0-9a-f-]{36}$/.test(id ?? "") && request.method === "PUT") {
    const status = url.searchParams.get("value");
    const version = request.headers.get("If-Match");
    if (!statuses.includes(status as Status) || !version) return json({ error: "Status and version are required" }, 400);

    const key = prefix + id;
    const stored = await bucket.get(key);
    if (!stored) return json({ error: "Not found" }, 404);
    if (stored.httpEtag !== version) return json({ error: "Refresh the submission and retry" }, 412);

    const updated = { ...await stored.json<Submission>(), status: status as Status, updatedAt: new Date().toISOString() };
    const result = await bucket.put(key, JSON.stringify(updated), { onlyIf: { etagMatches: stored.etag } });
    if (!result) return json({ error: "Refresh the submission and retry" }, 412);
    return json({ ...updated, version: result.httpEtag });
  }

  return json({ error: "Not found" }, 404);
}
