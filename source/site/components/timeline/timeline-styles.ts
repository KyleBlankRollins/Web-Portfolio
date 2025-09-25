import { css } from "lit";

export const timelineStyles = css`
  :host {
    display: block;
    position: relative;
  }

  .timeline {
    display: grid;
    grid-template-columns: 280px 1fr;
    grid-template-areas: "sidebar content";
    gap: var(--space-xl);
    max-width: var(--content-max-width);
    margin: 0 auto;
    padding: var(--space-lg);
    min-height: calc(
      100vh - 80px
    ); /* Account for navigation height */
  }

  .timeline-header {
    grid-area: content;
    text-align: center;
    margin-bottom: 3rem;
  }

  .timeline-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--color-text);
    margin: 0 0 1rem 0;
    line-height: 1.2;
  }

  .timeline-subtitle {
    font-size: 1.125rem;
    color: var(--color-text-secondary);
    margin: 0;
    line-height: 1.5;
  }

  .timeline-sidebar {
    grid-area: sidebar;
    min-width: 0; /* Prevent grid overflow */
  }

  .timeline-sidebar kbr-table-of-contents {
    position: sticky;
    top: var(--space-lg);
  }

  .timeline-content {
    grid-area: content;
    position: relative;
    min-width: 0; /* Prevent grid overflow */
  }

  .company-group {
    margin-bottom: 3rem;
  }

  .company-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .company-name {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--color-primary);
    text-decoration: none;
    transition: opacity 0.2s ease;
  }

  .company-name:hover {
    opacity: 0.8;
  }

  .company-name {
    a {
      color: var(--color-primary);
    }
  }

  .company-positions {
    position: relative;
    margin-bottom: 2rem;
    padding: 1rem 1.5rem 1rem 2rem;
  }

  .loading {
    text-align: center;
    padding: 3rem 1rem;
    color: var(--color-text-secondary);
  }

  .error {
    text-align: center;
    padding: 3rem 1rem;
    color: var(--color-error);
    background: var(--color-error-subtle);
    border-radius: 0.5rem;
    border: 1px solid var(--color-error);
  }

  @media (max-width: 1024px) {
    .timeline {
      grid-template-columns: 1fr;
      grid-template-areas:
        "sidebar"
        "content";
      gap: var(--space-lg);
      padding: var(--space-md);
    }

    .timeline-sidebar {
      order: 1;
    }

    .timeline-header,
    .timeline-content {
      order: 2;
    }
  }

  @media (max-width: 768px) {
    .timeline {
      padding: var(--space-sm);
      gap: var(--space-md);
    }

    .timeline-title {
      font-size: 2rem;
    }

    .timeline-subtitle {
      font-size: 1rem;
    }

    .company-header {
      padding: 1rem;
      margin-bottom: 1.5rem;
    }

    .company-name {
      font-size: 1.25rem;
    }

    .company-group {
      margin-bottom: 2rem;
    }
  }
`;
