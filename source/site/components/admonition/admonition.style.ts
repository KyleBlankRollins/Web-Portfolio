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

  .admonition-content {
    color: var(--color-text-secondary);
    line-height: var(--line-height-relaxed);
  }

  /* Note styling - blue theme */
  .admonition-note {
    border-left-color: var(--color-info);
    background-color: var(--color-info-subtle);
  }

  .admonition-note .admonition-header,
  .admonition-note.compact .admonition-icon {
    color: var(--color-info);
  }

  .admonition-note kbr-icon {
    color: var(--color-info);
  }

  /* Tip styling - green theme */
  .admonition-tip {
    border-left-color: var(--color-success);
    background-color: var(--color-success-subtle);
  }

  .admonition-tip .admonition-header,
  .admonition-tip.compact .admonition-icon {
    color: var(--color-success);
  }

  .admonition-tip kbr-icon {
    color: var(--color-success);
  }

  /* Important styling - purple theme */
  .admonition-important {
    border-left-color: var(--color-accent);
    background-color: var(--color-accent-subtle);
  }

  .admonition-important .admonition-header,
  .admonition-important.compact .admonition-icon {
    color: var(--color-accent);
  }

  .admonition-important kbr-icon {
    color: var(--color-accent);
  }

  /* Warning styling - orange theme */
  .admonition-warning {
    border-left-color: var(--color-warning);
    background-color: var(--color-warning-subtle);
  }

  .admonition-warning .admonition-header,
  .admonition-warning.compact .admonition-icon {
    color: var(--color-warning);
  }

  .admonition-warning kbr-icon {
    color: var(--color-warning);
  }

  /* Caution styling - red theme */
  .admonition-caution {
    border-left-color: var(--color-error);
    background-color: var(--color-error-subtle);
  }

  .admonition-caution .admonition-content {
    color: var(--color-text);
  }

  .admonition-caution .admonition-header,
  .admonition-caution.compact .admonition-icon {
    color: var(--color-error);
  }

  .admonition-caution kbr-icon {
    color: var(--color-error);
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

  .admonition-content ::slotted(code) {
    background-color: var(--color-background);
    padding: 0.125rem 0.25rem;
    border-radius: var(--space-sm);
    font-size: 0.875em;
  }
`;
