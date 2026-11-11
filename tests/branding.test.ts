import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";

const source = readFileSync("src/main.tsx", "utf8");
const html = readFileSync("index.html", "utf8");
const css = readFileSync("src/style.css", "utf8");
const readme = readFileSync("README.md", "utf8");

describe("MAGIC JusTICe Lab brand identity", () => {
  it("uses the official name in page title, description and README", () => {
    expect(html).toContain("<title>MAGIC JusTICe Lab");
    expect(html).toContain('content="MAGIC JusTICe Lab:');
    expect(readme).toContain("# MAGIC JusTICe Lab");
  });
  it("uses the shared wordmark in header and footer", () => {
    expect(source).toContain('aria-label="MAGIC JusTICe Lab"');
    expect(source).toContain('MAGIC <span className="justice-mark">JusTICe</span> Lab');
    expect((source.match(/MAGIC <span className="justice-mark">JusTICe<\/span> Lab/g) ?? []).length).toBeGreaterThanOrEqual(2);
    expect(source).toContain('className="footer-secondary"');
  });
  it("does not retain the previous lab name or incorrect capitalization", () => {
    for (const text of [source, html, readme]) {
      expect(text).not.toContain("MAGIC Justice Lab");
      expect(text).not.toMatch(/\bJUSTICE\b|\bJustiCe\b|\bJusTice\b|\bJustICe\b/);
    }
  });
  it("does not force uppercase or block formatting on the institutional wordmark", () => {
    expect(css).toMatch(/\.justice-mark\s*\{[^}]*text-transform:none!important;/);
    expect(css).toContain("footer .justice-mark{display:inline;margin:0}");
    expect(css).toContain("footer .footer-secondary{display:block;margin-top:8px}");
    expect(css).toContain(".brand{white-space:nowrap;");
  });
});
