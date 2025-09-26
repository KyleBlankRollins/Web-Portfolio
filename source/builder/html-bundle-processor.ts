import { basename, join } from "path";
import { readFileSync, existsSync, readdirSync } from "fs";
import { FileSystemHelper, BuildLogger } from "./helpers.js";
import { TemplateProcessor } from "./template-processor.js";
import { HtmlProcessingUtils } from "./html-utils.js";
import { GitUtils } from "./git-utils.js";
import type { KBRBuilderOptions } from "./index.js";

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
    bundle: any,
    emitFile: any,
    options: KBRBuilderOptions = {}
  ): Promise<void> {
    try {
      BuildLogger.info("📄 Processing HTML files with includes...");

      // Extract asset information from the bundle
      const assets = this.extractAssets(bundle);

      // First, process any HTML files that Vite already added to the bundle
      await this.processExistingHtmlFiles(bundle);

      // Then, manually process and add HTML files from pages/ and content/
      await this.processAdditionalHtmlFiles(
        emitFile,
        assets,
        options
      );

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
   * Process and add HTML files from pages/ and public/ directories
   * Pages are always processed, public/ can be git-aware for better performance
   */
  private async processAdditionalHtmlFiles(
    emitFile: any,
    assets: { css: string[]; js: string[] },
    options: KBRBuilderOptions = {}
  ): Promise<void> {
    let additionalHtmlFiles: string[] = [];

    // Always process all HTML files from pages/ directory
    const pagesFiles = FileSystemHelper.findFiles("pages", [".html"]);
    additionalHtmlFiles.push(...pagesFiles);

    // For public/ directory files, always process blog posts + use git-aware logic for others
    const allPublicFiles = this.findPublicHtmlFiles();

    if (
      options.gitAware &&
      !options.forceAll &&
      GitUtils.isGitRepository()
    ) {
      // Always include blog posts (files with isBlogPost metadata)
      const blogPosts = this.filterBlogPosts(allPublicFiles);

      // Get changed HTML files from public/ directory only
      const changedPublicFiles =
        GitUtils.getChangedHtmlFiles().filter((file) =>
          file.includes("/public/")
        );

      // Combine blog posts with changed files (remove duplicates)
      const publicFilesToProcess = [
        ...blogPosts,
        ...changedPublicFiles.filter(
          (file) => !blogPosts.includes(file)
        ),
      ];

      additionalHtmlFiles.push(...publicFilesToProcess);

      BuildLogger.info(
        `⚡ Git-aware mode: processing ${pagesFiles.length} pages files + ${blogPosts.length} blog posts + ${changedPublicFiles.length} changed public files`
      );
    } else {
      // Process all HTML files from public/ directory
      additionalHtmlFiles.push(...allPublicFiles);

      if (options.gitAware && options.forceAll) {
        BuildLogger.info(
          "🔧 Git-aware mode with --force-all: processing all HTML files"
        );
      } else if (!GitUtils.isGitRepository()) {
        BuildLogger.info(
          "📝 Not a git repository: processing all HTML files"
        );
      } else {
        BuildLogger.info(
          "📝 Standard mode: processing all HTML files"
        );
      }
    }

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
   * Find HTML files in the root public/ directory
   */
  private findPublicHtmlFiles(): string[] {
    const publicDir = "public";
    const files: string[] = [];

    if (!existsSync(publicDir)) {
      return files;
    }

    const entries = readdirSync(publicDir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isFile() && entry.name.endsWith(".html")) {
        files.push(join(publicDir, entry.name));
      }
    }

    return files;
  }

  /**
   * Filter HTML files to identify blog posts (files with isBlogPost metadata)
   */
  private filterBlogPosts(htmlFiles: string[]): string[] {
    const blogPosts: string[] = [];

    for (const filePath of htmlFiles) {
      try {
        const content = readFileSync(filePath, "utf-8");
        const { metadata } =
          this.templateProcessor.extractMetadata(content);

        if (metadata.isBlogPost) {
          blogPosts.push(filePath);
        }
      } catch (error) {
        // Skip files that can't be read
        BuildLogger.error(
          `Failed to check blog post status for ${filePath}: ${error}`
        );
      }
    }

    return blogPosts;
  }
}
