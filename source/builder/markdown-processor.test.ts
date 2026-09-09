import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { afterEach, describe, expect, it } from "vitest";
import { MarkdownProcessor } from "./markdown-processor.js";
import type { ContentDocument } from "./modules/content-discovery.js";

const temporaryDirectories: string[] = [];

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    rmSync(directory, { recursive: true, force: true });
  }
});

function createPost(markdown: string): ContentDocument {
  const root = mkdtempSync(join(tmpdir(), "kbr-markdown-processor-"));
  temporaryDirectories.push(root);
  const sourcePath = join(root, "post.md");
  mkdirSync(root, { recursive: true });
  writeFileSync(sourcePath, markdown);
  return {
    sourcePath,
    outputPath: "post.html",
    publicUrl: "/post.html",
    kind: "standalone-post",
    metadata: { isBlogPost: true },
  };
}

describe("MarkdownProcessor title ownership", () => {
  it("keeps a post without a Markdown H1 as body-only HTML", () => {
    const processor = new MarkdownProcessor();
    processor.processContentDocument(
      createPost(
        '+++\ntitle = "Template title"\ndescription = "Description"\ndate = "2025-01-01"\ntags = []\n+++\nBody text.\n'
      )
    );

    expect(processor.getGeneratedFiles().get("post.html")?.content).toBe(
      "<p>Body text.</p>\n"
    );
  });

  it("rejects a post whose Markdown begins with an H1", () => {
    const processor = new MarkdownProcessor();
    const post = createPost(
      '+++\ntitle = "Template title"\ndescription = "Description"\ndate = "2025-01-01"\ntags = []\n+++\n# Duplicate title\n'
    );

    expect(() => processor.processContentDocument(post)).toThrow(
      "Markdown blog posts must not begin with an H1; the title is template-owned"
    );
    expect(() => processor.processContentDocument(post)).toThrow(
      post.sourcePath
    );
  });
});
