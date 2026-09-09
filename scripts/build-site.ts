import { join } from "node:path";
import { MarkdownProcessor } from "../source/builder/markdown-processor.js";
import { processMarkdownFiles } from "../source/builder/index.js";
import { writeSite } from "../source/builder/html-bundle-processor.js";

const markdownProcessor = new MarkdownProcessor();

await processMarkdownFiles(markdownProcessor);
markdownProcessor.generateBlogManifest();
await writeSite(join(process.cwd(), "dist"), markdownProcessor);
