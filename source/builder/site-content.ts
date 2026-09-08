import type { MarkdownProcessor } from "./markdown-processor.js";
import { ThemeProcessor } from "./theme-processor.js";
import type {
  LoadedSiteSource,
  RenderableSiteContent,
} from "./site-renderer.js";
import type { TemplateVariables } from "./template-processor.js";
import {
  buildBlogStaticModel,
  buildHomeStaticModel,
  buildSeriesStaticModel,
  buildSupplementStaticModel,
  buildTimelineStaticModel,
} from "./static-content.js";

export function collectSiteContent(
  source: LoadedSiteSource,
  markdownProcessor: MarkdownProcessor
): RenderableSiteContent[] {
  const content: RenderableSiteContent[] = [];
  const blogManifestJson = markdownProcessor.generateBlogManifestJson();
  const blogManifest = JSON.parse(blogManifestJson);
  const experienceData = JSON.parse(source.experienceData);
  const pageMetadata = new Map<string, Partial<TemplateVariables>>([
    [
      "career.html",
      { timelineCompanies: buildTimelineStaticModel(experienceData) },
    ],
    ["blog.html", { ...buildBlogStaticModel(blogManifest) }],
    ["index.html", { ...buildHomeStaticModel(blogManifest, experienceData) }],
  ]);

  for (const [outputPath, pageContent] of source.pages) {
    if (outputPath.replace(/\\/g, "/").split("/").pop()?.startsWith("_")) {
      continue;
    }
    content.push({
      outputPath,
      content: pageContent,
      metadata: pageMetadata.get(outputPath),
    });
  }

  for (const generatedFile of markdownProcessor.getGeneratedFiles().values()) {
    const series = generatedFile.metadata.series;
    const supplements = generatedFile.metadata.supplements;
    content.push({
      outputPath: generatedFile.filename,
      content: generatedFile.content,
      metadata: {
        ...generatedFile.metadata,
        ...(series
          ? {
              ...buildSeriesStaticModel(
                blogManifestJson,
                series.name,
                series.part
              ),
            }
          : {}),
        ...(buildSupplementStaticModel(supplements) ?? {}),
      },
    });
  }

  content.push({
    outputPath: "data/blog-manifest.json",
    content: blogManifestJson,
    kind: "raw",
  });

  const themeProcessor = new ThemeProcessor();
  themeProcessor.processThemeSources(source.themes ?? new Map());
  content.push({
    outputPath: "data/theme-manifest.json",
    content: themeProcessor.generateThemeManifestJson(),
    kind: "raw",
  });

  return content;
}
