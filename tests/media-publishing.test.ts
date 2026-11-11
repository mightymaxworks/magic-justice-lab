import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const worker = readFileSync("worker/index.ts", "utf8");
const config = readFileSync("wrangler.toml", "utf8");
const publisher = readFileSync("scripts/publish-lab-images.sh", "utf8");

describe("R2 image publishing safety", () => {
  it("binds the correct bucket", () => {
    expect(config).toContain('binding = "LAB_ASSETS"');
    expect(config).toContain('bucket_name = "magic-lab-assets"');
  });
  it("allows only approved public images and read-only requests", () => {
    expect(worker).toContain("approvedImages.has(file)");
    expect(worker).toContain('request.method !== "GET" && request.method !== "HEAD"');
    expect(worker).toContain("published/magic-justice-lab/");
    expect(worker).not.toContain("LAB_ASSETS.put(");
  });
  it("requires remote WebP validation before upload", () => {
    expect(publisher).toContain("image/webp");
    expect(publisher).toContain("--remote");
    expect(publisher).toContain("2097152");
  });
});
