import { css } from "lit";

export const homeHighlightsStyles = css`
  :host {
    display: block;
    margin-bottom: var(--space-2xl);
  }

  .home-highlights {
    max-width: var(--content-max-width);
    margin: var(--space-2xl) auto 0;
    padding: 0 var(--space-lg);
  }

  .home-highlights-heading {
    margin-bottom: var(--space-lg);
  }

  .eyebrow {
    margin: 0 0 var(--space-xs);
    color: var(--color-text-secondary);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-semibold);
    letter-spacing: var(--letter-spacing-wide);
    text-transform: uppercase;
  }

  h2,
  h3 {
    margin: 0;
  }

  .home-highlights-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(280px, 100%), 1fr));
    gap: var(--space-lg);
  }

  .highlight-item {
    padding: var(--space-lg);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background: var(--color-surface);
  }

  .highlight-item p:not(.eyebrow) {
    color: var(--color-text-secondary);
  }

  .highlight-item time {
    color: var(--color-text-secondary);
    font-size: var(--font-size-sm);
  }

  .highlight-link {
    display: inline-block;
    margin-top: var(--space-sm);
  }

  .status {
    color: var(--color-text-secondary);
  }

  @media (max-width: 768px) {
    .home-highlights {
      padding-inline: var(--space-md);
    }
  }
`;
