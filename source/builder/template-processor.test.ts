import { describe, expect, it } from "vitest";
import { TemplateProcessor } from "./template-processor.js";

describe("TemplateProcessor", () => {
  it("makes page metadata available during the single page walk", () => {
    const processor = new TemplateProcessor({
      templates: new Map([
        [
          "base.html",
          '<html><head><title>{{title}}</title></head><body><main data-kbr-slot="content"></main></body></html>',
        ],
      ]),
    });

    const result = processor.processTemplate(
      '<template data-kbr-page data-layout="base.html"><meta name="title" content="META TITLE"><meta name="custom" content="CUSTOMVAL"></template><h1>{{title}}</h1><p>{{custom}}</p>',
      { title: "fallback", content: "unused" }
    );

    expect(result).toContain("<title>META TITLE</title>");
    expect(result).toContain("<h1>META TITLE</h1>");
    expect(result).toContain("<p>CUSTOMVAL</p>");
  });

  it("does not interpolate replacement text a second time", () => {
    const processor = new TemplateProcessor({
      templates: new Map([
        [
          "base.html",
          '<html><body><main data-kbr-slot="content"></main></body></html>',
        ],
      ]),
    });

    const result = processor.processTemplate(
      '<template data-kbr-page data-layout="base.html"><meta name="description" content="{{keywords}}"></template><p>{{description}}</p>',
      {
        title: "Page",
        description: "fallback",
        keywords: "LEAKED",
        content: "unused",
      }
    );

    expect(result).toContain("<p>{{keywords}}</p>");
    expect(result).not.toContain("<p>LEAKED</p>");
  });
});
