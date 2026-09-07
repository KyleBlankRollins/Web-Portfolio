import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import {
  TemplateProcessor,
  type TemplateVariables,
} from "./template-processor.js";
import { HtmlProcessingUtils } from "./html-utils.js";

export interface LoadedSiteSource {
  readonly pages: ReadonlyMap<string, string>;
  readonly templates: ReadonlyMap<string, string>;
  readonly partials: ReadonlyMap<string, string>;
}

export type SiteHeadAsset =
  | { readonly kind: "stylesheet"; readonly href: string }
  | { readonly kind: "modulepreload"; readonly href: string };

export interface SiteBodyAsset {
  readonly kind: "module";
  readonly src: string;
}

export interface SiteAssets {
  readonly head: readonly SiteHeadAsset[];
  readonly body: readonly SiteBodyAsset[];
}

export interface RenderedSite {
  readonly outputs: ReadonlyMap<string, string>;
}

export interface RenderableSiteContent {
  readonly outputPath: string;
  readonly content: string;
  readonly metadata?: Partial<TemplateVariables>;
  readonly kind?: "html" | "raw";
}

export function loadSiteSource(
  siteRoot = join(process.cwd(), "source", "site")
): LoadedSiteSource {
  const pages = readDirectoryFiles(join(siteRoot, "pages"), ".html");
  const indexPath = join(siteRoot, "index.html");
  if (existsSync(indexPath)) {
    pages.set("index.html", readFileSync(indexPath, "utf-8"));
  }
  const templates = readDirectoryFiles(join(siteRoot, "templates"), ".html");
  const partials = readDirectoryFiles(
    join(siteRoot, "templates", "partials"),
    ".html"
  );
  return { pages, templates, partials };
}

export function renderSite(
  source: LoadedSiteSource,
  content: readonly RenderableSiteContent[],
  assets: SiteAssets
): RenderedSite {
  const templateProcessor = new TemplateProcessor({
    templates: source.templates,
    partials: source.partials,
  });
  const outputs = new Map<string, string>();

  for (const page of content) {
    if (page.kind === "raw") {
      outputs.set(page.outputPath, page.content);
      continue;
    }

    const rendered = HtmlProcessingUtils.processHtmlContentSync(
      templateProcessor,
      page.content,
      {
        defaultTitle: "Untitled",
        assets,
        metadata: page.metadata,
      }
    );
    outputs.set(page.outputPath, rendered);
  }

  return { outputs };
}

function readDirectoryFiles(
  directoryPath: string,
  extension?: string
): Map<string, string> {
  const files = new Map<string, string>();
  if (!existsSync(directoryPath)) {
    return files;
  }

  for (const entry of readdirSync(directoryPath, { withFileTypes: true })) {
    const entryPath = join(directoryPath, entry.name);
    if (entry.isDirectory()) {
      for (const [path, content] of readDirectoryFiles(entryPath, extension)) {
        files.set(
          join(relative(directoryPath, entryPath), path).replace(/\\/g, "/"),
          content
        );
      }
    } else if (!extension || entry.name.endsWith(extension)) {
      files.set(entry.name, readFileSync(entryPath, "utf-8"));
    }
  }

  return files;
}
