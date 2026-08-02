import { describe, expect, it } from "vitest";
import { TemplateEngine } from "./template-engine.js";

describe("TemplateEngine", () => {
  const engine = new TemplateEngine();

  it("escapes double-brace variables", () => {
    expect(engine.render("{{value}}", { value: "<strong>safe</strong>" })).toBe(
      "&lt;strong&gt;safe&lt;/strong&gt;"
    );
  });

  it("leaves triple-brace variables unescaped", () => {
    expect(
      engine.render("{{{value}}}", { value: "<strong>raw</strong>" })
    ).toBe("<strong>raw</strong>");
  });

  it("keeps truthy and strips empty conditional sections", () => {
    expect(
      engine.render("{{#name}}Hello {{name}}{{/name}}", { name: "Ada" })
    ).toBe("Hello Ada");
    expect(engine.render("A{{#name}}hidden{{/name}}B", { name: "" })).toBe(
      "AB"
    );
  });

  it("resolves nested dot notation", () => {
    expect(
      engine.render("{{series.name}} / {{series.part}}", {
        series: { name: "Foundations", part: 2 },
      })
    ).toBe("Foundations / 2");
  });

  it("removes unmatched variables", () => {
    expect(engine.render("before {{foo}} after", {})).toBe("before  after");
  });

  it("preserves literal template syntax in injected content", () => {
    const content = "{{title}} {{{raw}}} {{#cond}}x{{/cond}}";

    expect(engine.render("{{{content}}} | {{missing}}", { content })).toBe(
      `${content} | `
    );
  });

  it("recognizes complete HTML documents", () => {
    expect(engine.isCompleteHtmlDocument("<!doctype html><html></html>")).toBe(
      true
    );
    expect(engine.isCompleteHtmlDocument("<main>Partial</main>")).toBe(false);
  });

  it("removes null variables", () => {
    expect(engine.render("A{{value}}B", { value: null })).toBe("AB");
  });
});
