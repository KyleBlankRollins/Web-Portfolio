import { describe, expect, it } from "vitest";
import { CitationProcessor } from "./citation-processor.js";

describe("CitationProcessor", () => {
  const processor = new CitationProcessor();
  const citation = {
    id: "book-1",
    title: "A <Book>",
    author: "An & Author",
    url: "https://example.com/book",
  };

  it("turns a reference into a numbered footnote and escapes metadata", () => {
    const result = processor.processCitationReferences(
      "Read this[^book-1].",
      [citation],
      "post.md"
    );

    expect(result.content).toContain('href="#citation-book-1"');
    expect(result.citationsHtml).toContain("&lt;Book&gt;");
    expect(result.citationsHtml).toContain("An &amp; Author");
    expect(result.citationsHtml).toContain("https://example.com/book");
  });

  it("parses citation entries from frontmatter", () => {
    expect(
      processor.parseCitationsFromFrontmatter(
        `citations:\n  - id: book-1\n    title: A book\n    author: An author`
      )
    ).toEqual([{ id: "book-1", title: "A book", author: "An author" }]);
  });

  it("returns unchanged content when citations are absent", () => {
    expect(
      processor.processCitationReferences("Content", undefined, "post.md")
    ).toEqual({
      content: "Content",
      citationsHtml: undefined,
    });
  });

  it("currently throws for an unknown reference", () => {
    // AF-03: asserts current (incorrect) behaviour, see phase 3.
    expect(() =>
      processor.processCitationReferences("[^missing]", [citation], "post.md")
    ).toThrow('Citation "missing" referenced but not defined');
  });
});
