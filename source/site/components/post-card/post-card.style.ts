import { css } from "lit";

export const postCardStyles = css`
  /* Host element - the <kbr-post-card> tag itself */
  :host {
    display: block;
    margin-bottom: var(--space-lg);
  }

  .post-card {
    background: var(--color-background);
    border: 1px solid var(--color-border);
    border-radius: 12px;
    padding: var(--space-lg);
    transition: all var(--transition-normal);
    display: flex;
    flex-direction: column;
  }

  .post-card:hover {
    box-shadow: 0 8px 25px var(--color-shadow);
    transform: translateY(-2px);
    border-color: var(--color-border-strong);
  }

  .post-card-content {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  /* Header section */
  .post-card-header {
    margin-bottom: var(--space-md);
  }

  .post-card-title {
    margin: 0 0 var(--space-sm) 0;
    font-weight: 600;
  }

  .post-title-link {
    color: var(--color-primary);
    text-decoration: none;
    transition: color var(--transition-fast);
  }

  .post-title-link:hover {
    color: var(--color-primary-hover);
    text-decoration: underline;
  }

  .post-title-link:focus {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
    border-radius: 4px;
  }

  .post-card-date {
    margin-bottom: var(--space-xs);
  }

  .post-card-date time {
    color: var(--color-text-secondary);
    font-size: 0.9rem;
    font-style: italic;
  }

  /* Description section */
  .post-card-description {
    margin-bottom: var(--space-md);
    flex-grow: 1;
  }

  .post-card-description p {
    color: var(--color-text);
    line-height: var(--line-height-normal);
    margin: 0;
  }

  /* Tags section */
  .post-card-tags {
    margin-bottom: var(--space-md);
  }

  .tag-list {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-xs);
  }

  .post-tag {
    background-color: var(--color-background-secondary);
    border: 1px solid var(--color-border);
    color: var(--color-text);
    padding: var(--space-xs) var(--space-sm);
    border-radius: 14px;
    font-size: 0.75rem;
    font-weight: 500;
    cursor: pointer;
    transition: all var(--transition-fast);
    text-decoration: none;
  }

  .post-tag:hover {
    background-color: var(--color-accent);
    color: var(--color-text-inverse);
    transform: translateY(-1px);
    box-shadow: 0 2px 4px var(--color-shadow);
  }

  .post-tag:focus {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }

  /* Footer section */
  .post-card-footer {
    margin-top: auto;
    padding-top: var(--space-sm);
    border-top: 1px solid var(--color-border);
  }

  .read-more-link {
    color: var(--color-primary);
    text-decoration: none;
    font-weight: 500;
    font-size: 0.9rem;
    transition: all var(--transition-fast);
    display: inline-flex;
    align-items: center;
    gap: var(--space-xs);
  }

  .read-more-link:hover {
    color: var(--color-primary-hover);
    transform: translateX(4px);
  }

  .read-more-link:focus {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
    border-radius: 4px;
  }

  /* Responsive design */
  @media (max-width: 768px) {
    :host {
      margin-bottom: var(--space-md); /* Reduced from var(--space-lg) */
    }

    .post-card {
      padding: var(--space-sm); /* Reduced from var(--space-md) */
      border-radius: var(--radius-md);
    }

    .post-card-header {
      margin-bottom: var(--space-sm); /* Reduced */
    }

    .post-card-title {
      font-size: var(--font-size-lg);
      margin-bottom: var(--space-xs); /* Tighter */
    }

    .post-card-description {
      margin-bottom: var(--space-sm); /* Reduced */
    }

    .post-card-description p {
      font-size: var(--font-size-sm);
      line-height: 1.5;
    }

    .post-card-tags {
      margin-bottom: var(--space-sm); /* Reduced */
    }

    .tag-list {
      gap: var(--space-xs);
    }

    .post-tag {
      font-size: 0.7rem;
      padding: calc(var(--space-xs) * 0.8) var(--space-xs);
    }

    .post-card-footer {
      padding-top: var(--space-xs); /* Reduced */
    }

    .read-more-link {
      font-size: var(--font-size-sm);
    }
  }

  /* Animation preferences */
  @media (prefers-reduced-motion: reduce) {
    .post-card,
    .post-title-link,
    .post-tag,
    .read-more-link {
      transition: none;
    }

    .post-card:hover {
      transform: none;
    }

    .post-tag:hover {
      transform: none;
    }

    .read-more-link:hover {
      transform: none;
    }
  }
`;
