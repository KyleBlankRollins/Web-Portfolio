import type { Plugin, ViteDevServer } from "vite";
import { existsSync, readdirSync, rmSync } from "node:fs";
import { join, relative } from "node:path";
import { MarkdownProcessor } from "./markdown-processor.js";
import { BuildLogger } from "./helpers.js";
import { GitAwareBuildPipeline } from "./git-aware-pipeline.js";
import {
  loadSiteSource,
  renderSite,
  type RenderedSite,
} from "./site-renderer.js";
import { collectSiteContent } from "./site-content.js";
import { developmentSiteAssets } from "./site-assets.js";
import {
  ContentDiscovery,
  buildContentGraph,
  type ContentDiscoveryResult,
  createLocalDocumentLinkIndex,
  normalizePathForComparison,
} from "./modules/index.js";

// Import our modular components
import { setupDevServer } from "./dev-server-middleware.js";
import { writeSite } from "./html-bundle-processor.js";

/**
 * Configuration options for the KBR Builder
 */
export interface KBRBuilderOptions {
  /** Enable git-aware building to only process changed markdown files */
  gitAware?: boolean;
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
    const contentGraph = buildContentGraph(discoveryResult);
    const graphDocuments = contentGraph.renderDocuments;
    const localDocumentLinkIndex = createLocalDocumentLinkIndex(
      discoveryResult.documents,
      graphDocuments,
      discoveryResult.publishedRootPath
    );

    markdownProcessor.setLocalDocumentLinkIndex(localDocumentLinkIndex);
    markdownProcessor.resetBuildState();
    markdownProcessor.rebuildManifestFromDocuments(
      graphDocuments
    );

    let documentsToProcess = [...graphDocuments];

    BuildLogger.info(
      `🧭 Discovered ${graphDocuments.length} publishable content documents`
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

        documentsToProcess = graphDocuments.filter(
          (document) =>
            normalizedChangedPaths.has(
              normalizePathForComparison(document.sourcePath)
            ) || parentUrlsToRebuild.has(document.publicUrl)
        );
      }

      const missingOutputPaths = getMissingGeneratedOutputPaths(
        graphDocuments
      );
      if (missingOutputPaths.size > 0) {
        for (const document of graphDocuments) {
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
      graphDocuments
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

let markdownRebuildPromise: Promise<void> | undefined;

async function rebuildAllMarkdownDocuments(
  markdownProcessor: MarkdownProcessor
): Promise<void> {
  if (markdownRebuildPromise) {
    return markdownRebuildPromise;
  }

  markdownRebuildPromise = (async () => {
    const discoveryResult = new ContentDiscovery().discover();
    const contentGraph = buildContentGraph(discoveryResult);
    const graphDocuments = contentGraph.renderDocuments;
    const localDocumentLinkIndex = createLocalDocumentLinkIndex(
      discoveryResult.documents,
      graphDocuments,
      discoveryResult.publishedRootPath
    );

    markdownProcessor.setLocalDocumentLinkIndex(localDocumentLinkIndex);
    markdownProcessor.resetBuildState();
    markdownProcessor.rebuildManifestFromDocuments(
      graphDocuments
    );

    for (const document of graphDocuments) {
      markdownProcessor.processContentDocument(document);
    }

    markdownProcessor.rebuildManifestFromDocuments(
      graphDocuments
    );
  })();

  try {
    await markdownRebuildPromise;
  } finally {
    markdownRebuildPromise = undefined;
  }
}

function renderDevelopmentSite(
  markdownProcessor: MarkdownProcessor
): RenderedSite {
  const source = loadSiteSource();

  return renderSite(
    source,
    collectSiteContent(source, markdownProcessor),
    developmentSiteAssets()
  );
}

/**
 * KBR Builder plugin for HTML templating, Markdown processing, and site generation.
 */
export function kbrBuilder(options: KBRBuilderOptions = {}): Plugin {
  // Initialize processors and components
  const markdownProcessor = new MarkdownProcessor();
  let renderedSite: RenderedSite = { outputs: new Map() };

  // Set default options
  const builderOptions: KBRBuilderOptions = {
    gitAware: false,
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
      const rebuildRenderedSite = async () => {
        await rebuildAllMarkdownDocuments(markdownProcessor);
        markdownProcessor.generateBlogManifest();
        renderedSite = renderDevelopmentSite(markdownProcessor);
      };
      setupDevServer(server, () => renderedSite, rebuildRenderedSite);
    },

    /**
     * Handle hot updates for custom file types
     */
    handleHotUpdate() {
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
        renderedSite = renderDevelopmentSite(markdownProcessor);
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

    async writeBundle(options) {
      const outputDirectory = options.dir || join(process.cwd(), "dist");
      await writeSite(outputDirectory, markdownProcessor);
    },
  };
}
