/**
 * HTML Utilities Module
 * Pure utility functions for HTML manipulation and escaping
 */

/**
 * Escape HTML characters for safe display in HTML content
 */
export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Escape HTML for use in HTML comments
 * Converts -- to &#45;&#45; to avoid breaking comment syntax
 */
export function escapeHtmlComment(html: string): string {
  return html.replace(/--/g, "&#45;&#45;");
}

/**
 * Unescape HTML comment escaping
 * Converts &#45;&#45; back to --
 */
export function unescapeHtmlComment(html: string): string {
  return html.replace(/&#45;&#45;/g, "--");
}

/**
 * Escape text for use in HTML attributes
 * More comprehensive than basic escaping
 */
export function escapeHtmlAttribute(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}
