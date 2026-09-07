import { join } from "node:path";
import type { MarkdownProcessor } from "./markdown-processor.js";
import { ThemeProcessor } from "./theme-processor.js";
import type { LoadedSiteSource, RenderableSiteContent } from "./site-renderer.js";

export function collectSiteContent(
  source: LoadedSiteSource,
  markdownProcessor: MarkdownProcessor
): RenderableSiteContent[] {
  const content: RenderableSiteContent[] = [];

  for (const [outputPath, pageContent] of source.pages) {
    if (outputPath.replace(/\\/g, "/").split("/").pop()?.startsWith("_")) {
      continue;
    }
    content.push({ outputPath, content: pageContent });
  }

  for (const generatedFile of markdownProcessor.getGeneratedFiles().values()) {
    content.push({
      outputPath: generatedFile.filename,
      content: generatedFile.content,
      metadata: generatedFile.metadata,
    });
  }

  content.push({
    outputPath: "data/blog-manifest.json",
    content: markdownProcessor.generateBlogManifestJson(),
    kind: "raw",
  });

  const themeProcessor = new ThemeProcessor(
    join(process.cwd(), "source", "site", "styles", "themes")
  );
  themeProcessor.processThemes();
  content.push({
    outputPath: "data/theme-manifest.json",
    content: themeProcessor.generateThemeManifestJson(),
    kind: "raw",
  });

  return content;
}