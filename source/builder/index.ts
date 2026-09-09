import type { Plugin, ViteDevServer } from "vite";
import { MarkdownProcessor } from "./markdown-processor.js";
import { BuildLogger } from "./helpers.js";
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
  createLocalDocumentLinkIndex,
} from "./modules/index.js";

// Import our modular components
import { setupDevServer } from "./dev-server-middleware.js";

/**
 * Configuration options for the KBR Builder
 */
/**
 * Process Markdown files in the content directory
 */
export async function processMarkdownFiles(
  markdownProcessor: MarkdownProcessor
): Promise<void> {
  BuildLogger.info("🔎 Discovering Markdown files...");

  try {
    await processDiscoveredMarkdownDocuments(markdownProcessor, true);
  } catch (error) {
    BuildLogger.error(`Failed to process Markdown files: ${error}`);
    throw error;
  }
}

async function rebuildAllMarkdownDocuments(
  markdownProcessor: MarkdownProcessor
): Promise<void> {
  await processDiscoveredMarkdownDocuments(markdownProcessor, false);
}

async function processDiscoveredMarkdownDocuments(
  markdownProcessor: MarkdownProcessor,
  logDiscovery: boolean
): Promise<void> {
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
  markdownProcessor.rebuildManifestFromDocuments(graphDocuments);

  if (logDiscovery) {
    BuildLogger.info(
      `🧭 Discovered ${graphDocuments.length} publishable content documents`
    );
    if (discoveryResult.supplementCandidates.length > 0) {
      BuildLogger.info(
        `ℹ️ Found ${discoveryResult.supplementCandidates.length} supplement candidates (${discoveryResult.publishedSupplements.length} published)`
      );
    }
    BuildLogger.info(`📝 Processing Markdown files: ${graphDocuments.length}`);
  }

  for (const document of graphDocuments) {
    markdownProcessor.processContentDocument(document);
  }

  markdownProcessor.rebuildManifestFromDocuments(graphDocuments);
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
export function kbrBuilder(): Plugin {
  // Initialize processors and components
  const markdownProcessor = new MarkdownProcessor();
  let renderedSite: RenderedSite = { outputs: new Map() };

  return {
    name: "kbr-builder",
    enforce: "post",

    /**
     * Setup development server middleware
     */
    configureServer(server: ViteDevServer) {
      const rebuildRenderedSite = async () => {
        await rebuildAllMarkdownDocuments(markdownProcessor);
        markdownProcessor.generateBlogManifest();
        renderedSite = renderDevelopmentSite(markdownProcessor);
      };
      setupDevServer(server, () => renderedSite, rebuildRenderedSite);
      return async () => {
        await rebuildRenderedSite();
      };
    },
  };
}
