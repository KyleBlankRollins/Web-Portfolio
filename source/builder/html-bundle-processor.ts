import { basename } from "path";
import { readFileSync } from "fs";
import { FileSystemHelper, BuildLogger } from "./helpers.js";
import { TemplateProcessor } from "./template-processor.js";
import { HtmlProcessingUtils } from "./html-utils.js";

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
  async processBundle(bundle: any, emitFile: any): Promise<void> {
    try {
      BuildLogger.info("📄 Processing HTML files with includes...");

      // Extract asset information from the bundle
      const assets = this.extractAssets(bundle);

      // Copy blog manifest file to output
      await this.copyBlogManifest(emitFile);

      // First, process any HTML files that Vite already added to the bundle
      await this.processExistingHtmlFiles(bundle);

      // Then, manually process and add HTML files from pages/ and content/
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
  private extractAssets(bundle: any): {
    css: string[];
    js: string[];
  } {
    const assets = { css: [] as string[], js: [] as string[] };

    for (const fileName of Object.keys(bundle)) {
      if (fileName.startsWith("assets/")) {
        if (fileName.endsWith(".css")) {
          assets.css.push(`./${fileName}`);
        } else if (fileName.endsWith(".js")) {
          assets.js.push(`./${fileName}`);
        }
      }
    }

    return assets;
  }

  /**
   * Process HTML files already in the Vite bundle
   */
  private async processExistingHtmlFiles(bundle: any): Promise<void> {
    const existingHtmlFiles = Object.keys(bundle).filter((fileName) =>
      fileName.endsWith(".html")
    );

    for (const fileName of existingHtmlFiles) {
      const htmlAsset = bundle[fileName];

      if (
        htmlAsset.type === "asset" &&
        typeof htmlAsset.source === "string"
      ) {
        try {
          const processedContent =
            await HtmlProcessingUtils.processHtmlContent(
              this.templateProcessor,
              htmlAsset.source
            );

          htmlAsset.source = processedContent;
        } catch (error) {
          BuildLogger.error(
            `Failed to process ${fileName}: ${error}`
          );
          throw error;
        }
      }
    }
  }

  /**
   * Process and add HTML files from pages/ and content/ directories
   */
  private async processAdditionalHtmlFiles(
    emitFile: any,
    assets: { css: string[]; js: string[] }
  ): Promise<void> {
    const additionalHtmlFiles = [
      ...FileSystemHelper.findFiles("pages", [".html"]),
      ...FileSystemHelper.findFiles("content", [".html"]),
    ];

    for (const filePath of additionalHtmlFiles) {
      try {
        const content = readFileSync(filePath, "utf-8");
        const processedContent =
          await HtmlProcessingUtils.processHtmlContent(
            this.templateProcessor,
            content,
            "Untitled",
            assets
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
   * Copy blog manifest file to output directory
   */
  private async copyBlogManifest(emitFile: any): Promise<void> {
    try {
      const manifestPath = "source/site/blog-manifest.json";
      const content = readFileSync(manifestPath, "utf-8");

      // Add to bundle as an asset
      emitFile({
        type: "asset",
        fileName: "blog-manifest.json",
        source: content,
      });

      BuildLogger.info("✓ Copied blog-manifest.json to output");
    } catch (error) {
      BuildLogger.error(
        `Failed to copy blog-manifest.json: ${error}`
      );
      throw error;
    }
  }
}
