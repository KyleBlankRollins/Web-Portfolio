import { dirname, join } from "node:path";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { BuildLogger } from "./helpers.js";
import type { MarkdownProcessor } from "./markdown-processor.js";
import { loadSiteSource, renderSite } from "./site-renderer.js";
import { collectSiteContent } from "./site-content.js";
import { siteAssetsFromManifest } from "./site-assets.js";

export async function writeSite(
  outputDirectory: string,
  markdownProcessor: MarkdownProcessor
): Promise<void> {
  try {
    BuildLogger.info("📄 Processing HTML files with includes...");

    const manifestPath = join(outputDirectory, ".vite", "manifest.json");
    const manifest = JSON.parse(readFileSync(manifestPath, "utf-8"));
    const assets = siteAssetsFromManifest(manifest);
    const source = loadSiteSource();
    const renderedSite = renderSite(
      source,
      collectSiteContent(source, markdownProcessor),
      assets
    );
    for (const [outputPath, output] of renderedSite.outputs) {
      const outputPathOnDisk = join(outputDirectory, outputPath);
      mkdirSync(dirname(outputPathOnDisk), { recursive: true });
      writeFileSync(outputPathOnDisk, output);
    }

    BuildLogger.success("🎉 KBR Builder completed successfully!");
  } catch (error) {
    BuildLogger.error(`HTML bundle processing failed: ${error}`);
    throw error;
  }
}
