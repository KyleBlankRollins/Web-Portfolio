import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  loadSiteSource,
  renderSite,
  type LoadedSiteSource,
  type SiteAssets,
} from "./site-renderer.js";
import { normalizeDom } from "./test-support/normalized-dom.js";

const source: LoadedSiteSource = {
  pages: new Map([["fixture.html", "<p>Fixture page</p>"]]),
  templates: new Map([
    [
      "base.html",
      "<!doctype html><html><head>{{{head}}}</head><body>{{{content}}}{{{footer}}}</body></html>",
    ],
  ]),
  partials: new Map([
    ["head.html", "<title>{{title}}</title>"],
    ["header.html", "<header>Header</header>"],
    ["footer.html", "<footer>Footer</footer>"],
  ]),
};

const assets: SiteAssets = {
  head: [{ kind: "stylesheet", href: "/assets/site.css" }],
  body: [{ kind: "module", src: "/assets/site.js" }],
};

describe("renderSite", () => {
  it("renders deterministic output from in-memory inputs without filesystem access", () => {
    const content = [
      {
        outputPath: "fixture.html",
        content: "<p>Rendered content</p>",
        metadata: { title: "Fixture" },
      },
    ];

    const first = renderSite(source, content, assets);
    const second = renderSite(source, content, assets);

    expect(first).toEqual(second);
    expect(first.outputs.get("fixture.html")).toContain(
      '<link rel="stylesheet" crossorigin href="/assets/site.css">'
    );
    expect(first.outputs.get("fixture.html")).toContain(
      '<script type="module" crossorigin src="/assets/site.js"></script>'
    );
  });

  it("produces equivalent DOM for development and production modes", () => {
    const content = [
      {
        outputPath: "nested/supplement.html",
        content: "<main><h1>Supplement</h1></main>",
        metadata: { title: "Supplement" },
      },
    ];

    const development = renderSite(source, content, assets);
    const production = renderSite(source, content, assets);

    expect(
      normalizeDom(development.outputs.get("nested/supplement.html") ?? "")
    ).toEqual(
      normalizeDom(production.outputs.get("nested/supplement.html") ?? "")
    );
  });
});

describe("loadSiteSource", () => {
  let temporarySiteRoot: string;

  afterEach(() => {
    if (temporarySiteRoot) {
      rmSync(temporarySiteRoot, { recursive: true, force: true });
    }
  });

  it("loads pages, root index, templates, and partials", () => {
    temporarySiteRoot = mkdtempSync(join(process.cwd(), "tmp-site-source-"));
    mkdirSync(join(temporarySiteRoot, "pages", "nested"), {
      recursive: true,
    });
    mkdirSync(join(temporarySiteRoot, "templates", "partials"), {
      recursive: true,
    });

    writeFileSync(join(temporarySiteRoot, "index.html"), "<!-- root page -->");
    writeFileSync(
      join(temporarySiteRoot, "pages", "about.html"),
      "<!-- about page -->"
    );
    writeFileSync(
      join(temporarySiteRoot, "pages", "nested", "contact.html"),
      "<!-- contact page -->"
    );
    writeFileSync(
      join(temporarySiteRoot, "templates", "base.html"),
      "<!-- base template -->"
    );
    writeFileSync(
      join(temporarySiteRoot, "templates", "partials", "head.html"),
      "<!-- head partial -->"
    );
    const loaded = loadSiteSource(temporarySiteRoot);

    expect(loaded.pages).toEqual(
      new Map([
        ["about.html", "<!-- about page -->"],
        ["nested/contact.html", "<!-- contact page -->"],
        ["index.html", "<!-- root page -->"],
      ])
    );
    expect(loaded.templates.get("base.html")).toBe("<!-- base template -->");
    expect(loaded.partials.get("head.html")).toBe("<!-- head partial -->");
  });
});
