import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const app = readFileSync("src/main.tsx", "utf8");
const css = readFileSync("src/style.css", "utf8");

describe("M3.1 public site release guards", () => {
  it("includes all eight public routes", () => {
    for (const route of ["home", "purpose", "labs", "projects", "challenges", "ideas", "insights", "collaborate"]) {
      expect(app).toContain('"' + route + '"');
    }
  });
  it("keeps MAGIC Ideas closed until safeguards are implemented", () => {
    expect(app).toContain("Submissions not yet open");
    expect(app).toContain("No personal information is being collected");
    expect(app).not.toMatch(/<form\b|<input\b|<textarea\b/);
  });
  it("supports accessible navigation and responsive layouts", () => {
    expect(app).toContain('aria-label="Main navigation"');
    expect(app).toContain('aria-expanded={menuOpen}');
    expect(app).toContain('className="skip-link"');
    expect(css).toContain("@media(max-width:1050px)");
    expect(css).toContain("@media(prefers-reduced-motion:reduce)");
  });
  it("distinguishes proposed initiatives from operational services", () => {
    expect(app).toContain("not a court, regulator or provider of legal advice");
    expect(app).toContain("No challenge is currently open for public submissions");
  });
});
