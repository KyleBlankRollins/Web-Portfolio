import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { ContentDiscovery } from "./content-discovery.js";

const tempDirectories: string[] = [];

function fixtureRoot(): string {
  const root = mkdtempSync(join(tmpdir(), "kbr-"));
  tempDirectories.push(root);
  return root;
}

function writePost(
  root: string,
  relativePath: string,
  frontmatter = 'title = "Post"\ndescription = "Description"\ndate = "2025-01-01"\ntags = []'
): void {
  const filePath = join(root, relativePath);
  mkdirSync(join(filePath, ".."), { recursive: true });
  writeFileSync(filePath, `+++\n${frontmatter}\n+++\nBody\n`);
}

afterEach(() => {
  for (const directory of tempDirectories.splice(0)) {
    rmSync(directory, { recursive: true, force: true });
  }
});

describe("ContentDiscovery", () => {
  it("discovers a standalone post", () => {
    const root = fixtureRoot();
    writePost(root, "hello.md", 'title = "Hello"\ndescription = "Description"\ndate = "2025-01-01"\ntags = []');

    const result = new ContentDiscovery(root).discover();
    expect(
      result.publishableDocuments.map((document) => document.publicUrl)
    ).toEqual(["/hello.html"]);
    expect(result.documents[0].kind).toBe("standalone-post");
  });

  it("discovers a directory post", () => {
    const root = fixtureRoot();
    writePost(root, "guide/guide.md", 'title = "Guide"\ndescription = "Description"\ndate = "2025-01-01"\ntags = []');

    const result = new ContentDiscovery(root).discover();
    expect(result.documents[0]).toMatchObject({
      outputPath: "guide.html",
      kind: "directory-post",
    });
  });

  it("classifies supplements as candidates and publishes valid ones", () => {
    const root = fixtureRoot();
    writePost(root, "guide/guide.md", 'title = "Guide"\ndescription = "Description"\ndate = "2025-01-01"\ntags = []');
    writePost(
      root,
      "guide/supplements/example.md",
      'title = "Example"\ndescription = "Description"\ndate = "2025-01-01"\npublished = true'
    );

    const result = new ContentDiscovery(root).discover();
    expect(result.supplementCandidates).toHaveLength(1);
    expect(result.publishedSupplements[0]).toMatchObject({
      kind: "supplement-candidate",
      parentUrl: "/guide.html",
      publicUrl: "/guide/supplements/example.html",
    });
  });

  it("throws when documents generate duplicate public URLs", () => {
    const root = fixtureRoot();
    writePost(root, "same.md");
    writePost(root, "same/same.md");

    expect(() => new ContentDiscovery(root).discover()).toThrow(
      'Duplicate public output URL "/same.html"'
    );
  });

  it("returns no documents for a missing root", () => {
    const root = fixtureRoot();
    rmSync(root, { recursive: true, force: true });
    expect(new ContentDiscovery(root).discover().documents).toEqual([]);
  });
});
