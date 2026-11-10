import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";

const files = ["index.html", "src/main.tsx", "README.md", "docs/DEPLOYMENT.md"];
describe("JusTICe institutional branding", () => {
  it("does not visually uppercase institutional labels", () => {
    const css = readFileSync("src/style.css", "utf8");
    expect(css).toMatch(/\.brand-parent,\.eyebrow\s*\{\s*text-transform:\s*none\s*\}/);
  });
  for (const file of files) {
    it(file + " uses the correct spelling in institutional references", () => {
      const content = readFileSync(file, "utf8");
      expect(content).not.toMatch(/\bJUSTICE\b|\bJustiCe\b|\bJusTice\b|\bJustICe\b/);
      expect(content).toContain("JusTICe");
    });
  }
});