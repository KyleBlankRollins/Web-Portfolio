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
      {
        head: [{ kind: "stylesheet", href: "/style.css" }],
        body: [{ kind: "module", src: "/app.js" }],
      }
    );

    expect(result.indexOf("/style.css")).toBeLessThan(
      result.indexOf("</head>")
    );
    expect(result.indexOf("/app.js")).toBeLessThan(result.indexOf("</body>"));
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
