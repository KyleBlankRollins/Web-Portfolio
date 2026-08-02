import { describe, expect, it } from "vitest";
import { FrontmatterParser } from "./frontmatter-parser.js";

describe("FrontmatterParser", () => {
  const parser = new FrontmatterParser();

  it("parses YAML-like frontmatter and formats dates", () => {
    const result = parser.parse(`---
title: "A post"
description: Description
date: 2025-01-02
tags: [docs, "typescript"]
---
Body`);

    expect(result.metadata.title).toBe("A post");
    expect(result.metadata.description).toBe("Description");
    expect(result.metadata.date).toBe("2025-01-02");
    expect(result.metadata.formattedDate).toBe("January 2, 2025");
    expect(result.metadata.tags).toEqual(["docs", "typescript"]);
    expect(result.content).toBe("Body");
  });

  it("returns content unchanged when frontmatter is missing", () => {
    const content = "# No frontmatter";
    expect(parser.parse(content)).toEqual({ metadata: {}, content });
  });

  it("parses a series object and comma-separated tags", () => {
    const result = parser.parse(`---
tags: one, two
series:
  name: A series
  part: 0
---
Body`);

    expect(result.metadata.tags).toEqual(["one", "two"]);
    expect(result.metadata.series).toEqual({ name: "A series", part: 0 });
  });

  it("records a literal published flag", () => {
    expect(
      parser.parse("---\npublished: false\n---\nBody").metadata.published
    ).toBe(false);
  });

  it("retains invalid published values for validation", () => {
    expect(
      parser.parse("---\npublished: yes\n---\nBody").metadata.publishedRawValue
    ).toBe("yes");
  });
});
