import type { ViteDevServer } from "vite";
import type * as Connect from "connect";
import type { ServerResponse } from "http";
import * as fs from "fs";
import * as path from "path";
import {
  TemplateProcessor,
  type TemplateVariables,
} from "./template-processor.js";
import { BuildLogger } from "./helpers.js";
import { HtmlProcessingUtils } from "./html-utils.js";
import type { MarkdownProcessor } from "./markdown-processor.js";
import { ContentDiscovery } from "./modules/index.js";

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
  templateProcessor: TemplateProcessor,
  markdownProcessor: MarkdownProcessor
) {
  return (
    req: Connect.IncomingMessage,
    res: ServerResponse,
    next: Connect.NextFunction
  ) => {
    const url = req.url;
    if (!url) return next();

    // Handle data API requests (strip query parameters)
    const cleanUrl = url.split("?")[0].split("#")[0];
    if (cleanUrl === "/data/blog-manifest.json") {
      return handleBlogManifestRequest(req, res, next, markdownProcessor);
    }

    if (cleanUrl === "/data/theme-manifest.json") {
      return handleThemeManifestRequest(req, res, next);
    }

    // Handle root index.html
    if (cleanUrl === "/" || cleanUrl === "/index.html") {
      return handleIndexRequest(templateProcessor, req, res, next);
    }

    // Handle HTML files (including nested supplement paths)
    // Extract the pathname without query parameters or hash
    const pathname = url.split("?")[0].split("#")[0];
    if (pathname.endsWith(".html")) {
      return handleHtmlRequest(
        templateProcessor,
        markdownProcessor,
        pathname, // Pass clean pathname to handler
        req,
        res,
        next
      );
    }

    next();
  };
}

/**
 * Handle requests for the root index.html
 */
async function handleIndexRequest(
  templateProcessor: TemplateProcessor,
  _req: Connect.IncomingMessage,
  res: ServerResponse,
  next: Connect.NextFunction
) {
  const indexPath = path.join(process.cwd(), "source", "site", "index.html");

  if (fs.existsSync(indexPath)) {
    try {
      const content = fs.readFileSync(indexPath, "utf-8");
      const processedContent = await HtmlProcessingUtils.processHtmlContent(
        templateProcessor,
        content,
        "Development Server"
      );

      // Inject development assets (consistent with other HTML handlers)
      const devContent = injectDevAssets(processedContent);

      res.setHeader("Content-Type", "text/html");
      res.setHeader("Cache-Control", "no-cache");
      res.end(devContent);
    } catch (error) {
      BuildLogger.error(`Error processing index.html: ${error}`);
      next(error);
    }
  } else {
    next();
  }
}

/**
 * Handle requests for blog-manifest.json
 */
function handleBlogManifestRequest(
  _req: Connect.IncomingMessage,
  res: ServerResponse,
  _next: Connect.NextFunction,
  markdownProcessor: MarkdownProcessor
) {
  try {
    // Generate the blog manifest from the markdown processor
    const manifestJson = markdownProcessor.generateBlogManifestJson();

    res.setHeader("Content-Type", "application/json");
    res.setHeader("Cache-Control", "no-cache");
    res.end(manifestJson);
  } catch (error) {
    BuildLogger.error(`Error serving blog-manifest.json: ${error}`);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end('{"error": "Failed to generate blog manifest"}');
  }
}

/**
 * Handle requests for theme-manifest.json
 */
function handleThemeManifestRequest(
  _req: Connect.IncomingMessage,
  res: ServerResponse,
  _next: Connect.NextFunction
) {
  try {
    // Import and process themes
    const { ThemeProcessor } = require("./theme-processor.js");
    const themesDir = path.join(
      process.cwd(),
      "source",
      "site",
      "styles",
      "themes"
    );
    const themeProcessor = new ThemeProcessor(themesDir);

    // Process themes and generate manifest
    themeProcessor.processThemes();
    const manifestJson = themeProcessor.generateThemeManifestJson();

    res.setHeader("Content-Type", "application/json");
    res.setHeader("Cache-Control", "no-cache");
    res.end(manifestJson);
  } catch (error) {
    BuildLogger.error(`Error serving theme-manifest.json: ${error}`);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end('{"error": "Failed to generate theme manifest"}');
  }
}

/**
 * Handle requests for HTML files at root level
 */
async function handleHtmlRequest(
  templateProcessor: TemplateProcessor,
  markdownProcessor: MarkdownProcessor,
  url: string,
  _req: Connect.IncomingMessage,
  res: ServerResponse,
  next: Connect.NextFunction
) {
  const requestedPublicUrl = normalizePublicUrl(url);
  const fileName = requestedPublicUrl.slice(1);
  const rootDir = path.join(process.cwd(), "source/site");

  // First, resolve against generated documents by normalized public URL.
  const generatedFile =
    markdownProcessor.getGeneratedFileByPublicUrl(requestedPublicUrl);
  if (generatedFile) {
    return await processAndServeGeneratedFile(
      templateProcessor,
      generatedFile,
      res,
      next
    );
  }

  // Try pages/ directory
  const pageFilePath = path.join(rootDir, "pages", fileName);
  if (fs.existsSync(pageFilePath)) {
    return await processAndServeFile(
      templateProcessor,
      pageFilePath,
      res,
      next
    );
  }

  const markdownSourcePath =
    resolvePublishedMarkdownSourcePath(requestedPublicUrl);
  if (markdownSourcePath) {
    return await processAndServeMarkdown(
      templateProcessor,
      markdownProcessor,
      markdownSourcePath,
      res,
      next
    );
  }

  sendNotFoundHtml(res);
}

/**
 * Process and serve a generated HTML file from memory
 */
async function processAndServeGeneratedFile(
  templateProcessor: TemplateProcessor,
  generatedFile: any,
  res: ServerResponse,
  next: Connect.NextFunction
) {
  try {
    const processedContent = await HtmlProcessingUtils.processHtmlContent(
      templateProcessor,
      generatedFile.content,
      generatedFile.metadata.title || "Generated Content"
    );

    // Inject development assets
    const devContent = injectDevAssets(processedContent);

    res.setHeader("Content-Type", "text/html");
    res.setHeader("Cache-Control", "no-cache");
    res.end(devContent);
  } catch (error) {
    BuildLogger.error(
      `Error processing generated file ${generatedFile.filename}: ${error}`
    );
    next(error);
  }
}

/**
 * Process and serve an HTML file
 */
async function processAndServeFile(
  templateProcessor: TemplateProcessor,
  filePath: string,
  res: ServerResponse,
  next: Connect.NextFunction
) {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const processedContent = await HtmlProcessingUtils.processHtmlContent(
      templateProcessor,
      content
    );

    // Inject development assets
    const devContent = injectDevAssets(processedContent);

    res.setHeader("Content-Type", "text/html");
    res.setHeader("Cache-Control", "no-cache");
    res.end(devContent);
  } catch (error) {
    BuildLogger.error(`Error processing ${filePath}: ${error}`);
    next(error);
  }
}

/**
 * Process and serve a Markdown file as HTML
 */
async function processAndServeMarkdown(
  templateProcessor: TemplateProcessor,
  markdownProcessor: MarkdownProcessor,
  mdFilePath: string,
  res: ServerResponse,
  next: Connect.NextFunction
) {
  try {
    const mdContent = fs.readFileSync(mdFilePath, "utf-8");

    // Extract frontmatter and convert markdown to HTML
    const { metadata, content } =
      templateProcessor.extractMarkdownFrontmatter(mdContent);
    const htmlContent = markdownProcessor.renderMarkdownBody(
      content,
      mdFilePath
    );

    // Create template variables
    const templateVariables: TemplateVariables = {
      title: metadata.title || "Development Server",
      description: metadata.description,
      keywords: metadata.keywords,
      additionalHead: metadata.additionalHead,
      content: "", // This will be overridden by processTemplate
    };

    const processedContent = templateProcessor.processTemplate(
      htmlContent,
      templateVariables
    );

    // Inject development assets
    const devContent = injectDevAssets(processedContent);

    res.setHeader("Content-Type", "text/html");
    res.setHeader("Cache-Control", "no-cache");
    res.end(devContent);
  } catch (error) {
    BuildLogger.error(`Error processing markdown ${mdFilePath}: ${error}`);
    next(error);
  }
}

/**
 * Sets up file watcher for template, include, and page files
 */
function setupFileWatcher(
  server: ViteDevServer,
  templateProcessor: TemplateProcessor,
  onPublishedMarkdownChanged?: (changedFilePath: string) => Promise<void>
) {
  server.ws.on("file-changed", ({ file }) => {
    if (file.includes("/templates/") || file.includes("/includes/")) {
      BuildLogger.info(`🔄 Template/Include file changed: ${file}`);
      templateProcessor.clearCache();

      // Trigger a full page reload for template/include changes since they affect multiple pages
      server.ws.send({
        type: "full-reload",
      });
    } else if (file.includes("/pages/") && file.endsWith(".html")) {
      BuildLogger.info(`🔄 Page file changed: ${file}`);
      templateProcessor.clearCache();

      // Trigger a full page reload for page changes
      server.ws.send({
        type: "full-reload",
      });
    }
  });

  const handleMarkdownFileChange = async (filePath: string) => {
    const normalizedPath = filePath.replace(/\\/g, "/");
    if (!normalizedPath.endsWith(".md")) {
      return;
    }

    if (!normalizedPath.includes("/source/site/content/published/")) {
      return;
    }

    BuildLogger.info(`🔄 Published markdown changed: ${normalizedPath}`);

    if (onPublishedMarkdownChanged) {
      await onPublishedMarkdownChanged(filePath);
    }

    server.ws.send({
      type: "full-reload",
    });
  };

  server.watcher.on("add", (filePath) => {
    void handleMarkdownFileChange(filePath);
  });

  server.watcher.on("change", (filePath) => {
    void handleMarkdownFileChange(filePath);
  });

  server.watcher.on("unlink", (filePath) => {
    void handleMarkdownFileChange(filePath);
  });
}

/**
 * Inject development assets into HTML content
 */
function injectDevAssets(htmlContent: string): string {
  let modifiedContent = htmlContent;

  // Inject development script before closing </body>
  const devScript = `    <script type="module" src="/main.ts"></script>`;

  modifiedContent = modifiedContent.replace("</body>", `${devScript}\n</body>`);

  return modifiedContent;
}

/**
 * Main dev server setup function
 */
export function setupDevServer(
  server: ViteDevServer,
  templateProcessor: TemplateProcessor,
  markdownProcessor: MarkdownProcessor,
  onPublishedMarkdownChanged?: (changedFilePath: string) => Promise<void>
) {
  BuildLogger.info("🔧 Setting up dev server middleware for KBR Builder...");

  // Add blocking middleware first
  server.middlewares.use(createBlockingMiddleware());

  // Add processing middleware second
  server.middlewares.use(
    createProcessingMiddleware(templateProcessor, markdownProcessor)
  );

  // Setup file watcher
  setupFileWatcher(server, templateProcessor, onPublishedMarkdownChanged);
}

function normalizePublicUrl(url: string): string {
  if (!url.startsWith("/")) {
    return `/${url}`;
  }

  return url;
}

function resolvePublishedMarkdownSourcePath(
  requestedPublicUrl: string
): string | undefined {
  const discoveryResult = new ContentDiscovery().discover();
  const matchedDocument = discoveryResult.publishableDocuments.find(
    (document) => document.publicUrl === requestedPublicUrl
  );

  return matchedDocument?.sourcePath;
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
