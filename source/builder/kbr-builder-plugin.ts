import type { Plugin, ViteDevServer } from "vite";
import { HtmlProcessor } from "./html-processor.js";
import { MarkdownProcessor } from "./markdown-processor.js";
import { FileSystemHelper } from "./helpers.js";
import { BuildLogger } from "./helpers.js";
import * as fs from "fs";
import * as path from "path";
import { marked } from "marked";

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
 * Process Markdown files in the content directory
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
      // Process each markdown file
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
 */
export function kbrBuilder(): Plugin {
  const htmlProcessor = new HtmlProcessor();
  const markdownProcessor = new MarkdownProcessor();

  return {
    name: "kbr-builder",

    // Run after Vite's built-in processing but before final output
    enforce: "post",

    config(config, { command }) {
      // Debug: Log Vite configuration info
      BuildLogger.info(`🔍 Vite command: ${command}`);
      BuildLogger.info(
        `🔍 Vite root: ${config.root || process.cwd()}`
      );

      // Let Vite handle the main index.html naturally
      // We'll process all HTML files in the generateBundle hook
      const htmlFiles = [
        ...FileSystemHelper.findFiles("pages", [".html"]),
        ...FileSystemHelper.findFiles("content", [".html"]),
      ];

      BuildLogger.info(
        `📁 Found ${htmlFiles.length} additional HTML files for processing`
      );
      BuildLogger.info(`📁 Letting Vite handle index.html naturally`);
    },

    configureServer(server: ViteDevServer) {
      BuildLogger.info(
        "🔧 Setting up dev server middleware for KBR Builder..."
      );

      // Add middleware to handle HTML file transformations
      server.middlewares.use((req, res, next) => {
        const url = req.url;
        if (!url) return next();

        // Handle root index.html
        if (url === "/" || url === "/index.html") {
          const indexPath = path.join(
            server.config.root || process.cwd(),
            "index.html"
          );

          if (fs.existsSync(indexPath)) {
            try {
              const content = fs.readFileSync(indexPath, "utf-8");
              processHtmlContent(htmlProcessor, content)
                .then((processedContent) => {
                  res.setHeader("Content-Type", "text/html");
                  res.setHeader("Cache-Control", "no-cache");
                  res.end(processedContent);
                })
                .catch((error) => {
                  BuildLogger.error(
                    `Failed to process index.html: ${error}`
                  );
                  next(error);
                });
              return;
            } catch (error) {
              BuildLogger.error(`Error reading index.html: ${error}`);
            }
          }
        }

        // Handle HTML files from pages/ directory
        if (url.match(/^\/[^/]+\.html$/)) {
          const fileName = url.slice(1); // Remove leading slash
          const pageFilePath = path.join(
            server.config.root || process.cwd(),
            "pages",
            fileName
          );

          if (fs.existsSync(pageFilePath)) {
            try {
              const content = fs.readFileSync(pageFilePath, "utf-8");
              processHtmlContent(htmlProcessor, content)
                .then((processedContent) => {
                  res.setHeader("Content-Type", "text/html");
                  res.setHeader("Cache-Control", "no-cache");
                  res.end(processedContent);
                })
                .catch((error) => {
                  BuildLogger.error(
                    `Failed to process ${fileName}: ${error}`
                  );
                  next(error);
                });
              return;
            } catch (error) {
              BuildLogger.error(
                `Error reading ${pageFilePath}: ${error}`
              );
            }
          }
        }

        // Handle Markdown files from content/ directory (serve as HTML)
        if (url.match(/^\/content\/[^/]+\.html$/)) {
          const fileName = url
            .replace("/content/", "")
            .replace(".html", ".md");
          const mdFilePath = path.join(
            server.config.root || process.cwd(),
            "content",
            fileName
          );

          if (fs.existsSync(mdFilePath)) {
            try {
              const mdContent = fs.readFileSync(mdFilePath, "utf-8");
              // Convert markdown to HTML using marked
              const htmlContent = marked(mdContent);

              processHtmlContent(htmlProcessor, htmlContent)
                .then((processedContent) => {
                  res.setHeader("Content-Type", "text/html");
                  res.setHeader("Cache-Control", "no-cache");
                  res.end(processedContent);
                })
                .catch((error) => {
                  BuildLogger.error(
                    `Failed to process markdown ${fileName}: ${error}`
                  );
                  next(error);
                });
              return;
            } catch (error) {
              BuildLogger.error(
                `Error processing markdown ${mdFilePath}: ${error}`
              );
            }
          }
        }

        next();
      });

      // Watch for changes to include files and invalidate cache
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
    },

    async buildStart() {
      BuildLogger.info("🚀 Starting KBR Builder...");

      // Process Markdown files at build start
      await processMarkdownFiles(markdownProcessor);
    },

    async generateBundle(_options, bundle) {
      try {
        BuildLogger.info("📄 Processing HTML files with includes...");

        // First, process any HTML files that Vite already added to the bundle
        const existingHtmlFiles = Object.keys(bundle).filter(
          (fileName) => fileName.endsWith(".html")
        );

        for (const fileName of existingHtmlFiles) {
          const htmlAsset = bundle[fileName];

          if (
            htmlAsset.type === "asset" &&
            typeof htmlAsset.source === "string"
          ) {
            try {
              // Process the HTML content with includes
              const processedContent = await processHtmlContent(
                htmlProcessor,
                htmlAsset.source
              );

              // Update the bundle with processed content
              htmlAsset.source = processedContent;

              BuildLogger.info(
                `✓ Processed existing HTML: ${fileName}`
              );
            } catch (error) {
              BuildLogger.error(
                `Failed to process ${fileName}: ${error}`
              );
              throw error;
            }
          }
        }

        // Now, manually process and add HTML files from pages/ and content/
        const additionalHtmlFiles = [
          ...FileSystemHelper.findFiles("pages", [".html"]),
          ...FileSystemHelper.findFiles("content", [".html"]),
        ];

        for (const filePath of additionalHtmlFiles) {
          try {
            // Read the HTML file
            const content = await FileSystemHelper.readFile(filePath);

            // Process it with includes
            const processedContent = await processHtmlContent(
              htmlProcessor,
              content
            );

            // Get the output filename (flatten the directory structure)
            const fileName =
              filePath.split("/").pop() || "unknown.html";

            // Add to bundle as an asset
            this.emitFile({
              type: "asset",
              fileName: fileName,
              source: processedContent,
            });

            BuildLogger.info(
              `✓ Processed additional HTML: ${fileName}`
            );
          } catch (error) {
            BuildLogger.error(
              `Failed to process ${filePath}: ${error}`
            );
            throw error;
          }
        }

        BuildLogger.success("🎉 KBR Builder completed successfully!");
      } catch (error) {
        BuildLogger.error(`generateBundle failed: ${error}`);
        throw error;
      }
    },
  };
}
