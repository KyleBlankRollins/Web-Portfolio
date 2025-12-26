import { css } from "lit";

export const postSeriesStyles = css`
  :host {
    display: block;
    margin-bottom: var(--space-lg, 2rem);
  }

  .series-container {
    border: 1px solid var(--color-border, #ccc);
    border-radius: var(--border-radius-md, 8px);
    padding: var(--space-md, 1rem);
    background-color: var(--color-surface, #fff);
  }

  .series-toggle {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--space-sm, 0.5rem);
    cursor: pointer;
    user-select: none;
    background: transparent;
    border: none;
    padding: 0;
    text-align: left;
    color: inherit;
    font-family: inherit;
  }

  .series-toggle:hover {
    opacity: 0.8;
  }

  .series-info {
    flex: 1;
    min-width: 0;
  }

  .series-name {
    font-weight: 600;
    font-size: var(--font-size-base, 1rem);
    color: var(--color-text, #000);
    margin: 0 0 var(--space-xs, 0.25rem) 0;
  }

  .series-position {
    font-size: var(--font-size-sm, 0.875rem);
    color: var(--color-text-secondary, #666);
    margin: 0;
  }

  .series-toggle-icon {
    width: 24px;
    height: 24px;
    flex-shrink: 0;
    transition: transform var(--transition-fast, 0.15s) ease;
    color: var(--color-text-secondary, #666);
  }

  .series-toggle-icon.collapsed {
    transform: rotate(-90deg);
  }

  .series-toggle-icon.expanded {
    transform: rotate(0deg);
  }

  .series-content {
    margin-top: var(--space-md, 1rem);
    padding-top: var(--space-md, 1rem);
    border-top: 1px solid var(--color-border, #ccc);
  }

  .series-content.collapsed {
    display: none;
  }

  .series-navigation {
    display: flex;
    gap: var(--space-sm, 0.5rem);
    margin-bottom: var(--space-md, 1rem);
  }

  .nav-button {
    flex: 1;
    padding: var(--space-sm, 0.5rem) var(--space-md, 1rem);
    background: var(--color-surface, #fff);
    border: 1px solid var(--color-border, #ccc);
    border-radius: var(--border-radius-sm, 4px);
    cursor: pointer;
    color: var(--color-text, #000);
    font-size: var(--font-size-sm, 0.875rem);
    text-decoration: none;
    text-align: center;
    transition: all var(--transition-fast, 0.15s) ease;
  }

  .nav-button:hover:not(:disabled) {
    background-color: var(--color-surface-hover, #f5f5f5);
    border-color: var(--color-border-hover, #999);
  }

  .nav-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .series-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .series-item {
    margin-bottom: var(--space-sm, 0.5rem);
  }

  .series-link {
    display: block;
    padding: var(--space-sm, 0.5rem) var(--space-md, 1rem);
    background: var(--color-surface, #fff);
    border: 1px solid var(--color-border, #ccc);
    border-radius: var(--border-radius-sm, 4px);
    color: var(--color-text, #000);
    text-decoration: none;
    transition: all var(--transition-fast, 0.15s) ease;
  }

  .series-link:hover {
    background-color: var(--color-surface-hover, #f5f5f5);
    border-color: var(--color-border-hover, #999);
  }

  .series-link.current {
    background-color: var(--color-primary-light, #e3f2fd);
    border-color: var(--color-primary, #2196f3);
    font-weight: 600;
  }

  .part-number {
    display: inline-block;
    min-width: 4ch;
    font-weight: 600;
    color: var(--color-text-secondary, #666);
  }

  .series-link.current .part-number {
    color: var(--color-primary, #2196f3);
  }

  .post-title {
    color: var(--color-text, #000);
  }

  .error-message {
    color: var(--color-error, #d32f2f);
    font-size: var(--font-size-sm, 0.875rem);
    margin: var(--space-sm, 0.5rem) 0;
  }
`;
