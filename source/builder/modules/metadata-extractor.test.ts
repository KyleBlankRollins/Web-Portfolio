import { describe, expect, it } from "vitest";
import { MetadataExtractor } from "./metadata-extractor.js";

describe("MetadataExtractor", () => {
  it("extracts supported page comment keys and removes comments", () => {
    const result = new MetadataExtractor().extract(`<!-- title: Guide -->
<!-- description: A description -->
<!-- keywords: docs, writing -->
<!-- template: base.html -->
<h1>Content</h1>`);

    expect(result.metadata).toMatchObject({
      title: "Guide",
      description: "A description",
      keywords: "docs, writing",
    });
    expect(result.content).toBe("<h1>Content</h1>");
  });

  it("extracts an individual comment", () => {
    expect(
      new MetadataExtractor().extractComment("<!-- title: Hello -->", "title")
    ).toBe("Hello");
  });
});
