import { describe, expect, it } from "vitest";
import { MetadataExtractor } from "./metadata-extractor.js";

describe("MetadataExtractor", () => {
  it("extracts every supported comment key and removes comments", () => {
    const result = new MetadataExtractor().extract(`<!-- title: Guide -->
<!-- description: A description -->
<!-- keywords: docs, writing -->
<!-- date: 2025-01-02 -->
<!-- formattedDate: January 2, 2025 -->
<!-- tags: docs, writing -->
<!-- isBlogPost: true -->
<!-- series.name: Documentation -->
<!-- series.part: 2 -->
<!-- citationsHtml: <section>References</section> -->
<!-- template: base.html -->
<h1>Content</h1>`);

    expect(result.metadata).toMatchObject({
      title: "Guide",
      description: "A description",
      keywords: "docs, writing",
      date: "2025-01-02",
      formattedDate: "January 2, 2025",
      tags: ["docs", "writing"],
      isBlogPost: true,
      series: { name: "Documentation", part: 2 },
      citationsHtml: "<section>References</section>",
    });
    expect(result.content).toBe("<h1>Content</h1>");
  });

  it("extracts an individual comment", () => {
    expect(
      new MetadataExtractor().extractComment("<!-- title: Hello -->", "title")
    ).toBe("Hello");
  });
});
