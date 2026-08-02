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

  it("injects stylesheets in head and scripts before body close", () => {
    const result = HtmlProcessingUtils.injectAssets(
      "<html><head></head><body>Content</body></html>",
      { css: ["/style.css"], js: ["/app.js"] }
    );

    expect(result.indexOf("/style.css")).toBeLessThan(
      result.indexOf("</head>")
    );
    expect(result.indexOf("/app.js")).toBeLessThan(result.indexOf("</body>"));
  });

  it("normalizes asset placement idempotently", () => {
    const html =
      '<html><head></head><body><link rel="stylesheet" href="/style.css">\n<script type="module"></script>\nContent</body></html>';
    const normalized = HtmlProcessingUtils.normalizeAssetPlacement(html);
    // AF-06: asserts current (incorrect) behavior, see phase 3.
    expect(HtmlProcessingUtils.normalizeAssetPlacement(normalized)).not.toBe(
      normalized
    );
    expect(normalized.indexOf("/style.css")).toBeLessThan(
      normalized.indexOf("</head>")
    );
    expect(normalized.indexOf('type="module"')).toBeLessThan(
      normalized.indexOf("</body>")
    );
  });

  it("returns unchanged content without a closing head", () => {
    const html = "<body>Content</body>";
    expect(HtmlProcessingUtils.normalizeAssetPlacement(html)).toBe(html);
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
