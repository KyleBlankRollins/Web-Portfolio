import type { Plugin, ViteDevServer } from "vite";
import { MarkdownProcessor } from "./markdown-processor.js";
import { TemplateProcessor } from "./template-processor.js";
import { BuildLogger } from "./helpers.js";
import { GitAwareBuildPipeline } from "./git-aware-pipeline.js";
import {
  ContentDiscovery,
  normalizePathForComparison,
} from "./modules/index.js";

// Import our modular components
import { setupDevServer } from "./dev-server-middleware.js";
import { HtmlBundleProcessor } from "./html-bundle-processor.js";

/**
 * Configuration options for the KBR Builder
 */
export interface KBRBuilderOptions {
  /** Enable git-aware building to only process changed markdown files */
  gitAware?: boolean;
  /** Base branch to compare against when using git-aware mode */
  baseBranch?: string;
  /** Force processing of all files regardless of git status */
  forceAll?: boolean;
}

/**
 * Process Markdown files in the content directory
 * Uses the git-aware pipeline to determine what files to process
 */
async function processMarkdownFiles(
  markdownProcessor: MarkdownProcessor,
  pipeline: GitAwareBuildPipeline
): Promise<void> {
  BuildLogger.info("🔎 Discovering Markdown files...");

  try {
    if (!pipeline.shouldProcessMarkdown()) {
      BuildLogger.info(
        "⚡ No changed markdown files detected - skipping processing"
      );
      return;
    }

    const contentDiscovery = new ContentDiscovery();
    const discoveryResult = contentDiscovery.discover();
    let publishableDocuments = discoveryResult.publishableDocuments;

    BuildLogger.info(
      `🧭 Discovered ${publishableDocuments.length} publishable content documents`
    );

    if (discoveryResult.supplementCandidates.length > 0) {
      BuildLogger.info(
        `ℹ️ Found ${discoveryResult.supplementCandidates.length} supplement candidates (not emitted in phase 1)`
      );
    }

    // Get changed files if in git-aware mode, otherwise process all
    const changedMarkdownFiles = pipeline.getChangedMarkdownFiles();
    if (changedMarkdownFiles.length > 0) {
      const normalizedChangedFiles = new Set(
        changedMarkdownFiles.map((filePath) =>
          normalizePathForComparison(filePath)
        )
      );

      publishableDocuments = publishableDocuments.filter((document) =>
        normalizedChangedFiles.has(
          normalizePathForComparison(document.sourcePath)
        )
      );

      BuildLogger.info(
        `⚡ Git-aware mode: processing ${publishableDocuments.length} changed published documents`
      );
    }

    if (publishableDocuments.length === 0) {
      BuildLogger.info("No Markdown files found");
      return;
    }

    BuildLogger.info(
      `📝 Processing Markdown files: ${publishableDocuments.length}`
    );

    for (const document of publishableDocuments) {
      markdownProcessor.processContentDocument(document);
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
export function kbrBuilder(options: KBRBuilderOptions = {}): Plugin {
  // Initialize processors and components
  const markdownProcessor = new MarkdownProcessor();
  const htmlBundleProcessor = new HtmlBundleProcessor();
  const templateProcessor = new TemplateProcessor();

  // Set default options
  const builderOptions: KBRBuilderOptions = {
    gitAware: false,
    baseBranch: "main",
    forceAll: false,
    ...options,
  };

  // Initialize the git-aware pipeline
  const pipeline = new GitAwareBuildPipeline(builderOptions);

  return {
    name: "kbr-builder",
    enforce: "post",

    /**
     * Setup development server middleware
     */
    configureServer(server: ViteDevServer) {
      setupDevServer(server, templateProcessor, markdownProcessor);
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

      if (file.includes("/templates/") || file.includes("/includes/")) {
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

      // Log the build strategy
      pipeline.logBuildStrategy();

      // Process markdown files using the git-aware pipeline
      await processMarkdownFiles(markdownProcessor, pipeline);

      // Generate blog post manifest only if needed
      if (pipeline.shouldGenerateBlogManifest()) {
        markdownProcessor.generateBlogManifest();
      } else {
        BuildLogger.info(
          "⚡ No markdown changes detected - skipping blog manifest generation"
        );
      }
    },

    /**
     * Process HTML files and generate final bundle
     */
    async generateBundle(_options, bundle) {
      await htmlBundleProcessor.processBundle(
        bundle,
        this.emitFile.bind(this),
        markdownProcessor // Pass the processor for accessing generated files
      );
    },
  };
}
