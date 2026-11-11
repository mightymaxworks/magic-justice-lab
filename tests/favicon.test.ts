import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
const html = readFileSync("index.html", "utf8");
const icon = readFileSync("public/favicon.svg", "utf8");
describe("favicon branding", () => {
  it("links the favicon from the document head", () => {
    expect(html).toContain('<link rel="icon" type="image/svg+xml" href="/favicon.svg"/>');
  });
  it("provides a self-contained accessible SVG asset", () => {
    expect(icon).toContain('viewBox="0 0 64 64"');
    expect(icon).toContain("<title>MAGIC JusTICe Lab</title>");
    expect(icon).toContain("#0b1330");
    expect(icon).toContain("#d8b879");
    expect(icon).not.toContain("<script");
  });
});
