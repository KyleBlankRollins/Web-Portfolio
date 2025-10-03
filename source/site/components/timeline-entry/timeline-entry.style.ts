import { css } from "lit";

export const timelineEntryStyles = css`
  :host {
    display: block;
    position: relative;
    margin-bottom: 2rem;
  }

  .timeline-entry {
    background: var(--color-background-secondary);
    border-radius: 8px;
    padding: 1.5rem;
    border: 1px solid var(--color-border);
    transition: all 0.2s ease;
  }

  .timeline-entry:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .entry-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
    gap: 1rem;
  }

  .entry-title {
    flex: 1;
  }

  .job-title {
    font-size: 1.25rem;
    font-weight: 600;
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
    font-weight: 500;
    color: var(--color-text);
  }

  .duration,
  .employment-type,
  .location {
    display: block;
    margin-top: 0.25rem;
  }

  .description {
    margin-bottom: 1rem;
    color: var(--color-text);
    line-height: 1.6;
    white-space: pre-line;
  }

  .skills {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .skill-tag {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    background: var(--color-secondary);
    border-radius: 1rem;
    font-size: 0.75rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.025em;
    transition: background-color 0.2s ease;
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
      padding: 0.2rem 0.6rem;
      font-size: 0.7rem;
    }
  }
`;
