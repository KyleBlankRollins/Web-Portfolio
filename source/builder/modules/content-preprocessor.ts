/**
 * Content Preprocessor Module
 * Transforms content before markdown rendering
 */

import { Marked } from "marked";

/**
 * Content preprocessor class
 */
export class ContentPreprocessor {
  private marked: Marked;

  constructor(markedInstance: Marked = new Marked()) {
    this.marked = markedInstance;
  }

  /**
   * Remove JavaScript/CSS comments from markdown content before processing
   * Only removes comments outside of code blocks - preserves comments within fenced code blocks
   */
  public stripComments(content: string): string {
    // Split content by code blocks to preserve comments inside them
    const codeBlockPattern = /```[\s\S]*?```/g;
    const codeBlocks: string[] = [];
    const placeholderPrefix = "\uE000KBR_CODE_BLOCK_";
    let processed = content;

    // Extract code blocks and replace with placeholders
    processed = processed.replace(codeBlockPattern, (match) => {
      const placeholder = `${placeholderPrefix}${codeBlocks.length}\uE001`;
      codeBlocks.push(match);
      return placeholder;
    });

    // Remove standalone line comments (// at start of line)
    processed = processed.replace(/^\s*\/\/.*$/gm, "");

    // Remove CSS/JS block comments (/* ... */) on their own lines
    processed = processed.replace(/^\s*\/\*[\s\S]*?\*\/\s*$/gm, "");

    // Restore code blocks
    codeBlocks.forEach((codeBlock, index) => {
      processed = processed.replace(
        `${placeholderPrefix}${index}\uE001`,
        () => codeBlock
      );
    });

    // Clean up multiple consecutive newlines
    processed = processed.replace(/\n\s*\n\s*\n/g, "\n\n");

    return processed;
  }

  /**
   * Preprocess admonitions to handle markdown content within HTML tags
   * Extracts content inside kbr-admonition tags, processes it with marked.parseInline(),
   * and preserves the component's HTML attributes unchanged
   */
  public preprocessAdmonitions(content: string): string {
    const admonitionPattern =
      /<kbr-admonition([^>]*)>([\s\S]*?)<\/kbr-admonition>/g;

    return content.replace(admonitionPattern, (_, attributes, innerContent) => {
      // Trim whitespace from inner content
      const trimmedContent = innerContent.trim();

      // Process markdown content with parseInline to avoid wrapping in <p> tags
      const processedContent = this.marked.parseInline(trimmedContent);

      // Return admonition with processed content, preserving original attributes
      return `\n\n<kbr-admonition${attributes}>${processedContent}</kbr-admonition>\n\n`;
    });
  }
}
