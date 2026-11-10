import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
const files = ["index.html", "src/main.tsx", "README.md", "docs/DEPLOYMENT.md"];
describe("institutional branding", () => {
  for (const file of files) {
    it(file + " avoids incorrect institutional capitalization", () => {
      const content = readFileSync(file, "utf8");
      expect(content).not.toMatch(/\bJUSTICE\b|\bJustiCe\b|\bJusTice\b|\bJustICe\b|\bJusTICe?e\b/);
    });
  }
});