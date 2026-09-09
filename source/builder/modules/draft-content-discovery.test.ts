import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { BuildLogger } from "../helpers.js";
import {
  DraftContentDiscovery,
  type DraftDocument,
} from "./draft-content-discovery.js";

const tempDirectories: string[] = [];

function draftRoot(): string {
  const root = mkdtempSync(join(tmpdir(), "kbr-drafts-"));
  tempDirectories.push(root);
  return root;
}

function writeDraft(root: string, relativePath: string, body = "Body"): void {
  const filePath = join(root, relativePath);
  mkdirSync(join(filePath, ".."), { recursive: true });
  writeFileSync(filePath, `${body}\n`);
}

function writeFile(root: string, relativePath: string, body = ""): void {
  const filePath = join(root, relativePath);
  mkdirSync(join(filePath, ".."), { recursive: true });
  writeFileSync(filePath, body);
}

function documentFor(
  documents: DraftDocument[],
  sourcePath: string
): DraftDocument {
  const match = documents.find((document) =>
    document.sourcePath.endsWith(sourcePath)
  );
  if (!match) {
    throw new Error(`No draft document ending in "${sourcePath}"`);
  }
  return match;
}

afterEach(() => {
  vi.restoreAllMocks();
  for (const directory of tempDirectories.splice(0)) {
    rmSync(directory, { recursive: true, force: true });
  }
});

describe("DraftContentDiscovery", () => {
  it("classifies a root-level file as a standalone draft", () => {
    const root = draftRoot();
    writeDraft(root, "note.md");

    const result = new DraftContentDiscovery(root).discover();

    expect(result.documents).toHaveLength(1);
    expect(result.documents[0]).toMatchObject({
      sourcePath: join(root, "note.md"),
      kind: "standalone-draft",
    });
    expect(result.documents[0].parentSourcePath).toBeUndefined();
  });

  it("classifies a directory draft with a nested supporting file", () => {
    const root = draftRoot();
    writeDraft(root, "essay/essay.md");
    writeDraft(root, "essay/supplements/research.md");
    writeDraft(root, "essay/supplements/semiotics/prior-art.md");

    const result = new DraftContentDiscovery(root).discover();

    const parent = documentFor(result.documents, join("essay", "essay.md"));
    expect(parent.kind).toBe("directory-draft");
    expect(parent.parentSourcePath).toBeUndefined();

    const research = documentFor(
      result.documents,
      join("supplements", "research.md")
    );
    expect(research.kind).toBe("supporting-draft");
    expect(research.parentSourcePath).toBe(parent.sourcePath);

    const nested = documentFor(
      result.documents,
      join("semiotics", "prior-art.md")
    );
    expect(nested.kind).toBe("supporting-draft");
    expect(nested.parentSourcePath).toBe(parent.sourcePath);
  });

  it("excludes backlog.md at the draft root", () => {
    const root = draftRoot();
    writeDraft(root, "backlog.md");
    writeDraft(root, "note.md");

    const result = new DraftContentDiscovery(root).discover();

    expect(
      result.documents.some((document) =>
        document.sourcePath.endsWith("backlog.md")
      )
    ).toBe(false);
    expect(result.documents).toHaveLength(1);
  });

  it("returns an empty result for a missing draft root", () => {
    const root = draftRoot();
    rmSync(root, { recursive: true, force: true });

    const result = new DraftContentDiscovery(root).discover();

    expect(result.documents).toEqual([]);
    expect(result.draftRootPath).toBe(root);
  });

  it("rejects a directory with no parent Markdown file", () => {
    const root = draftRoot();
    writeDraft(root, "essay/supplements/research.md");

    expect(() => new DraftContentDiscovery(root).discover()).toThrow(
      /Invalid draft directory .*essay.*missing parent Markdown file.*essay\.md/
    );
  });

  it("rejects multiple direct parent candidates", () => {
    const root = draftRoot();
    writeDraft(root, "essay/essay.md");
    writeDraft(root, "essay/notes.md");

    expect(() => new DraftContentDiscovery(root).discover()).toThrow(
      /Invalid draft directory .*essay.*multiple parent candidates found \(essay\.md, notes\.md\)/
    );
  });

  it("rejects a mismatched parent filename", () => {
    const root = draftRoot();
    writeDraft(root, "essay/intro.md");

    expect(() => new DraftContentDiscovery(root).discover()).toThrow(
      /Invalid draft directory .*essay.*parent file name mismatch.*Expected "essay\.md", found "intro\.md"/
    );
  });

  it("ignores non-Markdown files and media directories", () => {
    const root = draftRoot();
    writeDraft(root, "essay/essay.md");
    writeFile(root, "essay/cover.png", "binary");
    writeFile(root, "essay/media/diagram.png", "binary");
    writeDraft(root, "essay/media/notes.md");
    writeFile(root, "readme.txt", "text");

    const result = new DraftContentDiscovery(root).discover();

    expect(result.documents).toHaveLength(1);
    expect(result.documents[0].kind).toBe("directory-draft");
    expect(
      result.documents.some((document) =>
        document.sourcePath.includes(join("media", "notes.md"))
      )
    ).toBe(false);
  });

  it("warns about an unknown subdirectory and does not traverse it", () => {
    const root = draftRoot();
    writeDraft(root, "essay/essay.md");
    writeDraft(root, "essay/scratch/idea.md");

    const warn = vi.spyOn(BuildLogger, "warn").mockImplementation(() => {});
    const result = new DraftContentDiscovery(root).discover();

    expect(result.documents).toHaveLength(1);
    expect(
      result.documents.some((document) =>
        document.sourcePath.endsWith("idea.md")
      )
    ).toBe(false);
    expect(warn).toHaveBeenCalledWith(
      expect.stringMatching(/Unknown subdirectory .*scratch/)
    );
  });

  it("skips reserved directories at the draft root", () => {
    const root = draftRoot();
    writeDraft(root, "supplements/research.md");
    writeDraft(root, "media/notes.md");
    writeDraft(root, "note.md");

    const warn = vi.spyOn(BuildLogger, "warn").mockImplementation(() => {});
    const result = new DraftContentDiscovery(root).discover();

    expect(result.documents).toHaveLength(1);
    expect(result.documents[0].sourcePath.endsWith("note.md")).toBe(true);
    expect(warn).toHaveBeenCalledTimes(2);
  });

  it("never leaks output paths, public URLs, or manifest fields", () => {
    const root = draftRoot();
    writeDraft(root, "essay/essay.md");
    writeDraft(root, "essay/supplements/research.md");

    const result = new DraftContentDiscovery(root).discover();

    for (const document of result.documents) {
      expect(document).not.toHaveProperty("outputPath");
      expect(document).not.toHaveProperty("publicUrl");
      expect(document).not.toHaveProperty("parentUrl");
      expect(document).not.toHaveProperty("metadata");
      expect(Object.keys(document).sort()).toEqual(
        document.kind === "supporting-draft"
          ? ["kind", "parentSourcePath", "sourcePath"]
          : ["kind", "sourcePath"]
      );
    }
  });
});
