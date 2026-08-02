import { basename, join } from "node:path";
import { readFileSync } from "node:fs";
import { FileSystemHelper, BuildLogger } from "./helpers.js";
import { TemplateProcessor } from "./template-processor.js";
import { HtmlProcessingUtils } from "./html-utils.js";
import { ThemeProcessor } from "./theme-processor.js";
import type { MarkdownProcessor } from "./markdown-processor.js";
import type { OutputBundle, PluginContext } from "rolldown";

type EmitFile = PluginContext["emitFile"];

/**
 * Handles HTML bundle generation during build
 */
export class HtmlBundleProcessor {
  private templateProcessor: TemplateProcessor;

  constructor() {
    this.templateProcessor = new TemplateProcessor();
  }

  /**
   * Process HTML files in the Vite bundle
   */
  async processBundle(
    bundle: OutputBundle,
    emitFile: EmitFile,
    markdownProcessor?: MarkdownProcessor
  ): Promise<void> {
    try {
      BuildLogger.info("📄 Processing HTML files with includes...");

      // Extract asset information from the bundle
      const assets = this.extractAssets(bundle);

      // First, emit generated HTML files from markdown processor if available
      if (markdownProcessor) {
        await this.emitGeneratedFiles(emitFile, assets, markdownProcessor);
      }

      // First, process any HTML files that Vite already added to the bundle
      await this.processExistingHtmlFiles(bundle);

      // Then, manually process and add HTML files from pages/ directory
      await this.processAdditionalHtmlFiles(emitFile, assets);

      BuildLogger.success("🎉 KBR Builder completed successfully!");
    } catch (error) {
      BuildLogger.error(`HTML bundle processing failed: ${error}`);
      throw error;
    }
  }

  /**
   * Extract CSS and JS assets from the bundle
   */
  private extractAssets(bundle: OutputBundle): {
    css: string[];
    js: string[];
  } {
    const assets = { css: [] as string[], js: [] as string[] };

    for (const fileName of Object.keys(bundle)) {
      if (fileName.startsWith("assets/")) {
        if (fileName.endsWith(".css")) {
          assets.css.push(`/${fileName}`);
        } else if (fileName.endsWith(".js")) {
          assets.js.push(`/${fileName}`);
        }
      }
    }

    return assets;
  }

  /**
   * Process HTML files already in the Vite bundle
   */
  private async processExistingHtmlFiles(bundle: OutputBundle): Promise<void> {
    const existingHtmlFiles = Object.keys(bundle).filter((fileName) =>
      fileName.endsWith(".html")
    );

    for (const fileName of existingHtmlFiles) {
      const htmlAsset = bundle[fileName];

      if (htmlAsset.type === "asset" && typeof htmlAsset.source === "string") {
        try {
          const processedContent = await HtmlProcessingUtils.processHtmlContent(
            this.templateProcessor,
            htmlAsset.source,
            {}
          );

          // Vite injected this file's assets at the source script tag's
          // position, which the template puts inside <main>. See DF-06.
          htmlAsset.source =
            HtmlProcessingUtils.normalizeAssetPlacement(processedContent);
        } catch (error) {
          BuildLogger.error(`Failed to process ${fileName}: ${error}`);
          throw error;
        }
      }
    }
  }

  /**
   * Process and add HTML files from pages/ and public/ directories
   * Pages are always processed, public/ can be git-aware for better performance
   */
  private async processAdditionalHtmlFiles(
    emitFile: EmitFile,
    assets: { css: string[]; js: string[] }
  ): Promise<void> {
    // Only process HTML files from pages/ directory now
    // Generated HTML files are handled by emitGeneratedFiles()
    const pagesFiles = FileSystemHelper.findFiles(
      join(process.cwd(), "source", "site", "pages"),
      [".html"]
    ).filter((filePath) => !basename(filePath).startsWith("_"));

    BuildLogger.info(`✓ Processing ${pagesFiles.length} pages HTML files`);

    for (const filePath of pagesFiles) {
      try {
        const content = readFileSync(filePath, "utf-8");
        const processedContent = await HtmlProcessingUtils.processHtmlContent(
          this.templateProcessor,
          content,
          { defaultTitle: "Untitled", assets }
        );

        // Get the output filename (flatten the directory structure)
        const fileName = basename(filePath);

        // Add to bundle as an asset
        emitFile({
          type: "asset",
          fileName: fileName,
          source: processedContent,
        });

        BuildLogger.info(`✓ Transformed HTML page: ${fileName}`);
      } catch (error) {
        BuildLogger.error(`Failed to process ${filePath}: ${error}`);
        throw error;
      }
    }
  }

  /**
   * Emit generated HTML files and blog manifest from MarkdownProcessor
   */
  private async emitGeneratedFiles(
    emitFile: EmitFile,
    assets: { css: string[]; js: string[] },
    markdownProcessor: MarkdownProcessor
  ): Promise<void> {
    // Emit generated HTML files
    const generatedFiles = markdownProcessor.getGeneratedFiles();

    for (const [filename, fileData] of generatedFiles) {
      try {
        const processedContent = this.removeDevelopmentEntryScript(
          await HtmlProcessingUtils.processHtmlContent(
            this.templateProcessor,
            fileData.content,
            {
              defaultTitle: fileData.metadata.title || "Untitled",
              assets,
              metadata: fileData.metadata,
            }
          )
        );

        emitFile({
          type: "asset",
          fileName: filename,
          source: processedContent,
        });

        BuildLogger.info(`✓ Emitted generated HTML: ${filename}`);
      } catch (error) {
        BuildLogger.error(
          `Failed to emit generated file ${filename}: ${error}`
        );
        throw error;
      }
    }

    // Emit blog manifest
    const manifestJson = markdownProcessor.generateBlogManifestJson();
    emitFile({
      type: "asset",
      fileName: "data/blog-manifest.json",
      source: manifestJson,
    });

    const manifest = JSON.parse(manifestJson);
    BuildLogger.info(
      `✓ Emitted blog manifest: data/blog-manifest.json (${manifest.totalPosts} posts, ${manifest.availableTags.length} tags)`
    );

    // Process and emit theme manifest
    await this.processAndEmitThemeManifest(emitFile);
  }

  private removeDevelopmentEntryScript(htmlContent: string): string {
    return htmlContent.replace(
      /\s*<script\s+type="module"\s+src="\/main\.ts"><\/script>/,
      ""
    );
  }

  /**
   * Process themes and emit theme manifest
   */
  private async processAndEmitThemeManifest(emitFile: EmitFile): Promise<void> {
    const themesDir = join("source", "site", "styles", "themes");
    const themeProcessor = new ThemeProcessor(themesDir);

    // Process all theme files
    themeProcessor.processThemes();

    // Generate and emit theme manifest
    const themeManifestJson = themeProcessor.generateThemeManifestJson();
    emitFile({
      type: "asset",
      fileName: "data/theme-manifest.json",
      source: themeManifestJson,
    });

    const themeManifest = JSON.parse(themeManifestJson);
    BuildLogger.info(
      `✓ Emitted theme manifest: data/theme-manifest.json (${themeManifest.totalThemes} themes)`
    );
  }
}
