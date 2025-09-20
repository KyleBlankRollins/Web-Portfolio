import { basename } from "path";
import { FileSystemHelper, BuildLogger } from "./helpers.js";
import {
  TemplateProcessor,
  type TemplateVariables,
} from "./template-processor.js";

/**
 * Process HTML content using the TemplateProcessor instead of the old HtmlProcessor
 */
async function processHtmlContent(
  templateProcessor: TemplateProcessor,
  content: string
): Promise<string> {
  // Extract metadata from HTML comments or existing structure
  const metadata = templateProcessor.extractMetadata(content);

  // Create template variables - if no title found, try to extract from content
  const templateVariables: TemplateVariables = {
    title:
      metadata.title ||
      extractTitleFromContent(content) ||
      "Untitled",
    description: metadata.description,
    keywords: metadata.keywords,
    additionalHead: metadata.additionalHead,
    content: "", // This will be overridden by processTemplate
  };

  return templateProcessor.processTemplate(
    content,
    templateVariables
  );
}

/**
 * Helper function to extract title from HTML content if not in metadata
 */
function extractTitleFromContent(content: string): string | null {
  // Look for h1 tags
  const h1Match = content.match(/<h1[^>]*>(.*?)<\/h1>/i);
  if (h1Match) {
    return h1Match[1].replace(/<[^>]*>/g, "").trim();
  }

  // Look for title in kbr-page-head attributes
  const titleAttrMatch = content.match(
    /title\s*=\s*["']([^"']*)["']/i
  );
  if (titleAttrMatch) {
    return titleAttrMatch[1].trim();
  }

  return null;
}

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

      // First, process any HTML files that Vite already added to the bundle
      await this.processExistingHtmlFiles(bundle);

      // Then, manually process and add HTML files from pages/ and content/
      await this.processAdditionalHtmlFiles(emitFile);

      BuildLogger.success("🎉 KBR Builder completed successfully!");
    } catch (error) {
      BuildLogger.error(`HTML bundle processing failed: ${error}`);
      throw error;
    }
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
          const processedContent = await processHtmlContent(
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
    emitFile: any
  ): Promise<void> {
    const additionalHtmlFiles = [
      ...FileSystemHelper.findFiles("pages", [".html"]),
      ...FileSystemHelper.findFiles("content", [".html"]),
    ];

    for (const filePath of additionalHtmlFiles) {
      try {
        const content = await FileSystemHelper.readFile(filePath);
        const processedContent = await processHtmlContent(
          this.templateProcessor,
          content
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
}
