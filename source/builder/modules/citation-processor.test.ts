import { describe, expect, it } from "vitest";
import { CitationProcessor } from "./citation-processor.js";
import { HtmlAstRenderer } from "./html-ast-renderer.js";

describe("CitationProcessor", () => {
  const processor = new CitationProcessor();
  const citation = {
    id: "book-1",
    title: "A <Book>",
    author: "An & Author",
    url: "https://example.com/book",
  };

  it("turns a reference into a numbered footnote and returns display data", () => {
    const result = processor.processCitationReferences(
      "Read this[^book-1].",
      [citation],
      "post.md"
    );

    expect(result.content).toContain('href="#citation-book-1"');
    expect(result.citationItems).toEqual([
      expect.objectContaining({
        title: "A <Book>",
        author: "An & Author",
        links: [
          {
            label: "View",
            url: "https://example.com/book",
            showSeparator: false,
          },
        ],
        backReferences: [{ href: "#citation-ref-book-1", label: "↩" }],
      }),
    ]);
  });

  it("supports citations with no links", () => {
    const result = processor.processCitationReferences(
      "Read this[^book-1].",
      [{ ...citation, url: undefined }],
      "post.md"
    );

    expect(result.citationItems?.[0].links).toEqual([]);
  });

  it("escapes citation display values when rendered by the template boundary", () => {
    const result = processor.processCitationReferences(
      "Read this[^book-1].",
      [
        {
          ...citation,
          url: "https://example.com/book?a=1&b=2",
        },
      ],
      "post.md"
    );

    const rendered = new HtmlAstRenderer().render(
      '<li><em>{{citation.title}}</em> by {{citation.author}} <a href="{{citation.links.0.url}}">View</a></li>',
      { citation: result.citationItems![0] }
    );

    expect(rendered.html).toBe(
      '<li><em>A &lt;Book&gt;</em> by An &amp; Author <a href="https://example.com/book?a=1&amp;b=2">View</a></li>'
    );
  });

  it("supports a purchase-only link without a separator", () => {
    const result = processor.processCitationReferences(
      "Read this[^book-1].",
      [{ ...citation, url: undefined, purchaseUrl: "https://example.com/buy" }],
      "post.md"
    );

    expect(result.citationItems?.[0].links).toEqual([
      { label: "Buy", url: "https://example.com/buy", showSeparator: false },
    ]);
  });

  it("marks the purchase link separator when both links exist", () => {
    const result = processor.processCitationReferences(
      "Read this[^book-1].",
      [
        {
          ...citation,
          purchaseUrl: "https://example.com/buy",
        },
      ],
      "post.md"
    );

    expect(result.citationItems?.[0].links).toEqual([
      { label: "View", url: "https://example.com/book", showSeparator: false },
      { label: "Buy", url: "https://example.com/buy", showSeparator: true },
    ]);
  });

  it("numbers multiple references and creates matching back-reference targets", () => {
    const result = processor.processCitationReferences(
      "First[^book-1], again[^book-1], and last[^book-1].",
      [citation],
      "post.md"
    );

    expect(result.content).toContain(
      '<sup id="citation-ref-book-1-1"><a href="#citation-book-1" class="citation-ref">[1]</a></sup>'
    );
    expect(result.content).toContain(
      '<sup id="citation-ref-book-1-2"><a href="#citation-book-1" class="citation-ref">[1]</a></sup>'
    );
    expect(result.content).toContain(
      '<sup id="citation-ref-book-1-3"><a href="#citation-book-1" class="citation-ref">[1]</a></sup>'
    );
    expect(result.citationItems?.[0].backReferences).toEqual([
      { href: "#citation-ref-book-1-1", label: "↩1" },
      { href: "#citation-ref-book-1-2", label: "↩2" },
      { href: "#citation-ref-book-1-3", label: "↩3" },
    ]);
  });

  it("excludes unused citations from display data", () => {
    const result = processor.processCitationReferences(
      "Read this[^book-1].",
      [citation, { id: "unused", title: "Unused", author: "Author" }],
      "post.md"
    );

    expect(result.citationItems?.map((item) => item.id)).toEqual(["book-1"]);
  });

  it("rejects duplicate citation IDs", () => {
    expect(() =>
      processor.parseCitationsFromFrontmatter(
        `citations:\n  - id: duplicate\n    title: First\n    author: Author\n  - id: duplicate\n    title: Second\n    author: Author`
      )
    ).toThrow("Duplicate citation IDs: duplicate");
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
      citationItems: undefined,
    });
  });

  it("currently throws for an unknown reference", () => {
    // AF-03: asserts current (incorrect) behaviour, see phase 3.
    expect(() =>
      processor.processCitationReferences("[^missing]", [citation], "post.md")
    ).toThrow('Citation "missing" referenced but not defined');
  });
});
