export interface Env { ASSETS: Fetcher; LAB_ASSETS: R2Bucket }

const approvedImages = new Set([
  "hero-magic-lab.webp",
  "gallery-collaboration.webp",
  "gallery-heritage.webp",
  "gallery-technology.webp",
]);

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === "/api/health") {
      return Response.json({ status: "ok", service: "magic-justice-lab" }, { headers: { "Cache-Control": "no-store" } });
    }
    if (url.pathname.startsWith("/images/")) {
      if (request.method !== "GET" && request.method !== "HEAD") {
        return new Response("Method not allowed", { status: 405, headers: { Allow: "GET, HEAD" } });
      }
      const file = url.pathname.slice("/images/".length);
      if (!approvedImages.has(file)) return new Response("Not found", { status: 404 });
      const object = await env.LAB_ASSETS.get("published/magic-justice-lab/" + file);
      if (!object) return new Response("Image not yet published", { status: 404, headers: { "Cache-Control": "no-store" } });
      const headers = new Headers({
        "Content-Type": "image/webp",
        "Cache-Control": "public, max-age=300",
        "X-Content-Type-Options": "nosniff",
      });
      if (object.httpEtag) headers.set("ETag", object.httpEtag);
      return new Response(request.method === "HEAD" ? null : object.body, { headers });
    }
    if (url.pathname.startsWith("/api/")) {
      return Response.json({ error: "Not found" }, { status: 404, headers: { "Cache-Control": "no-store" } });
    }
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
