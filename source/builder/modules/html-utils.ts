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
