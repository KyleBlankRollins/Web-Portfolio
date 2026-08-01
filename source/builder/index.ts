import type { Plugin, ViteDevServer } from "vite";
import { existsSync, readdirSync, rmSync } from "fs";
import { join, relative } from "path";
import { MarkdownProcessor } from "./markdown-processor.js";
import { TemplateProcessor } from "./template-processor.js";
import { BuildLogger } from "./helpers.js";
import { GitAwareBuildPipeline } from "./git-aware-pipeline.js";
import {
  ContentDiscovery,
  type ContentDiscoveryResult,
  createLocalDocumentLinkIndex,
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
    const contentDiscovery = new ContentDiscovery();
    const discoveryResult = contentDiscovery.discover();
    const localDocumentLinkIndex = createLocalDocumentLinkIndex(
      discoveryResult.documents,
      discoveryResult.publishableDocuments,
      discoveryResult.publishedRootPath
    );

    markdownProcessor.setLocalDocumentLinkIndex(localDocumentLinkIndex);
    markdownProcessor.resetBuildState();
    markdownProcessor.rebuildManifestFromDocuments(
      discoveryResult.publishableDocuments
    );

    let documentsToProcess = [...discoveryResult.publishableDocuments];

    BuildLogger.info(
      `🧭 Discovered ${discoveryResult.publishableDocuments.length} publishable content documents`
    );

    if (discoveryResult.supplementCandidates.length > 0) {
      BuildLogger.info(
        `ℹ️ Found ${discoveryResult.supplementCandidates.length} supplement candidates (${discoveryResult.publishedSupplements.length} published)`
      );
    }

    if (pipeline.isIncrementalMode()) {
      const changedMarkdownPaths = pipeline.getChangedMarkdownPaths();

      if (changedMarkdownPaths.length === 0) {
        documentsToProcess = [];
      } else {
        const normalizedChangedPaths = new Set(
          changedMarkdownPaths.map((filePath) =>
            normalizePathForComparison(filePath)
          )
        );

        const parentUrlsToRebuild = new Set<string>();

        for (const supplement of discoveryResult.supplementCandidates) {
          const isChanged = normalizedChangedPaths.has(
            normalizePathForComparison(supplement.sourcePath)
          );

          if (isChanged && supplement.parentUrl) {
            parentUrlsToRebuild.add(supplement.parentUrl);
          }
        }

        for (const changedPath of changedMarkdownPaths) {
          const inferredParentUrl = inferParentUrlFromSupplementPath(
            changedPath,
            discoveryResult.publishedRootPath
          );

          if (inferredParentUrl) {
            parentUrlsToRebuild.add(inferredParentUrl);
          }
        }

        documentsToProcess = discoveryResult.publishableDocuments.filter(
          (document) =>
            normalizedChangedPaths.has(
              normalizePathForComparison(document.sourcePath)
            ) || parentUrlsToRebuild.has(document.publicUrl)
        );
      }

      const missingOutputPaths = getMissingGeneratedOutputPaths(
        discoveryResult.publishableDocuments
      );
      if (missingOutputPaths.size > 0) {
        for (const document of discoveryResult.publishableDocuments) {
          if (missingOutputPaths.has(document.outputPath)) {
            documentsToProcess.push(document);
          }
        }
      }

      documentsToProcess = dedupeDocumentsBySourcePath(documentsToProcess);

      cleanupStaleGeneratedHtmlOutputs(discoveryResult);

      BuildLogger.info(
        `⚡ Git-aware mode: processing ${documentsToProcess.length} markdown documents`
      );
    } else if (!pipeline.shouldProcessMarkdown()) {
      documentsToProcess = [];
    }

    if (documentsToProcess.length === 0) {
      BuildLogger.info(
        "⚡ No markdown document regeneration required for this build"
      );
      return;
    }

    BuildLogger.info(
      `📝 Processing Markdown files: ${documentsToProcess.length}`
    );

    for (const document of documentsToProcess) {
      markdownProcessor.processContentDocument(document);
    }

    markdownProcessor.rebuildManifestFromDocuments(
      discoveryResult.publishableDocuments
    );
  } catch (error) {
    BuildLogger.error(`Failed to process Markdown files: ${error}`);
    throw error;
  }
}

function dedupeDocumentsBySourcePath(
  documents: ContentDiscoveryResult["publishableDocuments"]
): ContentDiscoveryResult["publishableDocuments"] {
  const seenSourcePaths = new Set<string>();
  const deduped: ContentDiscoveryResult["publishableDocuments"] = [];

  for (const document of documents) {
    const normalizedSourcePath = normalizePathForOutput(document.sourcePath);
    if (seenSourcePaths.has(normalizedSourcePath)) {
      continue;
    }

    seenSourcePaths.add(normalizedSourcePath);
    deduped.push(document);
  }

  return deduped;
}

function inferParentUrlFromSupplementPath(
  markdownPath: string,
  publishedRootPath: string
): string | undefined {
  const normalizedRelativePath = normalizePathForOutput(
    relative(publishedRootPath, markdownPath)
  );

  if (
    normalizedRelativePath.startsWith("../") ||
    normalizedRelativePath === ".."
  ) {
    return undefined;
  }

  const pathSegments = normalizedRelativePath.split("/");
  if (pathSegments.length < 3) {
    return undefined;
  }

  if (pathSegments[1] !== "supplements") {
    return undefined;
  }

  return `/${pathSegments[0]}.html`;
}

function getMissingGeneratedOutputPaths(
  documents: ContentDiscoveryResult["publishableDocuments"]
): Set<string> {
  const missingOutputPaths = new Set<string>();
  const distRoot = join(process.cwd(), "dist");

  for (const document of documents) {
    const outputFilePath = join(distRoot, document.outputPath);
    if (!existsSync(outputFilePath)) {
      missingOutputPaths.add(document.outputPath);
    }
  }

  if (missingOutputPaths.size > 0) {
    BuildLogger.info(
      `📄 Found ${missingOutputPaths.size} missing generated HTML outputs in dist`
    );
  }

  return missingOutputPaths;
}

function cleanupStaleGeneratedHtmlOutputs(
  discoveryResult: ContentDiscoveryResult
): void {
  const distRoot = join(process.cwd(), "dist");
  if (!existsSync(distRoot)) {
    return;
  }

  const expectedHtmlPaths = new Set<string>([
    "index.html",
    ...getPageHtmlOutputPaths(),
    ...discoveryResult.publishableDocuments.map(
      (document) => document.outputPath
    ),
  ]);

  const distHtmlPaths = collectDistHtmlPaths(distRoot, distRoot);
  for (const distHtmlPath of distHtmlPaths) {
    if (expectedHtmlPaths.has(distHtmlPath)) {
      continue;
    }

    const absolutePath = join(distRoot, distHtmlPath);
    rmSync(absolutePath, { force: true });
    BuildLogger.info(`🧹 Removed stale generated HTML: ${distHtmlPath}`);
  }
}

function getPageHtmlOutputPaths(): string[] {
  const pagesRoot = join(process.cwd(), "source", "site", "pages");
  if (!existsSync(pagesRoot)) {
    return [];
  }

  const entries = readdirSync(pagesRoot, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".html"))
    .map((entry) => entry.name)
    .sort();
}

function collectDistHtmlPaths(
  directoryPath: string,
  rootPath: string
): string[] {
  const htmlPaths: string[] = [];
  const entries = readdirSync(directoryPath, { withFileTypes: true });

  for (const entry of entries) {
    const absolutePath = join(directoryPath, entry.name);

    if (entry.isDirectory()) {
      htmlPaths.push(...collectDistHtmlPaths(absolutePath, rootPath));
      continue;
    }

    if (!entry.isFile() || !entry.name.endsWith(".html")) {
      continue;
    }

    htmlPaths.push(normalizePathForOutput(relative(rootPath, absolutePath)));
  }

  return htmlPaths;
}

function normalizePathForOutput(pathValue: string): string {
  return pathValue.replace(/\\/g, "/");
}

async function rebuildAllMarkdownDocuments(
  markdownProcessor: MarkdownProcessor
): Promise<void> {
  const discoveryResult = new ContentDiscovery().discover();
  const localDocumentLinkIndex = createLocalDocumentLinkIndex(
    discoveryResult.documents,
    discoveryResult.publishableDocuments,
    discoveryResult.publishedRootPath
  );

  markdownProcessor.setLocalDocumentLinkIndex(localDocumentLinkIndex);
  markdownProcessor.resetBuildState();
  markdownProcessor.rebuildManifestFromDocuments(
    discoveryResult.publishableDocuments
  );

  for (const document of discoveryResult.publishableDocuments) {
    markdownProcessor.processContentDocument(document);
  }

  markdownProcessor.rebuildManifestFromDocuments(
    discoveryResult.publishableDocuments
  );
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
  let isDevelopmentServer = false;

  return {
    name: "kbr-builder",
    enforce: "post",

    /**
     * Setup development server middleware
     */
    configureServer(server: ViteDevServer) {
      isDevelopmentServer = true;
      setupDevServer(server, templateProcessor, markdownProcessor, async () => {
        await rebuildAllMarkdownDocuments(markdownProcessor);
      });
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

      if (isDevelopmentServer) {
        BuildLogger.info(
          "🧪 Development server mode: rebuilding all markdown documents"
        );
        await rebuildAllMarkdownDocuments(markdownProcessor);
        markdownProcessor.generateBlogManifest();
        return;
      }

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
