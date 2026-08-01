import { css } from "lit";

export const tagFilterStyles = css`
  /* Host element - the <kbr-tag-filter> tag itself */
  :host {
    display: block;
    margin-bottom: 2rem;
  }

  .tag-filter-container {
    background: var(--color-surface);
    border-radius: var(--radius);
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
    font-weight: var(--font-weight-semibold);
    color: var(--color-text);
    margin: 0;
    font-size: 1rem;
  }

  .clear-filter-btn {
    background: none;
    border: 1px solid var(--color-border);
    padding: 0.25rem 0.75rem;
    border-radius: var(--radius-sm);
    cursor: pointer;
    font-size: 0.875rem;
    color: var(--color-text);
    transition: all 0.2s ease;
  }

  /* --color-accent is a mid-tone: as a fill it carried hardcoded white at
     1.96:1 in canney/light and 3.68:1 in base/light. --color-on-surface
     carries --color-text-inverse at 7.19:1 or better by contract. */
  .clear-filter-btn:hover {
    background: var(--color-on-surface);
    color: var(--color-text-inverse);
    border-color: var(--color-on-surface);
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
    box-shadow: var(--shadow-focus);
    z-index: 3;
  }

  .tag-button.active:focus {
    box-shadow: var(--shadow-focus), var(--shadow-md);
  }

  /* Focus styles during animation */
  .tag-button.animating:focus {
    outline: none;
    z-index: 4;
  }

  .tag-button.moving-to-top:focus {
    box-shadow: var(--shadow-focus), var(--shadow-lg);
    animation: moveToTopFocused 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }

  @keyframes moveToTopFocused {
    0% {
      transform: scale(1) translateY(0);
      box-shadow: var(--shadow-focus), var(--shadow-xs);
    }
    25% {
      transform: scale(1.08) translateY(-2px);
      box-shadow: var(--shadow-focus), var(--shadow-md);
    }
    50% {
      transform: scale(1.05) translateY(-4px);
      box-shadow: var(--shadow-focus), var(--shadow-lg);
    }
    75% {
      transform: scale(1.02) translateY(-1px);
      box-shadow: var(--shadow-focus), var(--shadow-sm);
    }
    100% {
      transform: scale(1) translateY(0);
      box-shadow: var(--shadow-focus), var(--shadow-xs);
    }
  }

  @keyframes activeTagPulse {
    0%,
    100% {
      box-shadow: var(--shadow-xs);
    }
    50% {
      box-shadow: var(--shadow-md);
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
      box-shadow: var(--shadow-xs);
      opacity: 1;
    }
    25% {
      transform: scale(1.08) translateY(-2px);
      box-shadow: var(--shadow-md);
    }
    50% {
      transform: scale(1.05) translateY(-4px);
      box-shadow: var(--shadow-lg);
    }
    75% {
      transform: scale(1.02) translateY(-1px);
      box-shadow: var(--shadow-sm);
    }
    100% {
      transform: scale(1) translateY(0);
      box-shadow: var(--shadow-xs);
    }
  }

  @keyframes moveFromTop {
    0% {
      transform: scale(1) translateY(0);
      box-shadow: var(--shadow-xs);
    }
    25% {
      transform: scale(0.95) translateY(1px);
      box-shadow: var(--shadow-xs);
    }
    50% {
      transform: scale(0.98) translateY(0);
      box-shadow: var(--shadow-xs);
    }
    75% {
      transform: scale(1.01) translateY(-1px);
      box-shadow: var(--shadow-xs);
    }
    100% {
      transform: scale(1) translateY(0);
      box-shadow: var(--shadow-xs);
    }
  }

  /* Tag button styles now use shared .tag-button class */

  .loading {
    text-align: center;
    padding: 2rem;
    color: var(--color-text);
  }

  /* -strong, not --color-error: the base token is a fill and is not readable
     on its own -subtle background. Same pairing as the admonitions in
     DF-20. */
  .error {
    color: var(--color-error-strong);
    text-align: center;
    padding: 1rem;
    background: var(--color-error-subtle);
    border-radius: var(--radius-sm);
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
    border-radius: var(--radius-sm);
    color: var(--color-text);
    font-size: 0.875rem;
    font-weight: var(--font-weight-medium);
    cursor: pointer;
    transition: all 0.2s ease;
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
  }

  /* --color-accent as label text measured 1.79:1 to 3.68:1 on
     --color-background across the four theme/scheme combinations. */
  .expand-tags-btn:hover {
    border-color: var(--color-on-surface);
    color: var(--color-on-surface);
    background: var(--color-background);
  }

  .expand-tags-btn:focus {
    outline: var(--focus-ring-width) var(--focus-ring-style)
      var(--focus-ring-color);
    outline-offset: var(--focus-ring-offset);
  }

  /* Removed: a @media (prefers-color-scheme: dark) block.

     It keyed off the OS setting rather than [data-color-scheme], so it fired
     against the reader's actual choice - and its .tag-button.active override
     used --color-accent where shared-styles.ts uses --color-on-surface, so
     which treatment you saw depended on your OS rather than on the theme you
     picked. See DF-12.

     Nothing replaced it. Every declaration it held either restated the
     token-driven base rule verbatim (.tag-filter-container, .filter-title,
     .expand-tags-btn:hover) or contradicted it. The one real difference was
     --color-border-strong instead of --color-border on two elements;
     --color-border already resolves to a scheme-appropriate value in every
     theme, so the base rule covers it. */

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
