import type { ViteDevServer } from "vite";
import * as fs from "fs";
import * as path from "path";
import { marked } from "marked";
import {
  TemplateProcessor,
  type TemplateVariables,
} from "./template-processor.js";
import { BuildLogger } from "./helpers.js";

/**
 * Process HTML content using the TemplateProcessor
 */
async function processHtmlContent(
  templateProcessor: TemplateProcessor,
  content: string
): Promise<string> {
  // Extract metadata from HTML comments
  const metadata = templateProcessor.extractMetadata(content);

  // Helper function to extract title from HTML content if not in metadata
  function extractTitleFromContent(content: string): string | null {
    // Look for h1 tags
    const h1Match = content.match(/<h1[^>]*>(.*?)<\/h1>/i);
    if (h1Match) {
      return h1Match[1].replace(/<[^>]*>/g, "").trim();
    }

    // Look for title in kbr-page-head attributes (legacy)
    const titleAttrMatch = content.match(
      /title\s*=\s*["']([^"']*)["']/i
    );
    if (titleAttrMatch) {
      return titleAttrMatch[1].trim();
    }

    return null;
  }

  // Create template variables
  const templateVariables: TemplateVariables = {
    title:
      metadata.title ||
      extractTitleFromContent(content) ||
      "Development Server",
    description: metadata.description,
    keywords: metadata.keywords,
    additionalHead: metadata.additionalHead,
    content: "", // This will be overridden by processTemplate
  };

  return templateProcessor.processTemplate(
    content,
    templateVariables
  );
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
 * Creates middleware that processes HTML files with templates
 */
function createProcessingMiddleware(
  templateProcessor: TemplateProcessor
) {
  return (req: any, res: any, next: any) => {
    const url = req.url;
    if (!url) return next();

    // Handle root index.html
    if (url === "/" || url === "/index.html") {
      return handleIndexRequest(templateProcessor, req, res, next);
    }

    // Handle HTML files at root level (matching production build structure)
    if (url.match(/^\/[^/]+\.html$/)) {
      return handleHtmlRequest(
        templateProcessor,
        url,
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
        templateProcessor,
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
  templateProcessor: TemplateProcessor,
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
      templateProcessor,
      pageFilePath,
      res,
      next
    );
  }

  // Try content/ directory for converted HTML
  const contentHtmlPath = path.join(rootDir, "content", fileName);
  if (fs.existsSync(contentHtmlPath)) {
    return await processAndServeFile(
      templateProcessor,
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
      templateProcessor,
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
  templateProcessor: TemplateProcessor,
  filePath: string,
  res: any,
  next: any
) {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const processedContent = await processHtmlContent(
      templateProcessor,
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
  templateProcessor: TemplateProcessor,
  mdFilePath: string,
  res: any,
  next: any
) {
  try {
    const mdContent = fs.readFileSync(mdFilePath, "utf-8");

    // Extract frontmatter and convert markdown to HTML
    const { metadata, content } =
      templateProcessor.extractMarkdownFrontmatter(mdContent);
    const htmlContent = marked(content);

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
 * Sets up file watcher for template and include files
 */
function setupFileWatcher(
  server: ViteDevServer,
  templateProcessor: TemplateProcessor
) {
  server.ws.on("file-changed", ({ file }) => {
    if (file.includes("/templates/") || file.includes("/includes/")) {
      BuildLogger.info(`🔄 Template/Include file changed: ${file}`);
      templateProcessor.clearCache();

      // Trigger a full page reload for template/include changes since they affect multiple pages
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
  templateProcessor: TemplateProcessor
) {
  BuildLogger.info(
    "🔧 Setting up dev server middleware for KBR Builder..."
  );

  // Add blocking middleware first
  server.middlewares.use(createBlockingMiddleware());

  // Add processing middleware second
  server.middlewares.use(
    createProcessingMiddleware(templateProcessor)
  );

  // Setup file watcher
  setupFileWatcher(server, templateProcessor);
}
