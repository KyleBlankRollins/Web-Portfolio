import type { Plugin, ViteDevServer } from "vite";
import { join } from "path";
import { MarkdownProcessor } from "./markdown-processor.js";
import { TemplateProcessor } from "./template-processor.js";
import { FileSystemHelper, BuildLogger } from "./helpers.js";

// Import our modular components
import { setupDevServer } from "./dev-server-middleware.js";
import { HtmlBundleProcessor } from "./html-bundle-processor.js";

/**
 * Process all Markdown files in the content directory
 */
async function processMarkdownFiles(
  markdownProcessor: MarkdownProcessor
): Promise<void> {
  BuildLogger.info("🔎 Discovering Markdown files...");

  try {
    const contentDirectory = join("source", "site", "content");
    const markdownFiles = FileSystemHelper.findFiles(
      contentDirectory,
      [".md"],
      ["__drafts"] // Exclude drafts directory from production build
    );

    if (markdownFiles.length === 0) {
      BuildLogger.info("No Markdown files found");
      return;
    }

    BuildLogger.info(
      `📝 Processing Markdown files: ${markdownFiles.length}`
    );

    for (const markdownFile of markdownFiles) {
      markdownProcessor.processMarkdownFile(markdownFile);
    }
  } catch (error) {
    BuildLogger.error(`Failed to process Markdown files: ${error}`);
    throw error;
  }
}

/**
 * KBR Builder - Comprehensive Vite plugin for Kyle Blank Rollins portfolio site
 * Handles HTML includes, Markdown processing, and site generation
 *
 * Architecture:
 * - PluginConfig: Handles configuration and file discovery
 * - DevServerMiddleware: Handles development server routing and processing
 * - MarkdownBuildProcessor: Handles Markdown to HTML conversion during build
 * - HtmlBundleProcessor: Handles HTML processing and bundle generation
 */
export function kbrBuilder(): Plugin {
  // Initialize processors and components
  const markdownProcessor = new MarkdownProcessor();
  const htmlBundleProcessor = new HtmlBundleProcessor();
  const templateProcessor = new TemplateProcessor();

  return {
    name: "kbr-builder",
    enforce: "post",

    /**
     * Setup development server middleware
     */
    configureServer(server: ViteDevServer) {
      setupDevServer(server, templateProcessor);
    },

    /**
     * Handle hot updates for custom file types
     */
    handleHotUpdate({ file, server }) {
      if (file.includes("/pages/") && file.endsWith(".html")) {
        BuildLogger.info(`🔄 Page file changed: ${file}`);
        templateProcessor.clearCache();

        // Trigger full reload for page changes
        server.ws.send({
          type: "full-reload",
        });

        // Return empty array to prevent default handling
        return [];
      }

      if (
        file.includes("/templates/") ||
        file.includes("/includes/")
      ) {
        BuildLogger.info(`🔄 Template/Include file changed: ${file}`);
        templateProcessor.clearCache();

        // Trigger full reload for template/include changes
        server.ws.send({
          type: "full-reload",
        });

        return [];
      }

      // Let Vite handle other file types normally
      return undefined;
    },

    /**
     * Process Markdown files at build start
     */
    async buildStart() {
      BuildLogger.info("🚀 Starting KBR Builder...");
      await processMarkdownFiles(markdownProcessor);

      // Generate blog post manifest after processing all markdown files
      markdownProcessor.generateBlogManifest();
    },

    /**
     * Process HTML files and generate final bundle
     */
    async generateBundle(_options, bundle) {
      await htmlBundleProcessor.processBundle(
        bundle,
        this.emitFile.bind(this)
      );
    },
  };
}
