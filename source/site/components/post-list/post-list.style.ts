import { css } from "lit";

export const postListStyles = css`
  /* Host element - the <kbr-post-list> tag itself */
  :host {
    display: block;
    width: 100%;
  }

  /* No top padding, stated directly. Each breakpoint used to apply padding
     on all four sides and then cancel the top with an equal negative margin.
     See DF-27. */
  .post-list-container {
    max-width: var(--content-max-width);
    margin: 0 auto;
    padding: 0 var(--space-lg) var(--space-lg);
  }

  /* Header */
  .post-list-header {
    margin-bottom: var(--space-md);
    text-align: center;
  }

  .post-list-header h2 {
    color: var(--color-on-surface);
    margin: 0;
    font-weight: var(--font-weight-semibold);
  }

  /* Posts grid */
  .post-list-grid {
    display: grid;
    margin-bottom: var(--space-xl);
  }

  /* Loading state */
  .post-list-loading {
    text-align: center;
    padding: var(--space-2xl) var(--space-lg);
  }

  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid var(--color-border);
    border-top: 3px solid var(--color-on-surface);
    border-radius: var(--radius-full);
    animation: spin 1s linear infinite;
    margin: 0 auto var(--space-md) auto;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .post-list-loading p {
    color: var(--color-text-secondary);
    font-size: var(--font-size-lg);
  }

  /* Empty state */
  .post-list-empty {
    text-align: center;
    padding: var(--space-2xl) var(--space-lg);
    color: var(--color-text-secondary);
  }

  .post-list-empty p {
    font-size: var(--font-size-lg);
    margin-bottom: var(--space-lg);
  }

  /* Error state */
  .post-list-error {
    text-align: center;
    padding: var(--space-2xl) var(--space-lg);
    color: var(--color-text);
  }

  .post-list-error h2 {
    color: var(--color-on-surface);
    margin-bottom: var(--space-md);
  }

  .post-list-error p {
    color: var(--color-text-secondary);
    font-size: var(--font-size-lg);
  }

  /* Pagination */
  .post-list-pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: var(--space-sm);
    margin-top: var(--space-xl);
    flex-wrap: wrap;
  }

  .pagination-btn {
    background: var(--color-background);
    border: 1px solid var(--color-border);
    color: var(--color-text);
    padding: var(--space-sm) var(--space-md);
    border-radius: var(--radius-sm);
    font-size: 0.9rem;
    font-weight: var(--font-weight-medium);
    cursor: pointer;
    transition: all var(--transition-fast);
    min-width: 44px;
    text-align: center;
  }

  .pagination-btn:hover:not([disabled]) {
    background: var(--color-background-secondary);
    border-color: var(--color-border-strong);
    transform: translateY(-1px);
  }

  .pagination-btn:focus {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }

  .pagination-btn.active {
    background: var(--color-on-surface);
    color: var(--color-text-inverse);
    border-color: var(--color-on-surface);
  }

  .pagination-btn[disabled] {
    background: var(--color-background-secondary);
    color: var(--color-text-secondary);
    cursor: not-allowed;
    opacity: 0.6;
  }

  /* Responsive design */
  @media (max-width: 768px) {
    .post-list-container {
      padding: 0 var(--space-md) var(--space-md);
    }

    .post-list-pagination {
      gap: var(--space-xs);
    }

    .pagination-btn {
      padding: var(--space-xs) var(--space-sm);
      font-size: 0.8rem;
      min-width: 36px;
    }

    .post-list-loading,
    .post-list-empty,
    .post-list-error {
      padding: var(--space-xl) var(--space-md);
    }
  }

  @media (max-width: 480px) {
    .post-list-container {
      padding: 0 var(--space-sm) var(--space-sm);
    }

    .post-list-pagination {
      flex-direction: column;
      gap: var(--space-xs);
    }

    .pagination-btn {
      width: 100%;
      max-width: 200px;
    }
  }

  /* Animation preferences */
  /* See post-card: the shared reducedMotionStyles block covers durations and
     iteration counts, so only the transform suppression needs stating here. */
  @media (prefers-reduced-motion: reduce) {
    .pagination-btn:hover:not([disabled]) {
      transform: none;
    }
  }
`;
