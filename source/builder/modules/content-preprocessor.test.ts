import { describe, expect, it } from "vitest";
import { ContentPreprocessor } from "./content-preprocessor.js";

describe("ContentPreprocessor", () => {
  const preprocessor = new ContentPreprocessor();

  it("strips line comments outside fenced code", () => {
    expect(preprocessor.stripComments("Before\n// remove this\nAfter")).toBe(
      "Before\n\nAfter"
    );
  });

  it("preserves comments inside fenced code blocks", () => {
    const content = "```js\n// keep this\nconst value = 1;\n```";
    expect(preprocessor.stripComments(content)).toBe(content);
  });

  it("renders inline markdown inside admonitions", () => {
    const result = preprocessor.preprocessAdmonitions(
      '<kbr-admonition type="note">Use **bold** text.</kbr-admonition>'
    );
    expect(result).toContain(
      '<kbr-admonition type="note">Use <strong>bold</strong> text.</kbr-admonition>'
    );
  });

  it("strips standalone block comments", () => {
    expect(preprocessor.stripComments("Before\n/* remove this */\nAfter")).toBe(
      "Before\n\nAfter"
    );
  });
});
