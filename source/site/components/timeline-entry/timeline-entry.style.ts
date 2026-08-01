import { css } from "lit";

export const timelineEntryStyles = css`
  :host {
    display: block;
    position: relative;
    margin-bottom: var(--space-lg);
  }

  .timeline-entry {
    background: var(--color-surface);
    border-radius: var(--radius);
    padding: var(--space-md);
    border: 1px solid var(--color-border);
    transition: all var(--transition-fast);
  }

  .timeline-entry:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .entry-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: var(--space-sm);
    gap: var(--space-sm);
  }

  .entry-title {
    flex: 1;
  }

  .job-title {
    font-size: 1.25rem;
    font-weight: var(--font-weight-semibold);
    color: var(--color-text);
    margin: 0;
    line-height: 1.3;
  }

  .entry-meta {
    text-align: right;
    font-size: 0.875rem;
    color: var(--color-text-secondary);
    line-height: 1.4;
  }

  .date-range {
    font-weight: var(--font-weight-medium);
    color: var(--color-text);
  }

  .duration,
  .employment-type,
  .location {
    display: block;
    margin-top: var(--space-1);
  }

  .description {
    margin-bottom: var(--space-sm);
    color: var(--color-text);
    line-height: 1.6;
    white-space: pre-line;
  }

  .skills {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-xs);
  }

  .skill-tag {
    display: inline-block;
    padding: var(--space-1) var(--space-3);
    background: var(--color-secondary);
    border-radius: var(--radius-lg);
    font-size: 0.75rem;
    font-weight: var(--font-weight-medium);
    text-transform: uppercase;
    letter-spacing: 0.025em;
    transition: background-color var(--transition-fast);
  }

  @media (max-width: 768px) {
    :host {
      margin-bottom: var(--space-md);
    }

    .timeline-entry {
      padding: var(--space-sm);
      border-radius: var(--radius-sm);
    }

    .entry-header {
      flex-direction: column;
      align-items: flex-start;
      gap: var(--space-xs);
      margin-bottom: var(--space-sm);
    }

    .entry-meta {
      text-align: left;
    }

    .job-title {
      font-size: 1.125rem;
    }

    .description {
      margin-bottom: var(--space-sm);
      font-size: var(--font-size-sm);
    }

    .skills {
      gap: var(--space-xs);
    }

    .skill-tag {
      padding: var(--space-1) var(--space-xs);
      font-size: 0.7rem;
    }
  }
`;
