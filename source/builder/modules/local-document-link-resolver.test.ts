import { describe, expect, it } from "vitest";
import { Marked } from "marked";
import type { ContentDocument, MediaAsset } from "./content-discovery.js";
import {
  createLocalDocumentLinkIndex,
  resolveLocalMediaSource,
} from "./local-document-link-resolver.js";
import { MarkdownRenderer } from "./markdown-renderer.js";

const parent: ContentDocument = {
  sourcePath: "/published/guide/guide.md",
  outputPath: "guide.html",
  publicUrl: "/guide.html",
  kind: "directory-post",
  metadata: {},
};

const supplement: ContentDocument = {
  sourcePath: "/published/guide/supplements/notes.md",
  outputPath: "guide/supplements/notes.html",
  publicUrl: "/guide/supplements/notes.html",
  kind: "supplement-candidate",
  parentUrl: "/guide.html",
  metadata: { published: true },
};

const diagram: MediaAsset = {
  sourcePath: "/published/guide/media/diagram.png",
  outputPath: "guide/media/diagram.png",
  publicUrl: "/guide/media/diagram.png",
  parentUrl: "/guide.html",
};

const documentIndex = createLocalDocumentLinkIndex(
  [parent, supplement],
  [parent, supplement],
  "/published",
  [diagram]
);

describe("resolveLocalMediaSource", () => {
  it.each([
    [parent.sourcePath, "media/diagram.png"],
    [supplement.sourcePath, "../media/diagram.png"],
  ])("resolves from %s", (currentSourcePath, targetSrc) => {
    expect(
      resolveLocalMediaSource({ currentSourcePath, targetSrc, documentIndex })
    ).toBe("/guide/media/diagram.png");
  });

  it.each([
    "/images/posts/photo.jpg",
    "https://example.com/photo.jpg",
    "data:image/png;base64,AAAA",
  ])("leaves %s unchanged", (targetSrc) => {
    expect(
      resolveLocalMediaSource({
        currentSourcePath: parent.sourcePath,
        targetSrc,
        documentIndex,
      })
    ).toBe(targetSrc);
  });

  it("throws for a relative source that isn't published media", () => {
    expect(() =>
      resolveLocalMediaSource({
        currentSourcePath: parent.sourcePath,
        targetSrc: "media/missing.png",
        documentIndex,
      })
    ).toThrow('Invalid local image in "/published/guide/guide.md"');
  });
});

describe("MarkdownRenderer images", () => {
  it("renders a relative image with its published media URL", () => {
    const renderer = new MarkdownRenderer(new Marked());

    expect(
      renderer.render('![A "diagram"](media/diagram.png "Title")', {
        currentSourcePath: parent.sourcePath,
        documentLinkIndex: documentIndex,
      })
    ).toBe(
      '<p><img src="/guide/media/diagram.png" alt="A &quot;diagram&quot;" title="Title"></p>\n'
    );
  });
});
