import { pageForPath, pages, wpuImage } from "../src/pages";

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
    if (url.pathname === "/robots.txt") {
      return new Response(`User-agent: *\nAllow: /\nSitemap: ${url.origin}/sitemap.xml\n`, {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }
    if (url.pathname === "/sitemap.xml") {
      const links = [pages.home, pages.purpose, pages.labs, pages.projects, pages.wpu].map(page =>
        `<url><loc>${url.origin}${page.path}</loc></url>`
      );
      return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${links.join("")}</urlset>`, {
        headers: { "Content-Type": "application/xml; charset=utf-8" },
      });
    }
    const pageKey = pageForPath(url.pathname);
    if (!pageKey || (request.method !== "GET" && request.method !== "HEAD")) {
      return env.ASSETS.fetch(request);
    }

    const page = pages[pageKey];
    const canonical = url.origin + page.path;
    const preview = pageKey === "wpu" || pageKey === "projects"
      ? wpuImage
      : { path: "/images/hero-magic-lab.webp", width: 1500, height: 844, alt: "Artist impression of the proposed MAGIC JusTICe Lab interior in Bhutan." };
    const image = url.origin + preview.path;
    const html = await env.ASSETS.fetch(new Request(new URL("/", url), request));
    return new HTMLRewriter()
      .on("title", { element: el => el.setInnerContent(page.title) })
      .on('link[rel="canonical"]', { element: el => el.setAttribute("href", canonical) })
      .on('meta[name="description"]', { element: el => el.setAttribute("content", page.description) })
      .on('meta[property="og:description"]', { element: el => el.setAttribute("content", page.description) })
      .on('meta[property="og:title"]', { element: el => el.setAttribute("content", page.title) })
      .on('meta[property="og:url"]', { element: el => el.setAttribute("content", canonical) })
      .on('meta[property="og:image"]', { element: el => el.setAttribute("content", image) })
      .on('meta[property="og:image:width"]', { element: el => el.setAttribute("content", String(preview.width)) })
      .on('meta[property="og:image:height"]', { element: el => el.setAttribute("content", String(preview.height)) })
      .on('meta[property="og:image:alt"]', { element: el => el.setAttribute("content", preview.alt) })
      .transform(html);
  },
} satisfies ExportedHandler<Env>;
