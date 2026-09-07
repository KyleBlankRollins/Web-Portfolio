import type { ViteDevServer } from "vite";
import type { Connect } from "vite";
import type { ServerResponse } from "node:http";
import { BuildLogger } from "./helpers.js";
import type { RenderedSite } from "./site-renderer.js";

/**
 * Creates middleware that blocks direct access to source directories
 */
function createBlockingMiddleware() {
  return (
    req: Connect.IncomingMessage,
    res: ServerResponse,
    next: Connect.NextFunction
  ) => {
    const url = req.url;
    if (!url) return next();

    const cleanUrl = url.split("?")[0].split("#")[0];

    // Block direct access to source-content paths, including nested variants.
    if (
      cleanUrl.startsWith("/pages/") ||
      cleanUrl.startsWith("/content/") ||
      cleanUrl.startsWith("/published/")
    ) {
      sendNotFoundHtml(res);
      return;
    }

    next();
  };
}

/**
 * Creates middleware that processes HTML files with templates
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
      res.setHeader("Content-Type", "text/html");
      res.setHeader("Cache-Control", "no-cache");
      res.end(transformed);
      return;
    }

    res.setHeader("Content-Type", contentTypeForOutput(outputPath));
    res.setHeader("Cache-Control", "no-cache");
    res.end(output);
  };
}

/**
 * Sets up file watcher for template, include, and page files
 */
function setupFileWatcher(
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
      normalizedPath.includes("/data/") ||
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

function contentTypeForOutput(outputPath: string): string {
  if (outputPath.endsWith(".json")) {
    return "application/json";
  }
  if (outputPath.endsWith(".css")) {
    return "text/css";
  }
  if (outputPath.endsWith(".js")) {
    return "text/javascript";
  }
  return "application/octet-stream";
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

  // Add blocking middleware first
  server.middlewares.use(createBlockingMiddleware());

  // Add processing middleware second
  server.middlewares.use(createProcessingMiddleware(server, getRenderedSite));

  // Setup file watcher
  setupFileWatcher(server, rebuildRenderedSite);
}

function sendNotFoundHtml(res: ServerResponse): void {
  res.statusCode = 404;
  res.setHeader("Content-Type", "text/html");
  res.end(`
    <!DOCTYPE html>
    <html>
      <head><title>404 - Not Found</title></head>
      <body>
        <h1>404 - Not Found</h1>
        <p>The requested resource was not found.</p>
        <p><a href="/">Return to home</a></p>
      </body>
    </html>
  `);
}
