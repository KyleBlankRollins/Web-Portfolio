import { css } from "lit";

export const postListStyles = css`
  /* Host element - the <kbr-post-list> tag itself */
  :host {
    display: block;
    width: 100%;
  }

  .post-list-container {
    max-width: var(--content-max-width);
    margin: 0 auto;
    margin-top: calc(var(--space-lg) * -1);
    padding: var(--space-lg);
  }

  /* Header */
  .post-list-header {
    margin-bottom: var(--space-md);
    text-align: center;
  }

  .post-list-header h2 {
    color: var(--color-primary);
    margin: 0;
    font-weight: 600;
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
    border-top: 3px solid var(--color-primary);
    border-radius: 50%;
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
    color: var(--color-primary);
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
    border-radius: 6px;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: all var(--transition-fast);
    min-width: 44px;
    text-align: center;
  }

  .pagination-btn:hover:not([disabled]) {
    background: var(--color-background-secondary);
    border-color: var(--color-border-dark);
    transform: translateY(-1px);
  }

  .pagination-btn:focus {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }

  .pagination-btn.active {
    background: var(--color-primary);
    color: var(--color-text-inverse);
    border-color: var(--color-primary);
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
      padding: var(--space-md);
      margin-top: calc(var(--space-md) * -1);
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
      margin-top: calc(var(--space-sm) * -1);
      padding: var(--space-sm);
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
  @media (prefers-reduced-motion: reduce) {
    .loading-spinner {
      animation: none;
    }

    .pagination-btn:hover:not([disabled]) {
      transform: none;
    }

    * {
      transition: none !important;
    }
  }
`;
