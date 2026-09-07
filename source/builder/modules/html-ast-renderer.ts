import {
  parse,
  parseFragment,
  serialize,
  type DefaultTreeAdapterMap,
} from "parse5";
import { dirname, posix } from "node:path";
import { escapeHtml } from "./html-utils.js";
import type { SiteAssets } from "../site-renderer.js";

type Node = DefaultTreeAdapterMap["node"];
type ChildNode = DefaultTreeAdapterMap["childNode"];
type Element = DefaultTreeAdapterMap["element"];
type DocumentFragment = DefaultTreeAdapterMap["documentFragment"];

export interface HtmlAstSource {
  readonly templates?: ReadonlyMap<string, string>;
  readonly partials?: ReadonlyMap<string, string>;
  readonly sourceRoot?: string;
}

export interface HtmlAstRenderOptions {
  readonly sourcePath?: string;
  readonly assets?: SiteAssets;
}

export interface HtmlAstRenderResult {
  readonly html: string;
  readonly metadata: Record<string, string>;
}

export interface HtmlAstPageRenderOptions extends HtmlAstRenderOptions {
  readonly layout?: string;
}

export interface HtmlAstPreparedPage {
  readonly fragment: DocumentFragment;
  readonly metadata: Record<string, string>;
  readonly sourcePath?: string;
}

export interface HtmlAstOrigin {
  readonly sourcePath: string;
  readonly startLine?: number;
  readonly startCol?: number;
  readonly endLine?: number;
  readonly endCol?: number;
}

export interface HtmlAstNode {
  readonly node: Node;
  readonly origin: HtmlAstOrigin;
}

const RAW_TOKEN_PREFIX = "kbr-raw-fragment-";

interface HtmlAstRenderState {
  readonly rawFragments: Map<string, string>;
  readonly rawOrigins: Map<string, HtmlAstOrigin>;
  readonly includeStack: string[];
  nextRawToken: number;
}

/** Renders the deliberately small, valid-HTML KBR directive language. */
export class HtmlAstRenderer {
  private readonly source: HtmlAstSource;
  private readonly origins = new WeakMap<object, HtmlAstOrigin>();

  public constructor(source: HtmlAstSource = {}) {
    this.source = source;
  }

  public render(
    sourceHtml: string,
    variables: Record<string, unknown>,
    options: HtmlAstRenderOptions = {}
  ): HtmlAstRenderResult {
    const metadata: Record<string, string> = {};
    const fragment = this.parseFragment(sourceHtml, options.sourcePath);
    const state: HtmlAstRenderState = {
      rawFragments: new Map(),
      rawOrigins: new Map(),
      includeStack: [],
      nextRawToken: 0,
    };
    this.walk(fragment.childNodes, variables, options, metadata, state);
    return {
      html: this.replaceRawFragments(
        serialize(fragment),
        state.rawFragments,
        state.rawOrigins
      ),
      metadata,
    };
  }

  public preparePage(
    sourceHtml: string,
    options: HtmlAstRenderOptions = {}
  ): HtmlAstPreparedPage {
    const fragment = this.parseFragment(sourceHtml, options.sourcePath);
    const metadata: Record<string, string> = {};
    const pageElement = this.findPageElement(fragment.childNodes);
    if (pageElement) {
      this.requireTemplateDirective(
        pageElement,
        "data-kbr-page",
        options.sourcePath
      );
      this.extractPageMetadata(pageElement, metadata);
    }
    return { fragment, metadata, sourcePath: options.sourcePath };
  }

  public renderPage(
    page: string | HtmlAstPreparedPage,
    variables: Record<string, unknown>,
    options: HtmlAstPageRenderOptions = {}
  ): HtmlAstRenderResult {
    const preparedPage = typeof page === "string" ? undefined : page;
    const metadata: Record<string, string> = {
      ...(preparedPage?.metadata ?? {}),
    };
    const state: HtmlAstRenderState = {
      rawFragments: new Map(),
      rawOrigins: new Map(),
      includeStack: [],
      nextRawToken: 0,
    };
    const pageFragment =
      preparedPage?.fragment ??
      this.parseFragment(page as string, options.sourcePath);
    this.walk(
      pageFragment.childNodes,
      variables,
      {
        ...options,
        sourcePath: preparedPage?.sourcePath ?? options.sourcePath,
      },
      metadata,
      state
    );

    const layoutName = options.layout ?? metadata.layout;
    if (!layoutName) {
      return {
        html: this.replaceRawFragments(
          serialize(pageFragment),
          state.rawFragments,
          state.rawOrigins
        ),
        metadata,
      };
    }

    const layoutHtml = this.source.templates?.get(layoutName);
    if (layoutHtml === undefined) {
      throw new Error(`Layout template not found: ${layoutName}`);
    }
    const layout = this.parseDocument(layoutHtml, layoutName);
    this.walk(
      layout.childNodes,
      variables,
      { ...options, sourcePath: layoutName },
      metadata,
      state
    );
    if (!this.replaceSlot(layout.childNodes, pageFragment.childNodes)) {
      throw new Error(
        `Layout does not contain data-kbr-slot="content": ${layoutName}`
      );
    }

    return {
      html: this.replaceRawFragments(
        serialize(layout),
        state.rawFragments,
        state.rawOrigins
      ),
      metadata,
    };
  }

  private walk(
    nodes: Node[],
    variables: Record<string, unknown>,
    options: HtmlAstRenderOptions,
    metadata: Record<string, string>,
    state: HtmlAstRenderState
  ): void {
    for (let index = 0; index < nodes.length; index += 1) {
      const node = nodes[index];
      if (node.nodeName === "#text") {
        if (!this.isInScriptOrStyle(node)) {
          const textNode = node as Node & { value: string };
          textNode.value = this.interpolate(textNode.value, variables);
        }
        continue;
      }
      if (node.nodeName !== "#comment" && node.nodeName !== "#documentType") {
        const element = node as Element;
        this.validateDirectiveAttributes(element, options.sourcePath);
        const loop = this.attribute(element, "data-kbr-for");
        if (loop !== undefined) {
          this.requireTemplateDirective(
            element,
            "data-kbr-for",
            options.sourcePath
          );
          const { itemName, collectionPath } = this.parseLoopDirective(
            loop,
            element,
            options.sourcePath
          );
          const collection = this.resolve(variables, collectionPath);
          if (!Array.isArray(collection)) {
            throw this.error(
              element,
              `data-kbr-for requires an array value at "${collectionPath}"`,
              options.sourcePath
            );
          }
          const loopNodes = collection.flatMap((item) => {
            const clone = this.cloneNode(element);
            const content = (
              clone as Element & {
                content?: { childNodes: Node[] };
              }
            ).content;
            const children = [
              ...(content?.childNodes ??
                (clone as Element & { childNodes: Node[] }).childNodes),
            ];
            this.walk(
              children,
              { ...variables, [itemName]: item },
              options,
              metadata,
              state
            );
            return children;
          });
          nodes.splice(index, 1, ...loopNodes);
          index += loopNodes.length - 1;
          continue;
        }
        const include = this.attribute(element, "data-kbr-include");
        if (include !== undefined) {
          this.requireTemplateDirective(
            element,
            "data-kbr-include",
            options.sourcePath
          );
          const includePath = this.resolveIncludePath(
            include,
            element,
            options.sourcePath
          );
          const included = this.loadInclude(
            includePath,
            element,
            options.sourcePath,
            state.includeStack
          );
          const includedFragment = this.parseFragment(included, includePath);
          state.includeStack.push(includePath);
          try {
            this.walk(
              includedFragment.childNodes,
              variables,
              { ...options, sourcePath: includePath },
              metadata,
              state
            );
          } finally {
            state.includeStack.pop();
          }
          const includedLength = includedFragment.childNodes.length;
          nodes.splice(index, 1, ...includedFragment.childNodes);
          index += includedLength === 0 ? -1 : includedLength - 1;
          continue;
        }

        if (
          element.attrs.some((attribute) => attribute.name === "data-kbr-page")
        ) {
          this.requireTemplateDirective(
            element,
            "data-kbr-page",
            options.sourcePath
          );
          this.extractPageMetadata(element, metadata);
          this.walkTemplateContent(
            element,
            variables,
            options,
            metadata,
            state
          );
          nodes.splice(index, 1);
          index -= 1;
          continue;
        }

        const condition = this.attribute(element, "data-kbr-if");
        if (
          condition !== undefined &&
          !this.isTruthy(this.resolve(variables, condition))
        ) {
          nodes.splice(index, 1);
          index -= 1;
          continue;
        }

        const rawPath = this.attribute(element, "data-kbr-html");
        if (rawPath !== undefined) {
          this.requireTemplateDirective(
            element,
            "data-kbr-html",
            options.sourcePath
          );
          const path = rawPath;
          const value = this.resolve(variables, path);
          if (typeof value !== "string") {
            throw this.error(
              element,
              `data-kbr-html requires a string value at "${path}"`,
              options.sourcePath
            );
          }
          const token = `${RAW_TOKEN_PREFIX}${state.nextRawToken++}`;
          element.attrs = [{ name: "id", value: token }];
          element.childNodes = [];
          state.rawFragments.set(token, value);
          state.rawOrigins.set(
            token,
            this.origins.get(element) ??
              this.createOrigin(element, options.sourcePath)
          );
          continue;
        }

        if (
          element.attrs.some(
            (attribute) => attribute.name === "data-kbr-assets"
          )
        ) {
          const assetKind = this.attribute(element, "data-kbr-assets");
          if (assetKind !== "head" && assetKind !== "body") {
            throw this.error(
              element,
              'data-kbr-assets requires the value "head" or "body"',
              options.sourcePath
            );
          }
          const assetNodes = this.assetNodes(assetKind, options.assets);
          nodes.splice(index, 1, ...assetNodes);
          index -= 1;
          continue;
        }

        if (this.attribute(element, "data-kbr-slot") !== undefined) {
          continue;
        }

        element.attrs = element.attrs.filter(
          (attribute) => attribute.name !== "data-kbr-if"
        );
        for (const attribute of element.attrs) {
          attribute.value = this.interpolate(attribute.value, variables);
        }
        this.walkTemplateContent(element, variables, options, metadata, state);
      }
    }
  }

  private walkTemplateContent(
    element: Element,
    variables: Record<string, unknown>,
    options: HtmlAstRenderOptions,
    metadata: Record<string, string>,
    state: HtmlAstRenderState
  ): void {
    const templateContent = (
      element as Element & { content?: { childNodes: Node[] } }
    ).content;
    this.walk(
      templateContent?.childNodes ?? element.childNodes,
      variables,
      options,
      metadata,
      state
    );
  }

  private replaceSlot(nodes: Node[], pageNodes: ChildNode[]): boolean {
    for (let index = 0; index < nodes.length; index += 1) {
      const node = nodes[index];
      if (node.nodeName.startsWith("#")) {
        continue;
      }
      const element = node as Element;
      if (this.attribute(element, "data-kbr-slot") === "content") {
        if (element.nodeName === "template") {
          nodes.splice(index, 1, ...pageNodes);
        } else {
          element.childNodes = pageNodes;
          element.attrs = element.attrs.filter(
            (attribute) => attribute.name !== "data-kbr-slot"
          );
        }
        return true;
      }
      const children =
        element.nodeName === "template"
          ? (element as Element & { content?: { childNodes: Node[] } }).content
              ?.childNodes
          : element.childNodes;
      if (children && this.replaceSlot(children, pageNodes)) {
        return true;
      }
    }
    return false;
  }

  private resolveIncludePath(
    name: string,
    element: Element,
    sourcePath?: string
  ): string {
    const normalized = name.replaceAll("\\", "/");
    const resolved = posix.normalize(
      sourcePath ? posix.join(dirname(sourcePath), normalized) : normalized
    );
    if (resolved === ".." || resolved.startsWith("../")) {
      throw this.error(
        element,
        `Include escapes the template source root: ${name}`,
        sourcePath
      );
    }
    return resolved.replace(/^\.\//, "");
  }

  private loadInclude(
    name: string,
    element: Element,
    sourcePath: string | undefined,
    includeStack: readonly string[]
  ): string {
    if (includeStack.includes(name)) {
      throw this.error(
        element,
        `Recursive template include: ${[...includeStack, name].join(" -> ")}`,
        sourcePath
      );
    }
    const partialName = name.startsWith("partials/")
      ? name.slice("partials/".length)
      : name;
    const content =
      this.source.partials?.get(partialName) ??
      this.source.templates?.get(name);
    if (content === undefined) {
      throw this.error(
        element,
        `Included template not found: ${name}`,
        sourcePath
      );
    }
    return content;
  }

  private extractPageMetadata(
    element: Element,
    metadata: Record<string, string>
  ): void {
    const templateContent = (
      element as Element & { content?: { childNodes: Node[] } }
    ).content;
    for (const child of templateContent?.childNodes ?? element.childNodes) {
      if (child.nodeName !== "meta") {
        continue;
      }
      const meta = child as Element;
      const name = this.attribute(meta, "name");
      const content = this.attribute(meta, "content");
      if (name && content !== undefined) {
        metadata[name] = content;
      }
    }
    const layout = this.attribute(element, "data-layout");
    if (layout) {
      metadata.layout = layout;
    }
  }

  private findPageElement(nodes: Node[]): Element | undefined {
    for (const node of nodes) {
      if (node.nodeName === "#text" || node.nodeName === "#comment") {
        continue;
      }
      if (node.nodeName === "template") {
        const element = node as Element;
        if (
          element.attrs.some((attribute) => attribute.name === "data-kbr-page")
        ) {
          return element;
        }
        const templateContent = (
          element as Element & { content?: { childNodes: Node[] } }
        ).content;
        const nestedPage = templateContent
          ? this.findPageElement(templateContent.childNodes)
          : undefined;
        if (nestedPage) {
          return nestedPage;
        }
        continue;
      }
      if ("childNodes" in node) {
        const nestedPage = this.findPageElement(node.childNodes);
        if (nestedPage) {
          return nestedPage;
        }
      }
    }
    return undefined;
  }

  private assetNodes(kind: string | undefined, assets?: SiteAssets): Node[] {
    const head = kind === "body" ? [] : (assets?.head ?? []);
    const body = kind === "head" ? [] : (assets?.body ?? []);
    return [
      ...head
        .map(
          (asset) =>
            this.parseFragment(
              asset.kind === "stylesheet"
                ? `<link rel="stylesheet" crossorigin href="${escapeHtml(asset.href)}">`
                : `<link rel="modulepreload" crossorigin href="${escapeHtml(asset.href)}">`,
              "<generated assets>"
            ).childNodes
        )
        .flat(),
      ...body
        .map(
          (asset) =>
            this.parseFragment(
              `<script type="module" crossorigin src="${escapeHtml(asset.src)}"></script>`,
              "<generated assets>"
            ).childNodes
        )
        .flat(),
    ];
  }

  private interpolate(
    value: string,
    variables: Record<string, unknown>
  ): string {
    return value.replace(/\{\{\s*([\w.-]+)\s*\}\}/g, (_match, path: string) => {
      const resolved = this.resolve(variables, path);
      return resolved === undefined || resolved === null
        ? ""
        : String(resolved);
    });
  }

  private replaceRawFragments(
    html: string,
    rawFragments: Map<string, string>,
    rawOrigins: Map<string, HtmlAstOrigin>
  ): string {
    if (rawFragments.size === 0) {
      return html;
    }

    const tokens = [...rawFragments.keys()];
    const tokenPattern = new RegExp(
      `<template id="(${tokens
        .map((token) => this.escapeRegExp(token))
        .join("|")})"></template>`,
      "g"
    );
    const occurrences = new Map<string, number>();
    const result = html.replace(tokenPattern, (_match, token: string) => {
      const count = (occurrences.get(token) ?? 0) + 1;
      occurrences.set(token, count);
      if (count > 1) {
        throw this.rawFragmentError(token, rawOrigins);
      }
      return rawFragments.get(token)!;
    });

    for (const token of tokens) {
      if (!occurrences.has(token)) {
        throw this.rawFragmentError(token, rawOrigins);
      }
    }
    return result;
  }

  private rawFragmentError(
    token: string,
    rawOrigins: Map<string, HtmlAstOrigin>
  ): Error {
    const origin = rawOrigins.get(token);
    const source = origin?.sourcePath ? `${origin.sourcePath}:` : "";
    return new Error(
      `Raw fragment token collision or loss: ${token}${
        origin?.startLine
          ? ` (${source}line ${origin.startLine})`
          : ` (${source})`
      }`
    );
  }

  private escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  private resolve(variables: Record<string, unknown>, path: string): unknown {
    return path.split(".").reduce<unknown>((value, key) => {
      if (value === null || typeof value !== "object") {
        return undefined;
      }
      return (value as Record<string, unknown>)[key];
    }, variables);
  }

  private isTruthy(value: unknown): boolean {
    return (
      value !== undefined &&
      value !== null &&
      value !== false &&
      value !== "" &&
      !(Array.isArray(value) && value.length === 0)
    );
  }

  private attribute(element: Element, name: string): string | undefined {
    return element.attrs.find((attribute) => attribute.name === name)?.value;
  }

  private isInScriptOrStyle(node: Node): boolean {
    const parent = "parentNode" in node ? node.parentNode : undefined;
    return parent?.nodeName === "script" || parent?.nodeName === "style";
  }

  private error(element: Element, message: string, sourcePath?: string): Error {
    const origin = this.origins.get(element);
    const location = origin ?? this.createOrigin(element, sourcePath);
    const source = location.sourcePath ? `${location.sourcePath}:` : "";
    return new Error(
      `${message}${location.startLine ? ` (${source}line ${location.startLine})` : ` (${source})`}`
    );
  }

  private parseFragment(sourceHtml: string, sourcePath = "<inline>") {
    const fragment = parseFragment(sourceHtml, {
      sourceCodeLocationInfo: true,
    });
    this.recordOrigins(fragment.childNodes, sourcePath);
    return fragment;
  }

  private parseDocument(sourceHtml: string, sourcePath = "<inline>") {
    const document = parse(sourceHtml, { sourceCodeLocationInfo: true });
    this.recordOrigins(document.childNodes, sourcePath);
    return document;
  }

  private recordOrigins(nodes: Node[], sourcePath: string): void {
    for (const node of nodes) {
      this.origins.set(node, this.createOrigin(node, sourcePath));
      if (node.nodeName === "template") {
        const content = (node as Element & { content?: { childNodes: Node[] } })
          .content;
        if (content) {
          this.recordOrigins(content.childNodes, sourcePath);
        }
      } else if ("childNodes" in node) {
        this.recordOrigins(node.childNodes, sourcePath);
      }
    }
  }

  private createOrigin(node: Node, sourcePath = "<inline>"): HtmlAstOrigin {
    const location = (
      node as Node & {
        sourceCodeLocation?: {
          startLine?: number;
          startCol?: number;
          endLine?: number;
          endCol?: number;
        };
      }
    ).sourceCodeLocation;
    return {
      sourcePath,
      startLine: location?.startLine,
      startCol: location?.startCol,
      endLine: location?.endLine,
      endCol: location?.endCol,
    };
  }

  private requireTemplateDirective(
    element: Element,
    directive: string,
    sourcePath?: string
  ): void {
    if (element.nodeName !== "template") {
      throw this.error(
        element,
        `${directive} is only valid on template elements`,
        sourcePath
      );
    }
  }

  private validateDirectiveAttributes(
    element: Element,
    sourcePath?: string
  ): void {
    const requiredTargets = [
      "data-kbr-if",
      "data-kbr-for",
      "data-kbr-include",
      "data-kbr-html",
      "data-kbr-slot",
    ];
    for (const directive of requiredTargets) {
      const value = this.attribute(element, directive);
      if (value !== undefined && value.trim() === "") {
        throw this.error(
          element,
          `${directive} requires a non-empty value`,
          sourcePath
        );
      }
    }

    const loop = this.attribute(element, "data-kbr-for");
    if (loop !== undefined && element.nodeName !== "template") {
      throw this.error(
        element,
        "data-kbr-for is only valid on template elements",
        sourcePath
      );
    }

    const slot = this.attribute(element, "data-kbr-slot");
    if (slot !== undefined && slot !== "content") {
      throw this.error(
        element,
        'data-kbr-slot requires the value "content"',
        sourcePath
      );
    }

    const layout = this.attribute(element, "data-layout");
    if (
      layout !== undefined &&
      this.attribute(element, "data-kbr-page") === undefined
    ) {
      throw this.error(
        element,
        "data-layout is only valid on data-kbr-page elements",
        sourcePath
      );
    }
  }

  private parseLoopDirective(
    value: string,
    element: Element,
    sourcePath?: string
  ): { itemName: string; collectionPath: string } {
    const match = value.trim().match(/^([A-Za-z_$][\w$]*)\s+of\s+([\w.-]+)$/);
    if (!match) {
      throw this.error(
        element,
        'data-kbr-for requires the form "item of collection"',
        sourcePath
      );
    }
    return { itemName: match[1], collectionPath: match[2] };
  }

  private cloneNode(node: Node): ChildNode {
    const source = node as Node & {
      attrs?: Element["attrs"];
      childNodes?: ChildNode[];
      content?: DocumentFragment;
    };
    const clone = {
      ...source,
      parentNode: null,
      attrs: source.attrs
        ? source.attrs.map((attribute) => ({ ...attribute }))
        : source.attrs,
      childNodes: undefined,
      content: undefined,
    } as unknown as ChildNode & {
      attrs?: Element["attrs"];
      childNodes?: ChildNode[];
      content?: DocumentFragment;
    };

    this.origins.set(clone, this.origins.get(node) ?? this.createOrigin(node));

    if (source.childNodes) {
      clone.childNodes = source.childNodes.map((child) =>
        this.cloneNode(child)
      );
      for (const child of clone.childNodes) {
        (child as unknown as { parentNode: unknown }).parentNode = clone;
      }
    }

    if (source.content) {
      const content = {
        ...source.content,
        parentNode: null,
        childNodes: source.content.childNodes.map((child) =>
          this.cloneNode(child)
        ),
      } as unknown as DocumentFragment;
      clone.content = content;
      for (const child of content.childNodes) {
        (child as unknown as { parentNode: unknown }).parentNode = content;
      }
    }

    return clone;
  }
}
