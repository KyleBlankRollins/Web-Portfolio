import { describe, expect, it } from "vitest";
import { siteAssetsFromManifest } from "./site-assets.js";

describe("siteAssetsFromManifest", () => {
  it("converts the entry and imported chunks into head and body assets", () => {
    expect(
      siteAssetsFromManifest({
        "main.ts": {
          file: "assets/main-12345678.js",
          css: ["assets/main-12345678.css"],
          imports: ["_lit-abcdef12.js", "_shared-fedcba98.js"],
        },
        "_lit-abcdef12.js": {
          file: "assets/lit-abcdef12.js",
          css: ["assets/lit-abcdef12.css"],
          imports: ["_shared-fedcba98.js"],
        },
        "_shared-fedcba98.js": {
          file: "assets/shared-fedcba98.js",
        },
      })
    ).toEqual({
      head: [
        { kind: "stylesheet", href: "/assets/main-12345678.css" },
        { kind: "modulepreload", href: "/assets/lit-abcdef12.js" },
        { kind: "stylesheet", href: "/assets/lit-abcdef12.css" },
        { kind: "modulepreload", href: "/assets/shared-fedcba98.js" },
      ],
      body: [{ kind: "module", src: "/assets/main-12345678.js" }],
    });
  });

  it("requires the main entry", () => {
    expect(() => siteAssetsFromManifest({})).toThrow(
      "Vite manifest does not contain the main.ts entry"
    );
  });
});
