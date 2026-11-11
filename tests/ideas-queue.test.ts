import { timingSafeEqual, webcrypto } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { handleIdeasQueue } from "../worker/ideas-queue";

const token = "a-test-only-token-with-more-than-32-characters";
const base = "https://lab.example.org/api/ideas/test-queue";

function queue() {
  const records = new Map<string, { value: string; etag: string }>();
  const bucket = {
    list: async () => ({ objects: [...records.keys()].map(key => ({ key })), truncated: false }),
    get: async (key: string) => {
      const record = records.get(key);
      return record && { ...record, httpEtag: `"${record.etag}"`, json: async () => JSON.parse(record.value) };
    },
    put: async (key: string, value: string, options?: { onlyIf?: { etagMatches: string } }) => {
      if (options?.onlyIf && records.get(key)?.etag !== options.onlyIf.etagMatches) return null;
      const etag = String(records.size) + "-" + value.length;
      records.set(key, { value, etag });
      return { httpEtag: `"${etag}"` };
    },
  };
  return { IDEAS_TEST_QUEUE: bucket as unknown as R2Bucket, IDEAS_TEST_ADMIN_TOKEN: token };
}

describe("synthetic MAGIC Ideas review queue", () => {
  beforeEach(() => vi.stubGlobal("crypto", {
    randomUUID: webcrypto.randomUUID.bind(webcrypto),
    subtle: {
      digest: webcrypto.subtle.digest.bind(webcrypto.subtle),
      timingSafeEqual: (a: ArrayBuffer, b: ArrayBuffer) => timingSafeEqual(Buffer.from(a), Buffer.from(b)),
    },
  }));
  afterEach(() => vi.unstubAllGlobals());

  it("hides an unconfigured queue and rejects requests without the admin token", async () => {
    expect((await handleIdeasQueue(new Request(base), {})).status).toBe(404);
    expect((await handleIdeasQueue(new Request(base), queue())).status).toBe(401);
  });

  it("creates only a synthetic fixture, lists it, and protects concurrent status changes", async () => {
    const env = queue();
    const headers = { Authorization: `Bearer ${token}` };
    const created = await handleIdeasQueue(new Request(base + "/fixture", {
      method: "POST", headers, body: JSON.stringify({ contactEmail: "ignored@invalid.test" }),
    }), env);
    expect(created.status).toBe(201);
    const fixture = await created.json<{ id: string; version: string }>();
    expect(fixture).toMatchObject({ contactEmail: "contributor@example.org", verifiedEmail: true, sender: "magic-ideas@example.org", status: "received" });
    const listed = await handleIdeasQueue(new Request(base, { headers }), env);
    expect((await listed.json<{ submissions: unknown[] }>()).submissions).toEqual([fixture]);
    expect(listed.headers.get("Cache-Control")).toBe("no-store");

    const update = () => handleIdeasQueue(new Request(base + "/" + fixture.id + "/status?value=shortlisted", {
      method: "PUT", headers: { ...headers, "If-Match": fixture.version },
    }), env);
    expect(await (await update()).json()).toMatchObject({ status: "shortlisted" });
    expect((await update()).status).toBe(412);
  });
});
