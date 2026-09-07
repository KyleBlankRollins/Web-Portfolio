import { execSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { createServer, type ViteDevServer } from "vite";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { normalizeDom } from "./test-support/normalized-dom.js";

let devServer: ViteDevServer | undefined;
let devServerBaseUrl: string;

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

function normalizeServedDocument(content: string) {
  // Asset structure is covered by the dedicated Gate 1.2 assertions below;
  // this comparison isolates document DOM from expected dev/prod asset URLs.
  return normalizeDom(
    content
      .replace(
        /[ \t]*<link\b[^>]*rel=["'](?:stylesheet|modulepreload)["'][^>]*>\s*/gi,
        ""
      )
      .replace(
        /[ \t]*<script\b[^>]*type=["']module["'][^>]*src=["'][^"']*(?:\/@vite\/client|\/main\.ts|\/assets\/)[^"']*["'][^>]*><\/script>\s*/gi,
        ""
      )
  );
}

describe("built site output", () => {
  beforeAll(async () => {
    execSync("npm run build", {
      cwd: process.cwd(),
      stdio: "pipe",
    });

    devServer = await createServer({
      configFile: join(process.cwd(), "vite.config.ts"),
      server: { host: "127.0.0.1", port: 0 },
      logLevel: "error",
    });
    await devServer.listen();

    const address = devServer.httpServer?.address();
    if (!address || typeof address === "string") {
      throw new Error("Vite dev server did not expose a TCP address");
    }
    devServerBaseUrl = `http://127.0.0.1:${address.port}`;
  }, 180_000);

  afterAll(async () => {
    await devServer?.close();
  });

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
      }

      await expect(normalized).toMatchFileSnapshot(
        `./__snapshots__/${relativePath}.snap`
      );
    }
  });

  it("places root and nested page assets from the Vite manifest", () => {
    const distDirectory = join(process.cwd(), "dist");
    const outputPaths = [
      "index.html",
      "intentional-work-patterns/supplements/boundary-checklist.html",
    ];

    for (const outputPath of outputPaths) {
      const content = readFileSync(join(distDirectory, outputPath), "utf-8");
      const head = content.slice(0, content.indexOf("</head>"));
      const body = content.slice(content.indexOf("</head>"));

      expect(content).not.toContain("/main.ts");
      expect(content).not.toMatch(
        /<(?:link|script)\b[^>]+(?:href|src)=["'](?!\/)/
      );
      expect(head).toMatch(/<link rel="stylesheet"[^>]+href="\/[^"]+"/);
      expect(head).toMatch(/<link rel="modulepreload"[^>]+href="\/[^"]+"/);
      expect(body).toMatch(
        /<script type="module"[^>]+src="\/[^"]+"><\/script>/
      );
      expect(body.match(/<script type="module"/g)).toHaveLength(1);
      expect(body.indexOf("</body>")).toBeGreaterThan(
        body.indexOf('<script type="module"')
      );
    }
  });

  it("preserves DOM parity between served production and development pages", async () => {
    const distDirectory = join(process.cwd(), "dist");
    const outputPaths = [
      "index.html",
      "intentional-work-patterns/supplements/boundary-checklist.html",
    ];

    for (const outputPath of outputPaths) {
      const route = outputPath === "index.html" ? "/" : `/${outputPath}`;
      const response = await fetch(`${devServerBaseUrl}${route}`);
      expect(response.status).toBe(200);
      const developmentHtml = await response.text();
      const productionHtml = readFileSync(
        join(distDirectory, outputPath),
        "utf-8"
      );

      expect(developmentHtml).toContain("/@vite/client");
      expect(normalizeServedDocument(developmentHtml)).toEqual(
        normalizeServedDocument(productionHtml)
      );
    }
  });
});
