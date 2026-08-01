import { css } from "lit";

export const postSeriesStyles = css`
  :host {
    display: block;
    margin-bottom: var(--space-lg);
  }

  .series-container {
    border: 1px solid var(--color-border);
    border-radius: var(--space-xs);
    padding: var(--space-sm);
    background-color: var(--color-surface);
  }

  .series-toggle {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--space-sm);
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
    font-size: var(--font-size-base);
    color: var(--color-text);
    margin: 0 0 var(--space-xs) 0;
  }

  .series-position {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    margin: 0;
  }

  .series-toggle-icon {
    width: 24px;
    height: 24px;
    flex-shrink: 0;
    transition: transform var(--transition-fast) ease;
    color: var(--color-text-secondary);
  }

  .series-toggle-icon.collapsed {
    transform: rotate(-90deg);
  }

  .series-toggle-icon.expanded {
    transform: rotate(0deg);
  }

  .series-content {
    margin-top: var(--space-md);
    padding-top: var(--space-md);
    border-top: 1px solid var(--color-border);
  }

  .series-content.collapsed {
    display: none;
  }

  .series-navigation {
    display: flex;
    gap: var(--space-sm);
    margin-bottom: var(--space-md);
  }

  .nav-button {
    flex: 1;
    padding: var(--space-xs) var(--space-sm);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--space-sm);
    cursor: pointer;
    color: var(--color-text);
    font-size: var(--font-size-sm);
    text-decoration: none;
    text-align: center;
    transition: all var(--transition-fast) ease;
    display: flex;
    flex-direction: column;
    min-height: 80px;
  }

  .nav-text {
    display: block;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .nav-arrow {
    display: block;
    font-size: var(--font-size-lg);
    opacity: 0.7;
    margin-top: var(--space-xs);
  }

  .nav-button:hover:not(:disabled) {
    background-color: var(--color-surface-hover);
    border-color: var(--color-border-strong);
  }

  .nav-button:hover:not(:disabled) .nav-arrow {
    opacity: 1;
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
    margin-bottom: var(--space-sm);
  }

  .series-link {
    display: block;
    padding: var(--space-sm) var(--space-md);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--space-sm);
    color: var(--color-text);
    text-decoration: none;
    transition: all var(--transition-fast) ease;
  }

  .series-link:hover {
    background-color: var(--color-surface-hover);
    border-color: var(--color-border-strong);
  }

  .series-link.current {
    background-color: var(--color-primary-subtle);
    border-color: var(--color-primary);
    font-weight: 600;
  }

  .part-number {
    display: inline-block;
    min-width: 4ch;
    font-weight: 600;
    color: var(--color-text-secondary);
  }

  .post-title {
    color: var(--color-text);
  }

  .error-message {
    color: var(--color-error);
    font-size: var(--font-size-sm);
    margin: var(--space-sm) 0;
  }
`;
