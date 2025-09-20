import type { ViteDevServer } from "vite";
import * as fs from "fs";
import * as path from "path";
import { marked } from "marked";
import { HtmlProcessor } from "./html-processor.js";
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
 * Creates middleware that blocks direct access to source directories
 */
function createBlockingMiddleware() {
  return (req: any, res: any, next: any) => {
    const url = req.url;
    if (!url) return next();

    // Block direct access to pages/ and content/ directories
    if (url.startsWith("/pages/") || url.startsWith("/content/")) {
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
      return;
    }

    next();
  };
}

/**
 * Creates middleware that processes HTML files with includes
 */
function createProcessingMiddleware(htmlProcessor: HtmlProcessor) {
  return (req: any, res: any, next: any) => {
    const url = req.url;
    if (!url) return next();

    // Handle root index.html
    if (url === "/" || url === "/index.html") {
      return handleIndexRequest(htmlProcessor, req, res, next);
    }

    // Handle HTML files at root level (matching production build structure)
    if (url.match(/^\/[^/]+\.html$/)) {
      return handleHtmlRequest(htmlProcessor, url, req, res, next);
    }

    next();
  };
}

/**
 * Handle requests for the root index.html
 */
async function handleIndexRequest(
  htmlProcessor: HtmlProcessor,
  _req: any,
  res: any,
  next: any
) {
  const indexPath = path.join(
    process.cwd(),
    "source/site/index.html"
  );

  if (fs.existsSync(indexPath)) {
    try {
      const content = fs.readFileSync(indexPath, "utf-8");
      const processedContent = await processHtmlContent(
        htmlProcessor,
        content
      );

      res.setHeader("Content-Type", "text/html");
      res.setHeader("Cache-Control", "no-cache");
      res.end(processedContent);
    } catch (error) {
      BuildLogger.error(`Error processing index.html: ${error}`);
      next(error);
    }
  } else {
    next();
  }
}

/**
 * Handle requests for HTML files at root level
 */
async function handleHtmlRequest(
  htmlProcessor: HtmlProcessor,
  url: string,
  _req: any,
  res: any,
  next: any
) {
  const fileName = url.slice(1); // Remove leading slash
  const rootDir = path.join(process.cwd(), "source/site");

  // Try pages/ directory first
  const pageFilePath = path.join(rootDir, "pages", fileName);
  if (fs.existsSync(pageFilePath)) {
    return await processAndServeFile(
      htmlProcessor,
      pageFilePath,
      res,
      next
    );
  }

  // Try content/ directory for converted HTML
  const contentHtmlPath = path.join(rootDir, "content", fileName);
  if (fs.existsSync(contentHtmlPath)) {
    return await processAndServeFile(
      htmlProcessor,
      contentHtmlPath,
      res,
      next
    );
  }

  // Finally, check for corresponding .md file in content/ directory
  const mdFileName = fileName.replace(".html", ".md");
  const mdFilePath = path.join(rootDir, "content", mdFileName);
  if (fs.existsSync(mdFilePath)) {
    return await processAndServeMarkdown(
      htmlProcessor,
      mdFilePath,
      res,
      next
    );
  }

  next();
}

/**
 * Process and serve an HTML file
 */
async function processAndServeFile(
  htmlProcessor: HtmlProcessor,
  filePath: string,
  res: any,
  next: any
) {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const processedContent = await processHtmlContent(
      htmlProcessor,
      content
    );

    res.setHeader("Content-Type", "text/html");
    res.setHeader("Cache-Control", "no-cache");
    res.end(processedContent);
  } catch (error) {
    BuildLogger.error(`Error processing ${filePath}: ${error}`);
    next(error);
  }
}

/**
 * Process and serve a Markdown file as HTML
 */
async function processAndServeMarkdown(
  htmlProcessor: HtmlProcessor,
  mdFilePath: string,
  res: any,
  next: any
) {
  try {
    const mdContent = fs.readFileSync(mdFilePath, "utf-8");
    const htmlContent = marked(mdContent);
    const processedContent = await processHtmlContent(
      htmlProcessor,
      htmlContent
    );

    res.setHeader("Content-Type", "text/html");
    res.setHeader("Cache-Control", "no-cache");
    res.end(processedContent);
  } catch (error) {
    BuildLogger.error(
      `Error processing markdown ${mdFilePath}: ${error}`
    );
    next(error);
  }
}

/**
 * Sets up file watcher for include files
 */
function setupFileWatcher(
  server: ViteDevServer,
  htmlProcessor: HtmlProcessor
) {
  server.ws.on("file-changed", ({ file }) => {
    if (file.includes("/includes/")) {
      BuildLogger.info(`🔄 Include file changed: ${file}`);
      htmlProcessor.clearCache();

      // Trigger a full page reload for include changes since they affect multiple pages
      server.ws.send({
        type: "full-reload",
      });
    }
  });
}

/**
 * Main dev server setup function
 */
export function setupDevServer(
  server: ViteDevServer,
  htmlProcessor: HtmlProcessor
) {
  BuildLogger.info(
    "🔧 Setting up dev server middleware for KBR Builder..."
  );

  // Add blocking middleware first
  server.middlewares.use(createBlockingMiddleware());

  // Add processing middleware second
  server.middlewares.use(createProcessingMiddleware(htmlProcessor));

  // Setup file watcher
  setupFileWatcher(server, htmlProcessor);
}
