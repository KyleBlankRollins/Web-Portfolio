import { describe, expect, it, vi } from "vitest";

vi.mock("node:fs", () => {
  const filesystemAccess = (): never => {
    throw new Error("renderSite must not access the filesystem");
  };

  return {
    existsSync: filesystemAccess,
    readFileSync: filesystemAccess,
    readdirSync: filesystemAccess,
  };
});

const { renderSite } = await import("./site-renderer.js");

describe("renderSite filesystem boundary", () => {
  it("does not access the filesystem while rendering in-memory inputs", () => {
    const source = {
      experienceData: "{}",
      pages: new Map(),
      templates: new Map([
        [
          "base.html",
          '<!doctype html><html><head><template data-kbr-assets="head"></template></head><body><main data-kbr-slot="content"></main><template data-kbr-assets="body"></template></body></html>',
        ],
      ]),
      partials: new Map([
        ["head.html", ""],
        ["header.html", ""],
        ["footer.html", ""],
      ]),
    };

    expect(() =>
      renderSite(
        source,
        [{ outputPath: "fixture.html", content: "<p>Fixture</p>" }],
        { head: [], body: [] }
      )
    ).not.toThrow();
  });
});
