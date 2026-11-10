import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";

const files = ["index.html", "src/main.tsx", "README.md", "docs/DEPLOYMENT.md"];
describe("JusTICe institutional branding", () => {
  it("does not visually uppercase institutional labels", () => {
    const css = readFileSync("src/style.css", "utf8");
    expect(css).toMatch(/\.brand-parent,\.eyebrow\s*\{\s*text-transform:\s*none\s*\}/);
  });
  it("uses the same visible wordmark for every institutional reference", () => {
    const markup = readFileSync("src/main.tsx", "utf8");
    const visible = markup.match(/<span className="justice-mark">JusTICe<\/span>/g) ?? [];
    expect(visible).toHaveLength(4);
    const css = readFileSync("src/style.css", "utf8");
    expect(css).toMatch(/\.justice-mark\s*\{[^}]*letter-spacing:normal!important;[^}]*text-transform:none!important;/);
  });
  for (const file of files) {
    it(file + " uses the correct spelling in institutional references", () => {
      const content = readFileSync(file, "utf8");
      expect(content).not.toMatch(/\bJUSTICE\b|\bJustiCe\b|\bJusTice\b|\bJustICe\b/);
      expect(content).toContain("JusTICe");
    });
  }
});