import { css } from "lit";

export const admonitionStyles = css`
  :host {
    display: block;
    margin: var(--space-lg) 0;
  }

  /* An aside, set a touch smaller between two hairlines. It was a filled
     panel with a 4px coloured edge, which pulled more attention than the
     text around it; the type colour now lives in the icon alone. */
  .admonition {
    /* The host page may zero the top rule when the aside sits directly
       under another hairline (see .post-masthead + kbr-admonition). */
    border-top: var(--admonition-rule-top, 1px) solid var(--color-border);
    border-bottom: 1px solid var(--color-border);
    padding: var(--space-sm) 0;
    font-size: 0.95em;
    position: relative;
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
  .admonition-note .admonition-header,
  .admonition-note.compact .admonition-icon {
    color: var(--color-info-strong);
  }

  .admonition-note kbr-icon {
    color: var(--color-info-strong);
  }

  /* Tip styling - green theme */
  .admonition-tip .admonition-header,
  .admonition-tip.compact .admonition-icon {
    color: var(--color-success-strong);
  }

  .admonition-tip kbr-icon {
    color: var(--color-success-strong);
  }

  /* Important styling - purple theme */
  .admonition-important .admonition-header,
  .admonition-important.compact .admonition-icon {
    color: var(--color-accent-strong);
  }

  .admonition-important kbr-icon {
    color: var(--color-accent-strong);
  }

  /* Warning styling - orange theme */
  .admonition-warning .admonition-header,
  .admonition-warning.compact .admonition-icon {
    color: var(--color-warning-strong);
  }

  .admonition-warning kbr-icon {
    color: var(--color-warning-strong);
  }

  /* Caution styling - red theme */
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
     element does not render two ways depending on where it sits. */
  .admonition-content ::slotted(code) {
    background-color: var(--color-background-secondary);
    border-radius: var(--radius-sm);
    padding: 0.05em 0.2em;
    font-family: var(--font-family-mono);
    font-size: 0.85em;
    color: var(--color-on-surface);
  }
`;
