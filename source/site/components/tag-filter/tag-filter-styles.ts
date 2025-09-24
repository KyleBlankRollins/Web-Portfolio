import { css } from "lit";

export const tagFilterStyles = css`
  /* Host element - the <kbr-tag-filter> tag itself */
  :host {
    display: block;
    margin-bottom: 2rem;
  }

  .tag-filter-container {
    background: var(--color-background-secondary);
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .filter-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .filter-title {
    font-weight: 600;
    color: var(--color-text);
    margin: 0;
    font-size: 1rem;
  }

  .clear-filter-btn {
    background: none;
    border: 1px solid var(--color-border);
    padding: 0.25rem 0.75rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.875rem;
    color: var(--color-text);
    transition: all 0.2s ease;
  }

  .clear-filter-btn:hover {
    background: var(--color-accent);
    color: white;
    border-color: var(--color-accent);
  }

  .clear-filter-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .tags-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    position: relative;
  }

  /* Enhanced animation for tag reordering */
  .tag-button {
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    transform: translateX(0) translateY(0);
    position: relative;
    z-index: 1;
    overflow: hidden;
  }

  .tag-button:active {
    transform: scale(0.95);
  }

  .tag-button.active {
    animation: activeTagPulse 2s ease-in-out infinite;
  }

  /* Enhanced focus styles for tag buttons */
  .tag-button:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(var(--accent-primary-rgb), 0.3);
    z-index: 3;
  }

  .tag-button.active:focus {
    box-shadow: 0 0 0 3px rgba(var(--accent-primary-rgb), 0.4),
      0 4px 16px rgba(var(--accent-primary-rgb), 0.2);
  }

  /* Focus styles during animation */
  .tag-button.animating:focus {
    outline: none;
    z-index: 4;
  }

  .tag-button.moving-to-top:focus {
    box-shadow: 0 0 0 3px rgba(var(--accent-primary-rgb), 0.5),
      0 8px 25px rgba(0, 0, 0, 0.25);
    animation: moveToTopFocused 0.6s cubic-bezier(0.4, 0, 0.2, 1)
      forwards;
  }

  @keyframes moveToTopFocused {
    0% {
      transform: scale(1) translateY(0);
      box-shadow: 0 0 0 3px rgba(var(--accent-primary-rgb), 0.3),
        0 1px 3px rgba(0, 0, 0, 0.1);
    }
    25% {
      transform: scale(1.08) translateY(-2px);
      box-shadow: 0 0 0 3px rgba(var(--accent-primary-rgb), 0.5),
        0 6px 20px rgba(0, 0, 0, 0.2);
    }
    50% {
      transform: scale(1.05) translateY(-4px);
      box-shadow: 0 0 0 3px rgba(var(--accent-primary-rgb), 0.6),
        0 8px 25px rgba(0, 0, 0, 0.25);
    }
    75% {
      transform: scale(1.02) translateY(-1px);
      box-shadow: 0 0 0 3px rgba(var(--accent-primary-rgb), 0.5),
        0 4px 15px rgba(0, 0, 0, 0.15);
    }
    100% {
      transform: scale(1) translateY(0);
      box-shadow: 0 0 0 3px rgba(var(--accent-primary-rgb), 0.4),
        0 2px 8px rgba(0, 0, 0, 0.12);
    }
  }

  @keyframes activeTagPulse {
    0%,
    100% {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
    }
    50% {
      box-shadow: 0 4px 16px rgba(var(--accent-primary-rgb), 0.3);
    }
  }
  .tag-button.animating {
    z-index: 2;
  }

  .tag-button.moving-to-top {
    animation: moveToTop 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }

  .tag-button.moving-from-top {
    animation: moveFromTop 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }

  @keyframes moveToTop {
    0% {
      transform: scale(1) translateY(0);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      opacity: 1;
    }
    25% {
      transform: scale(1.08) translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
    }
    50% {
      transform: scale(1.05) translateY(-4px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.25);
    }
    75% {
      transform: scale(1.02) translateY(-1px);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
    }
    100% {
      transform: scale(1) translateY(0);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
    }
  }

  @keyframes moveFromTop {
    0% {
      transform: scale(1) translateY(0);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
    }
    25% {
      transform: scale(0.95) translateY(1px);
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
    }
    50% {
      transform: scale(0.98) translateY(0);
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    }
    75% {
      transform: scale(1.01) translateY(-1px);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    100% {
      transform: scale(1) translateY(0);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
  }

  /* Tag button styles now use shared .tag-button class */

  .loading {
    text-align: center;
    padding: 2rem;
    color: var(--color-text);
  }

  .error {
    color: var(--error-color);
    text-align: center;
    padding: 1rem;
    background: var(--error-bg);
    border-radius: 4px;
  }

  /* Tag count styles now use shared .tag-count class */

  /* Expand/collapse controls */
  .expand-controls {
    margin-top: 1rem;
    text-align: center;
  }

  .expand-tags-btn {
    background: none;
    border: 1px solid var(--color-border);
    padding: 0.5rem 1rem;
    border-radius: 6px;
    color: var(--color-text);
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
  }

  .expand-tags-btn:hover {
    border-color: var(--color-accent);
    color: var(--color-accent);
    background: var(--color-background);
  }

  .expand-tags-btn:focus {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }

  /* Dark theme support */
  @media (prefers-color-scheme: dark) {
    .tag-filter-container {
      background: var(--color-background-secondary);
    }

    .filter-title {
      color: var(--color-text);
    }

    .tag-button {
      background: var(--color-background);
      border-color: var(--color-border-dark);
      color: var(--color-text);
    }

    .tag-button:hover {
      border-color: var(--color-accent);
      color: var(--color-accent);
    }

    .tag-button.active {
      background: var(--color-accent);
      border-color: var(--color-accent);
    }

    .expand-tags-btn {
      border-color: var(--color-border-dark);
      color: var(--color-text);
    }

    .expand-tags-btn:hover {
      border-color: var(--color-accent);
      color: var(--color-accent);
      background: var(--color-background);
    }
  }

  /* Mobile responsive */
  @media (max-width: 768px) {
    .tag-filter-container {
      padding: 1rem;
    }

    .filter-header {
      flex-direction: column;
      align-items: stretch;
      text-align: center;
    }

    .tags-grid {
      justify-content: center;
    }
  }
`;
