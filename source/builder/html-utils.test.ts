import { describe, expect, it } from "vitest";
import { HtmlProcessingUtils } from "./html-utils.js";

describe("HtmlProcessingUtils", () => {
  it("prefers an h1 when extracting a title", () => {
    expect(
      HtmlProcessingUtils.extractTitleFromContent(
        '<kbr-page-head title="Attribute"></kbr-page-head><h1><em>Heading</em></h1>'
      )
    ).toBe("Heading");
  });

  it("returns an empty tag list when tags are absent", () => {
    expect(HtmlProcessingUtils.generateTagsHtml()).toBe("");
  });

  it("renders tag buttons", () => {
    expect(HtmlProcessingUtils.generateTagsHtml(["docs"])).toContain(
      'data-tag="docs"'
    );
  });
});
