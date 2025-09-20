import type { Plugin, ViteDevServer } from "vite";
import { HtmlProcessor } from "./html-processor.js";
import { MarkdownProcessor } from "./markdown-processor.js";
import { FileSystemHelper, BuildLogger } from "./helpers.js";

// Import our modular components
import { setupDevServer } from "./dev-server-middleware.js";
import { HtmlBundleProcessor } from "./html-bundle-processor.js";
import { PluginConfig } from "./plugin-config.js";

/**
 * Process all Markdown files in the content directory
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
 *
 * Architecture:
 * - PluginConfig: Handles configuration and file discovery
 * - DevServerMiddleware: Handles development server routing and processing
 * - MarkdownBuildProcessor: Handles Markdown to HTML conversion during build
 * - HtmlBundleProcessor: Handles HTML processing and bundle generation
 */
export function kbrBuilder(): Plugin {
  // Initialize processors and components
  const htmlProcessor = new HtmlProcessor();
  const markdownProcessor = new MarkdownProcessor();
  const pluginConfig = new PluginConfig();
  const htmlBundleProcessor = new HtmlBundleProcessor(htmlProcessor);

  return {
    name: "kbr-builder",
    enforce: "post",

    /**
     * Configure plugin settings and discover files
     */
    config(config, { command }) {
      pluginConfig.setupConfig(config, command);
    },

    /**
     * Setup development server middleware
     */
    configureServer(server: ViteDevServer) {
      setupDevServer(server, htmlProcessor);
    },

    /**
     * Process Markdown files at build start
     */
    async buildStart() {
      BuildLogger.info("🚀 Starting KBR Builder...");
      await processMarkdownFiles(markdownProcessor);
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
