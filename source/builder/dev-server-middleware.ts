import type { ViteDevServer } from "vite";
import type { Connect } from "vite";
import type { ServerResponse } from "node:http";
import { BuildLogger } from "./helpers.js";
import type { RenderedSite } from "./site-renderer.js";

/**
 * Serves renderer-owned documents before Vite handles assets and errors.
 */
function createProcessingMiddleware(
  server: ViteDevServer,
  getRenderedSite: () => RenderedSite
) {
  return async (
    req: Connect.IncomingMessage,
    res: ServerResponse,
    next: Connect.NextFunction
  ) => {
    const url = req.url;
    if (!url) return next();

    const cleanUrl = url.split("?")[0].split("#")[0];
    const outputPath = cleanUrl === "/" ? "index.html" : cleanUrl.slice(1);
    const output = getRenderedSite().outputs.get(outputPath);
    if (output === undefined) {
      return next();
    }

    if (outputPath.endsWith(".html")) {
      const transformed = await server.transformIndexHtml(cleanUrl, output);
      res.end(transformed);
      return;
    }

    res.end(output);
  };
}

/**
 * Sets up file watcher for template, include, and page files
 */
export function setupFileWatcher(
  server: ViteDevServer,
  rebuildRenderedSite: () => Promise<void>
) {
  let rebuildPromise: Promise<void> | undefined;
  let rebuildQueued = false;

  const handleRendererFileChange = async (filePath: string) => {
    const normalizedPath = filePath.replace(/\\/g, "/");
    if (!normalizedPath.includes("/source/site/")) {
      return;
    }

    const rendererOwned =
      normalizedPath.includes("/pages/") ||
      normalizedPath.includes("/templates/") ||
      normalizedPath.includes("/content/") ||
      normalizedPath.includes("/styles/themes/") ||
      normalizedPath.endsWith("/index.html");
    if (!rendererOwned) {
      return;
    }

    BuildLogger.info(`🔄 Renderer source changed: ${normalizedPath}`);
    rebuildQueued = true;
    if (!rebuildPromise) {
      rebuildPromise = (async () => {
        while (rebuildQueued) {
          rebuildQueued = false;
          await rebuildRenderedSite();
          server.ws.send({ type: "full-reload" });
        }
      })().finally(() => {
        rebuildPromise = undefined;
      });
    }
    await rebuildPromise;
  };

  server.watcher.on("add", (filePath) => {
    void handleRendererFileChange(filePath);
  });

  server.watcher.on("change", (filePath) => {
    void handleRendererFileChange(filePath);
  });

  server.watcher.on("unlink", (filePath) => {
    void handleRendererFileChange(filePath);
  });
}

/**
 * Main dev server setup function
 */
export function setupDevServer(
  server: ViteDevServer,
  getRenderedSite: () => RenderedSite,
  rebuildRenderedSite: () => Promise<void>
) {
  BuildLogger.info("🔧 Setting up dev server middleware for KBR Builder...");

  server.middlewares.use(createProcessingMiddleware(server, getRenderedSite));
  setupFileWatcher(server, rebuildRenderedSite);
}
