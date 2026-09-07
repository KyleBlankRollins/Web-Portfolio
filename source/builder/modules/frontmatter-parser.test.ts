import { describe, expect, it } from "vitest";
import { FrontmatterParser } from "./frontmatter-parser.js";

describe("FrontmatterParser", () => {
  const parser = new FrontmatterParser("published");

  it("parses TOML frontmatter and formats dates", () => {
    const result = parser.parse(`+++
title = "A post"
description = "Description"
date = "2025-01-02"
tags = ["docs", "typescript"]
+++
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
    const result = parser.parse(`+++
title = "A post"
description = "Description"
date = "2025-01-02"
tags = ["one", "two"]
[series]
name = "A series"
part = 0
+++
Body`);

    expect(result.metadata.tags).toEqual(["one", "two"]);
    expect(result.metadata.series).toEqual({ name: "A series", part: 0 });
  });

  it("records a literal published flag", () => {
    expect(parser.parse("+++\ntitle = \"A post\"\ndescription = \"Description\"\ndate = \"2025-01-02\"\ntags = []\npublished = false\n+++\nBody").metadata.published).toBe(false);
  });

  it("rejects unknown keys and invalid published values", () => {
    expect(() => parser.parse("+++\ntitle = \"A post\"\ndescription = \"Description\"\ndate = \"2025-01-02\"\ntags = []\npublished = \"yes\"\n+++\nBody", "post.md")).toThrow(/post\.md/);
    expect(() => parser.parse("+++\ntitle = \"A post\"\ndescription = \"Description\"\ndate = \"2025-01-02\"\ntags = []\nextra = true\n+++\nBody", "post.md")).toThrow(/extra/);
  });

  it("rejects invalid calendar dates", () => {
    expect(() => parser.parse("+++\ntitle = \"A post\"\ndescription = \"Description\"\ndate = \"2025-02-29\"\ntags = []\n+++\nBody", "post.md")).toThrow(/calendar date/);
  });

  it("rejects missing required fields, invalid URLs, bad series parts, and duplicate citations", () => {
    expect(() => parser.parse("+++\ndescription = \"Description\"\ndate = \"2025-01-02\"\ntags = []\n+++\nBody", "missing.md")).toThrow(/missing\.md.*title/);
    expect(() => parser.parse("+++\ntitle = \"A post\"\ndescription = \"Description\"\ndate = \"2025-01-02\"\ntags = []\n[[citations]]\nid = \"source\"\ntitle = \"Source\"\nauthor = \"Author\"\nurl = \"not a URL\"\n+++\nBody", "url.md")).toThrow(/url\.md.*citations\.0\.url/);
    expect(() => parser.parse("+++\ntitle = \"A post\"\ndescription = \"Description\"\ndate = \"2025-01-02\"\ntags = []\n[series]\nname = \"Series\"\npart = -1\n+++\nBody", "series.md")).toThrow(/series\.md.*series\.part/);
    expect(() => parser.parse("+++\ntitle = \"A post\"\ndescription = \"Description\"\ndate = \"2025-01-02\"\ntags = []\n[[citations]]\nid = \"source\"\ntitle = \"One\"\nauthor = \"Author\"\n[[citations]]\nid = \"source\"\ntitle = \"Two\"\nauthor = \"Author\"\n+++\nBody", "duplicate.md")).toThrow(/duplicate\.md.*duplicate citation ID/);
  });

  it("allows non-calendar draft dates while validating calendar-shaped dates", () => {
    const draftParser = new FrontmatterParser("draft");
    expect(draftParser.parse("+++\ntitle = \"Draft\"\ndate = \"next Tuesday\"\n+++\nBody", "draft.md").metadata.date).toBe("next Tuesday");
    expect(() => draftParser.parse("+++\ntitle = \"Draft\"\ndate = \"2025-02-29\"\n+++\nBody", "draft.md")).toThrow(/calendar date/);
  });
});
