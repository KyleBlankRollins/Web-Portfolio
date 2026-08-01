import { css } from "lit";

export const admonitionStyles = css`
  :host {
    display: block;
    margin: var(--space-lg) 0;
  }

  .admonition {
    border-radius: var(--space-xs);
    border-left: 4px solid;
    padding: var(--space-md);
    background-color: var(--color-background-secondary);
    position: relative;
    overflow: hidden;
  }

  /* Compact layout when no title */
  .admonition.compact {
    display: flex;
    align-items: flex-start;
    gap: var(--space-sm);
  }

  .admonition.compact .admonition-icon {
    flex-shrink: 0;
    margin-top: 0.125rem; /* Slight adjustment for visual alignment */
  }

  .admonition.compact .admonition-content {
    flex: 1;
  }

  /* Header layout when title is present */
  .admonition-header {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    margin-bottom: var(--space-sm);
    font-weight: var(--font-weight-medium);
  }

  /* Full-contrast body copy in every variant. This was
     --color-text-secondary, which only .admonition-caution overrode back to
     --color-text - so four of the five variants rendered muted body text
     while the fifth did not, with nothing to justify the split. An admonition
     is emphasis; its content should not read as de-emphasized. */
  .admonition-content {
    color: var(--color-text);
    line-height: var(--line-height-relaxed);
  }

  /* Note styling - blue theme */
  .admonition-note {
    border-left-color: var(--color-info-strong);
    background-color: var(--color-info-subtle);
  }

  .admonition-note .admonition-header,
  .admonition-note.compact .admonition-icon {
    color: var(--color-info-strong);
  }

  .admonition-note kbr-icon {
    color: var(--color-info-strong);
  }

  /* Tip styling - green theme */
  .admonition-tip {
    border-left-color: var(--color-success-strong);
    background-color: var(--color-success-subtle);
  }

  .admonition-tip .admonition-header,
  .admonition-tip.compact .admonition-icon {
    color: var(--color-success-strong);
  }

  .admonition-tip kbr-icon {
    color: var(--color-success-strong);
  }

  /* Important styling - purple theme */
  .admonition-important {
    border-left-color: var(--color-accent-strong);
    background-color: var(--color-accent-subtle);
  }

  .admonition-important .admonition-header,
  .admonition-important.compact .admonition-icon {
    color: var(--color-accent-strong);
  }

  .admonition-important kbr-icon {
    color: var(--color-accent-strong);
  }

  /* Warning styling - orange theme */
  .admonition-warning {
    border-left-color: var(--color-warning-strong);
    background-color: var(--color-warning-subtle);
  }

  .admonition-warning .admonition-header,
  .admonition-warning.compact .admonition-icon {
    color: var(--color-warning-strong);
  }

  .admonition-warning kbr-icon {
    color: var(--color-warning-strong);
  }

  /* Caution styling - red theme */
  .admonition-caution {
    border-left-color: var(--color-error-strong);
    background-color: var(--color-error-subtle);
  }

  .admonition-caution .admonition-header,
  .admonition-caution.compact .admonition-icon {
    color: var(--color-error-strong);
  }

  .admonition-caution kbr-icon {
    color: var(--color-error-strong);
  }

  /* Typography adjustments */
  .admonition-content ::slotted(p:first-child) {
    margin-top: 0;
  }

  .admonition-content ::slotted(p:last-child) {
    margin-bottom: 0;
  }

  .admonition-content ::slotted(ul),
  .admonition-content ::slotted(ol) {
    margin: var(--space-sm) 0;
    padding-left: var(--space-lg);
  }

  /* Matches the article inline-code treatment in blog-post.css so the same
     element does not render two ways depending on where it sits. The chip
     keeps --color-background rather than the article's
     --color-background-secondary: here it sits on a tinted -subtle panel, not
     on the page, and needs to stay distinguishable from it. */
  .admonition-content ::slotted(code) {
    background-color: var(--color-background);
    border: 1px solid var(--color-border);
    border-radius: 4px;
    padding: 0em 0.2em;
    font-family: var(--font-family-mono);
    font-size: 0.875em;
    color: var(--color-on-surface);
    font-weight: 500;
  }
`;
