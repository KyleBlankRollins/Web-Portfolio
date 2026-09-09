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
});
