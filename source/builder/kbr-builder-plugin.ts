import type { Plugin } from "vite";
import { HtmlProcessor } from "./html-processor.js";
import { MarkdownProcessor } from "./markdown-processor.js";
import { FileSystemHelper } from "./helpers.js";
import { BuildLogger } from "./helpers.js";

/**
 * Process HTML content using the HtmlProcessor
 */
async function processHtmlContent(
  processor: HtmlProcessor,
  content: string
): Promise<string> {
  const lines = content.split("\n");
  const processedLines: string[] = [];

  for (const line of lines) {
    const processedLine = await processor.processLine(line);
    processedLines.push(processedLine);
  }

  return processedLines.join("\n");
}

/**
 * Process Markdown files in the content directory
 */
async function processMarkdownFiles(
  markdownProcessor: MarkdownProcessor
): Promise<void> {
  BuildLogger.info("📝 Processing Markdown files...");

  try {
    const contentDirectory = "source/site/content";
    const markdownFiles = FileSystemHelper.findFiles(
      contentDirectory,
      [".md"]
    );

    if (markdownFiles.length === 0) {
      BuildLogger.info("No Markdown files found");
      return;
    }

    BuildLogger.info(
      `Found ${markdownFiles.length} Markdown files to process`
    );

    for (const markdownFile of markdownFiles) {
      // Process each markdown file
      markdownProcessor.processMarkdownFile(markdownFile);
      BuildLogger.info(`✓ Processed Markdown: ${markdownFile}`);
    }
  } catch (error) {
    BuildLogger.error(`Failed to process Markdown files: ${error}`);
    throw error;
  }
}

/**
 * KBR Builder - Comprehensive Vite plugin for Kyle Blank Rollins portfolio site
 * Handles HTML includes, Markdown processing, and site generation
 */
export function kbrBuilder(): Plugin {
  const htmlProcessor = new HtmlProcessor();
  const markdownProcessor = new MarkdownProcessor();

  return {
    name: "kbr-builder",

    // Run after Vite's built-in processing but before final output
    enforce: "post",

    config(config, { command }) {
      // Debug: Log Vite configuration info
      BuildLogger.info(`🔍 Vite command: ${command}`);
      BuildLogger.info(
        `🔍 Vite root: ${config.root || process.cwd()}`
      );

      // Let Vite handle the main index.html naturally
      // We'll process all HTML files in the generateBundle hook
      const htmlFiles = [
        ...FileSystemHelper.findFiles("pages", [".html"]),
        ...FileSystemHelper.findFiles("content", [".html"]),
      ];

      BuildLogger.info(
        `📁 Found ${htmlFiles.length} additional HTML files for processing`
      );
      BuildLogger.info(`📁 Letting Vite handle index.html naturally`);
    },

    async buildStart() {
      BuildLogger.info("🚀 Starting KBR Builder...");

      // Process Markdown files at build start
      await processMarkdownFiles(markdownProcessor);
    },

    async generateBundle(_options, bundle) {
      try {
        BuildLogger.info("📄 Processing HTML files with includes...");

        // First, process any HTML files that Vite already added to the bundle
        const existingHtmlFiles = Object.keys(bundle).filter(
          (fileName) => fileName.endsWith(".html")
        );

        for (const fileName of existingHtmlFiles) {
          const htmlAsset = bundle[fileName];

          if (
            htmlAsset.type === "asset" &&
            typeof htmlAsset.source === "string"
          ) {
            try {
              // Process the HTML content with includes
              const processedContent = await processHtmlContent(
                htmlProcessor,
                htmlAsset.source
              );

              // Update the bundle with processed content
              htmlAsset.source = processedContent;

              BuildLogger.info(
                `✓ Processed existing HTML: ${fileName}`
              );
            } catch (error) {
              BuildLogger.error(
                `Failed to process ${fileName}: ${error}`
              );
              throw error;
            }
          }
        }

        // Now, manually process and add HTML files from pages/ and content/
        const additionalHtmlFiles = [
          ...FileSystemHelper.findFiles("pages", [".html"]),
          ...FileSystemHelper.findFiles("content", [".html"]),
        ];

        for (const filePath of additionalHtmlFiles) {
          try {
            // Read the HTML file
            const content = await FileSystemHelper.readFile(filePath);

            // Process it with includes
            const processedContent = await processHtmlContent(
              htmlProcessor,
              content
            );

            // Get the output filename (flatten the directory structure)
            const fileName =
              filePath.split("/").pop() || "unknown.html";

            // Add to bundle as an asset
            this.emitFile({
              type: "asset",
              fileName: fileName,
              source: processedContent,
            });

            BuildLogger.info(
              `✓ Processed additional HTML: ${fileName}`
            );
          } catch (error) {
            BuildLogger.error(
              `Failed to process ${filePath}: ${error}`
            );
            throw error;
          }
        }

        BuildLogger.success("🎉 KBR Builder completed successfully!");
      } catch (error) {
        BuildLogger.error(`generateBundle failed: ${error}`);
        throw error;
      }
    },
  };
}
