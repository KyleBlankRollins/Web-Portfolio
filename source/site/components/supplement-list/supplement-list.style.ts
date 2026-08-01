import { css } from "lit";

export const supplementListStyles = css`
  :host {
    display: block;
  }

  /* Matches .blog-citations-container so the two end-of-post dividers
     share the same rhythm. */
  .supplements {
    margin-top: var(--space-md);
    padding-top: var(--space-sm);
    border-top: 2px solid var(--color-border-secondary);
  }

  /* Matches .citations h2 rather than the article's full-size h2. */
  h2 {
    font-size: var(--font-size-lg);
    line-height: 1.4;
    font-weight: 600;
    color: var(--color-text);
    margin-top: 0;
    margin-bottom: var(--space-md);
  }

  .supplement-list {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .supplement-item + .supplement-item {
    margin-top: var(--space-sm);
  }

  .supplement-link {
    color: var(--color-text-secondary);
    font-weight: 500;
    line-height: 1.6;
    text-decoration: none;
    transition: color var(--transition-fast);
  }

  .supplement-link:hover {
    color: var(--color-primary-hover);
    text-decoration: underline;
  }

  .supplement-link:focus-visible {
    outline: var(--focus-ring-width) var(--focus-ring-style)
      var(--focus-ring-color);
    outline-offset: var(--focus-ring-offset);
    border-radius: var(--radius-sm);
  }

  .supplement-description {
    margin: 0;
    font-size: var(--font-size-sm);
    line-height: 1.5;
  }
`;
