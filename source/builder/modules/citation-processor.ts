/**
 * Citation Processing Module
 * Handles all citation-related logic for markdown and template processors
 */

import { BuildLogger } from "../helpers.js";
import { escapeHtmlComment, escapeHtml } from "./html-utils.js";

/**
 * Citation metadata structure
 */
export interface Citation {
  id: string;
  title: string;
  author: string;
  url?: string;
  purchaseUrl?: string;
}

/**
 * Citation usage tracking
 */
export interface CitationUsage {
  number: number;
  positions: number[];
}

/**
 * Result of processing citation references
 */
export interface CitationProcessingResult {
  content: string;
  citationsHtml: string | undefined;
}

/**
 * Citation processor class
 */
export class CitationProcessor {
  /**
   * Parse citations array from YAML frontmatter
   */
  public parseCitationsFromFrontmatter(frontmatter: string): Citation[] {
    const citations: Citation[] = [];
    const citationIdRegex = /^\s+- id:\s*(.+)$/gm;

    // Collect all matches first
    const matches = Array.from(frontmatter.matchAll(citationIdRegex));

    if (matches.length === 0) {
      return citations;
    }

    // Process each match with proper boundaries
    for (let i = 0; i < matches.length; i++) {
      const match = matches[i];
      const startIndex = match.index!;
      const endIndex =
        i < matches.length - 1 ? matches[i + 1].index! : frontmatter.length;

      const citationBlock = frontmatter.substring(startIndex, endIndex);

      const id = match[1].trim().replace(/^["']|["']$/g, "");
      const titleMatch = citationBlock.match(/^\s+title:\s*(.+)$/m);
      const authorMatch = citationBlock.match(/^\s+author:\s*(.+)$/m);
      const urlMatch = citationBlock.match(/^\s+url:\s*(.+)$/m);
      const purchaseUrlMatch = citationBlock.match(/^\s+purchaseUrl:\s*(.+)$/m);

      // Validate required fields
      if (!titleMatch || !authorMatch) {
        BuildLogger.error(
          `Citation "${id}" is missing required fields (title and author must be present)`
        );
        throw new Error(
          `Invalid citation: "${id}". Both title and author are required.`
        );
      }

      // Validate ID format (lowercase alphanumeric with hyphens)
      if (!/^[a-z0-9-]+$/.test(id)) {
        const suggestedId = id.toLowerCase().replace(/[^a-z0-9-]/g, "-");
        BuildLogger.error(
          `Invalid citation ID "${id}" - must be lowercase alphanumeric with hyphens. Suggested: "${suggestedId}"`
        );
        throw new Error(
          `Invalid citation ID: "${id}". IDs must be lowercase alphanumeric with hyphens only.`
        );
      }

      const citation: Citation = {
        id,
        title: titleMatch[1].trim().replace(/^["']|["']$/g, ""),
        author: authorMatch[1].trim().replace(/^["']|["']$/g, ""),
      };

      if (urlMatch) {
        citation.url = urlMatch[1].trim().replace(/^["']|["']$/g, "");
      }

      if (purchaseUrlMatch) {
        citation.purchaseUrl = purchaseUrlMatch[1]
          .trim()
          .replace(/^["']|["']$/g, "");
      }

      citations.push(citation);
    }

    // Check for duplicate IDs
    this.validateNoDuplicates(citations);

    return citations;
  }

  /**
   * Process citation references in content ([^id] → numbered superscript links)
   * Returns processed content and generated citations HTML
   */
  public processCitationReferences(
    content: string,
    citations: Citation[] | undefined,
    filePath: string
  ): CitationProcessingResult {
    if (!citations || citations.length === 0) {
      return { content, citationsHtml: undefined };
    }

    // Track citation usage
    const citationUsage = new Map<string, CitationUsage>();
    const citationPattern = /\[\^([a-z0-9-]+)\]/g;
    let citationNumber = 0;

    // First pass: find all citations and assign numbers
    const matches: Array<{ id: string; index: number }> = [];

    let match;
    while ((match = citationPattern.exec(content)) !== null) {
      const citationId = match[1];
      matches.push({ id: citationId, index: match.index });

      if (!citationUsage.has(citationId)) {
        // Verify citation exists in frontmatter
        const citation = citations.find((c) => c.id === citationId);
        if (!citation) {
          BuildLogger.error(
            `Citation reference [^${citationId}] not found in frontmatter citations (${filePath})`
          );
          throw new Error(
            `Citation "${citationId}" referenced but not defined in frontmatter.`
          );
        }

        citationNumber++;
        citationUsage.set(citationId, {
          number: citationNumber,
          positions: [],
        });
      }

      citationUsage.get(citationId)!.positions.push(match.index);
    }

    // Check for unused citations
    this.warnUnusedCitations(citations, citationUsage, filePath);

    // Second pass: build new content with numbered superscript links
    const segments: string[] = [];
    let lastIndex = 0;

    for (let i = 0; i < matches.length; i++) {
      const { id, index } = matches[i];
      const usage = citationUsage.get(id)!;
      const refNumber = usage.number;
      const positionIndex = usage.positions.indexOf(index);

      // Create unique ID for back-reference if multiple refs to same citation
      const backRefId =
        usage.positions.length > 1
          ? `citation-ref-${id}-${positionIndex + 1}`
          : `citation-ref-${id}`;

      const replacement = `<sup id="${backRefId}"><a href="#citation-${id}" class="citation-ref">[${refNumber}]</a></sup>`;

      // Add content before this citation
      segments.push(content.substring(lastIndex, index));
      // Add the replacement
      segments.push(replacement);
      // Update lastIndex to after this citation
      lastIndex = index + `[^${id}]`.length;
    }

    // Add remaining content after last citation
    segments.push(content.substring(lastIndex));

    const processedContent = segments.join("");
    const citationsHtml = this.generateCitationsHtml(citations, citationUsage);

    return { content: processedContent, citationsHtml };
  }

  /**
   * Generate HTML for the citations/footnotes section
   */
  public generateCitationsHtml(
    citations: Citation[],
    citationUsage: Map<string, CitationUsage>
  ): string {
    // Filter to only used citations and sort by number
    const usedCitations = Array.from(citationUsage.entries())
      .map(([id, usage]) => ({
        citation: citations.find((c) => c.id === id)!,
        number: usage.number,
        positions: usage.positions,
      }))
      .sort((a, b) => a.number - b.number);

    if (usedCitations.length === 0) {
      return "";
    }

    const citationItems = usedCitations
      .map(({ citation, positions }) => {
        const links: string[] = [];

        if (citation.url) {
          links.push(
            `<a href="${escapeHtml(citation.url)}" target="_blank" rel="noopener">View</a>`
          );
        }

        if (citation.purchaseUrl) {
          links.push(
            `<a href="${escapeHtml(citation.purchaseUrl)}" target="_blank" rel="noopener">Buy</a>`
          );
        }

        const linksHtml =
          links.length > 0
            ? ` <span class="citation-links">${links.join('<span class="citation-separator"> | </span>')}</span>`
            : "";

        // Generate back-reference links
        const backRefs =
          positions.length > 1
            ? positions
                .map(
                  (_, idx) =>
                    `<a href="#citation-ref-${citation.id}-${idx + 1}" class="citation-backref">↩${idx + 1}</a>`
                )
                .join(" ")
            : `<a href="#citation-ref-${citation.id}" class="citation-backref">↩</a>`;

        return `    <li id="citation-${citation.id}">
      <em>${escapeHtml(citation.title)}</em> by ${escapeHtml(citation.author)}${linksHtml}
      <span class="citation-backrefs"> ${backRefs}</span>
    </li>`;
      })
      .join("\n");

    return `<section class="citations">
  <h2>References</h2>
  <ol class="citations-list">
${citationItems}
  </ol>
</section>`;
  }

  /**
   * Escape citations HTML for storage in HTML comments
   */
  public escapeCitationsForComment(citationsHtml: string): string {
    return escapeHtmlComment(citationsHtml);
  }

  /**
   * Validate that citations array has no duplicate IDs
   */
  private validateNoDuplicates(citations: Citation[]): void {
    const idCounts = new Map<string, number>();
    citations.forEach((citation) => {
      const count = (idCounts.get(citation.id) || 0) + 1;
      idCounts.set(citation.id, count);
    });

    const duplicates = Array.from(idCounts.entries())
      .filter(([_, count]) => count > 1)
      .map(([id, _]) => id);

    if (duplicates.length > 0) {
      BuildLogger.error(
        `Duplicate citation IDs found: ${duplicates.join(", ")}`
      );
      throw new Error(
        `Duplicate citation IDs: ${duplicates.join(", ")}. Each citation must have a unique ID.`
      );
    }
  }

  /**
   * Warn about citations defined but not used
   */
  private warnUnusedCitations(
    citations: Citation[],
    citationUsage: Map<string, CitationUsage>,
    filePath: string
  ): void {
    const usedCitationIds = new Set(citationUsage.keys());
    const unusedCitations = citations.filter((c) => !usedCitationIds.has(c.id));

    if (unusedCitations.length > 0) {
      BuildLogger.warn(
        `Unused citations in ${filePath}: ${unusedCitations.map((c) => c.id).join(", ")}`
      );
    }
  }
}
