import { execSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { beforeAll, describe, expect, it } from "vitest";

function findHtmlFiles(directory: string): string[] {
  const files: string[] = [];

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const entryPath = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...findHtmlFiles(entryPath));
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      files.push(entryPath);
    }
  }

  return files.sort();
}

function normalizeAssets(content: string): string {
  return content.replace(/-[A-Za-z0-9_-]{8}\.(js|css)/g, "-HASH.$1");
}

function normalizeThemeTimestamp(content: string): string {
  return content.replace(/("generatedAt"\s*:\s*)"[^"]*"/, '$1"NORMALIZED"');
}

describe("built site output", () => {
  beforeAll(() => {
    execSync("npm run build", {
      cwd: process.cwd(),
      stdio: "pipe",
    });
  }, 180_000);

  it("matches the built HTML pages and manifests", async () => {
    const distDirectory = join(process.cwd(), "dist");
    const htmlFiles = findHtmlFiles(distDirectory);
    const manifestFiles = [
      join(distDirectory, "data", "blog-manifest.json"),
      join(distDirectory, "data", "theme-manifest.json"),
    ];

    for (const filePath of [...htmlFiles, ...manifestFiles]) {
      const relativePath = relative(distDirectory, filePath);
      let normalized = normalizeAssets(readFileSync(filePath, "utf-8"));
      if (relativePath === "data/theme-manifest.json") {
        normalized = normalizeThemeTimestamp(normalized);
      }

      await expect(normalized).toMatchFileSnapshot(
        `./__snapshots__/${relativePath}.snap`
      );
    }
  });
});
