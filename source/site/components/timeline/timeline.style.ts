import { css } from "lit";

export const timelineStyles = css`
  :host {
    display: block;
    position: relative;
  }

  .timeline {
    display: grid;
    grid-template-columns: 280px 1fr;
    /* The header spans both columns so the page title sits above the
       sidebar and the entries rather than sharing a cell with either. */
    grid-template-areas:
      "header header"
      "sidebar content";
    gap: var(--space-xl);
    max-width: var(--content-max-width);
    margin: 0 auto;
    padding: var(--space-lg);
    min-height: calc(100vh - 80px); /* Account for navigation height */
  }

  .timeline-header {
    grid-area: header;
    text-align: center;
    margin-bottom: var(--space-md);
  }

  .timeline-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--color-text);
    margin: 0 0 var(--space-sm) 0;
    line-height: 1.2;
  }

  .timeline-subtitle {
    font-size: var(--font-size-md);
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

  .company-header {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .company-name {
    font-size: 1.5rem;
    font-weight: 600;
    margin-top: 0;
    color: var(--color-text);
    text-decoration: none;
    transition: opacity var(--transition-fast);

    a {
      color: var(--color-text);
    }
  }

  .company-name:hover {
    opacity: 0.8;
  }

  .company-positions {
    position: relative;
    padding: 1rem 1.5rem 1rem 2rem;
  }

  /* Neither state declares a grid area, so both span the full track set
     rather than being auto-placed into the 280px sidebar column. */
  .loading {
    grid-column: 1 / -1;
    text-align: center;
    padding: var(--space-xl) var(--space-sm);
    color: var(--color-text-secondary);
  }

  /* See tag-filter: the message text takes -strong so it is readable on the
     -subtle panel. The border keeps the base token - it sits against the page
     background, not the panel. */
  .error {
    grid-column: 1 / -1;
    text-align: center;
    padding: var(--space-xl) var(--space-sm);
    color: var(--color-error-strong);
    background: var(--color-error-subtle);
    border-radius: var(--radius);
    border: 1px solid var(--color-error);
  }

  @media (max-width: 1024px) {
    .timeline {
      grid-template-columns: 1fr;
      grid-template-areas:
        "header"
        "sidebar"
        "content";
      gap: var(--space-lg);
      padding: var(--space-md);
    }
  }

  @media (max-width: 768px) {
    .timeline {
      padding: 0; /* Remove all horizontal padding */
      gap: var(--space-md);
    }

    .timeline-title {
      font-size: 2rem;
    }

    .timeline-subtitle {
      font-size: 1rem;
    }

    .company-header {
      padding: 0 var(--space-sm);
      margin-bottom: 0;
    }

    .company-name {
      font-size: 1.25rem;
      margin-bottom: var(--space-xs); /* Add tight bottom margin */
    }

    .company-positions {
      padding: var(--space-sm);
    }
  }
`;
