import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { afterEach, describe, expect, it } from "vitest";
import { MarkdownRenderer } from "./modules/markdown-renderer.js";
import { ContentDiscovery } from "./modules/content-discovery.js";
import { FrontmatterParser } from "./modules/frontmatter-parser.js";
import { HtmlAstRenderer } from "./modules/html-ast-renderer.js";
import { ThemeProcessor } from "./theme-processor.js";
import { normalizeDom } from "./test-support/normalized-dom.js";

const temporaryDirectories: string[] = [];

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    rmSync(directory, { recursive: true, force: true });
  }
});

describe("Phase 0 characterization", () => {
  it("preserves static page metadata and page content", () => {
    const result = new HtmlAstRenderer().render(
      `<template data-kbr-page data-layout="base.html">
  <meta name="title" content="About">
  <meta name="description" content="A page description.">
  <meta name="keywords" content="about, portfolio">
</template>
<main><h1>About</h1></main>`,
      {}
    );

    expect(result.metadata).toEqual({
      title: "About",
      description: "A page description.",
      keywords: "about, portfolio",
      layout: "base.html",
    });
    expect(normalizeDom(result.html)).toEqual(
      normalizeDom("<main><h1>About</h1></main>")
    );
  });

  it("preserves Markdown tags, series part zero, citations, and literal expressions", () => {
    const markdown = `+++
title = "Characterization post"
description = "Description"
date = "2025-01-01"
tags = ["testing", "rendering"]
[series]
name = "Renderer migration"
part = 0
[[citations]]
id = "source-1"
title = "A source"
author = "An author"
+++
Literal {{ value }} text with a citation[^source-1].`;
    const parser = new FrontmatterParser("draft");
    const parsed = parser.parse(markdown);
    const rendered = new MarkdownRenderer().render(parsed.content);

    expect(parsed.metadata).toMatchObject({
      tags: ["testing", "rendering"],
      series: { name: "Renderer migration", part: 0 },
      citations: [{ id: "source-1", title: "A source", author: "An author" }],
    });
    expect(rendered).toContain("{{ value }}");
    expect(rendered).toContain("citation");
  });

  it("preserves nested supplement discovery and public URLs", () => {
    const root = mkdtempSync(join(tmpdir(), "kbr-phase-0-"));
    temporaryDirectories.push(root);
    const parentPath = join(root, "guide", "guide.md");
    const supplementPath = join(
      root,
      "guide",
      "supplements",
      "nested",
      "example.md"
    );
    mkdirSync(join(supplementPath, ".."), { recursive: true });
    writeFileSync(
      parentPath,
      '+++\ntitle = "Guide"\ndescription = "Description"\ndate = "2025-01-01"\ntags = []\n+++\nBody\n'
    );
    writeFileSync(
      supplementPath,
      '+++\ntitle = "Example"\ndescription = "Description"\ndate = "2025-01-01"\npublished = true\n+++\nBody\n'
    );

    const result = new ContentDiscovery(root).discover();

    expect(result.publishedSupplements).toHaveLength(1);
    expect(result.publishedSupplements[0]).toMatchObject({
      parentUrl: "/guide.html",
      publicUrl: "/guide/supplements/nested/example.html",
    });
  });

  it("emits the current theme manifest shape", () => {
    const themes = new ThemeProcessor(
      join(process.cwd(), "source/site/styles/themes")
    );
    themes.processThemes();
    const manifest = JSON.parse(themes.generateThemeManifestJson());

    expect(manifest).toMatchObject({ totalThemes: 2 });
    expect(manifest.themes.map((theme: { id: string }) => theme.id)).toEqual([
      "base",
      "canney-valley",
    ]);
    expect(manifest.themes[0]).toHaveProperty("metadata");
    expect(manifest).not.toHaveProperty("generatedAt");
  });

  it("ignores serializer whitespace and attribute order only", () => {
    const original =
      '<section class="content" data-id="1"><p>Hello</p></section>';
    const formattingOnly = `\n<section data-id="1" class="content">
  <p>Hello</p>
</section>\n`;

    expect(normalizeDom(original)).toEqual(normalizeDom(formattingOnly));
    expect(normalizeDom(original)).not.toEqual(
      normalizeDom(
        '<section class="content" data-id="2"><p>Hello</p></section>'
      )
    );
    expect(normalizeDom(original)).not.toEqual(
      normalizeDom(
        '<section class="content" data-id="1"><p>Goodbye</p></section>'
      )
    );
    expect(normalizeDom(original)).not.toEqual(
      normalizeDom(
        '<article class="content" data-id="1"><p>Hello</p></article>'
      )
    );
  });
});
