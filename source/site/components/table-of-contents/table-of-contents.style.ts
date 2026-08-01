import { css } from "lit";

export const tableOfContentsStyles = css`
  :host {
    display: block;
    width: 100%;
    height: fit-content;
    position: sticky;
    top: var(--space-lg);
  }

  .toc-wrapper {
    position: relative;
    background: var(--color-background-secondary);
    border: 1px solid var(--color-border);
    border-radius: var(--space-xs);
    overflow: hidden;
  }

  /* Toggle button for mobile */
  .toc-toggle {
    display: none; /* Hidden by default on desktop */
    width: 100%;
    padding: var(--space-md);
    background: var(--color-background-secondary);
    border: none;
    border-bottom: 1px solid var(--color-border);
    cursor: pointer;
    font-family: var(--font-family-heading);
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-medium);
    color: var(--color-text);
    text-align: left;
    transition: background-color var(--transition-fast);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .toc-toggle:hover {
    background: var(--color-background-tertiary);
  }

  .toc-toggle-icon {
    width: 20px;
    height: 20px;
    transition: transform var(--transition-fast);
  }

  .toc-toggle-icon.collapsed {
    transform: rotate(-90deg);
  }

  .toc-toggle-icon.expanded {
    transform: rotate(0deg);
  }

  .toc-content {
    position: relative;
  }

  .toc-content.hidden {
    display: none;
  }

  .toc-content.visible {
    display: block;
  }

  .toc-container {
    margin: var(--space-xs);
    max-height: min(calc(100vh - 8rem), 600px);
    overflow-y: auto;
    overflow-x: hidden;
  }

  /* Scroll Indicators */
  .scroll-indicator {
    position: absolute;
    left: 0;
    right: 0;
    height: 20px;
    background: linear-gradient(transparent, var(--color-background-secondary));
    pointer-events: none;
    opacity: 0;
    transition: opacity var(--transition-normal);
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .scroll-indicator.visible {
    opacity: 1;
  }

  .scroll-indicator-top {
    top: 0;
    background: linear-gradient(var(--color-background-secondary), transparent);
    border-radius: 8px 8px 0 0;
  }

  .scroll-indicator-bottom {
    bottom: 0;
    background: linear-gradient(transparent, var(--color-background-secondary));
    border-radius: 0 0 8px 8px;
  }

  .scroll-indicator-icon {
    width: 32px;
    height: 32px;
    color: var(--color-text-secondary);
    opacity: 0.7;
    animation: scroll-pulse 2s ease-in-out infinite;
  }

  @keyframes scroll-pulse {
    0%,
    100% {
      opacity: 0.4;
    }
    50% {
      opacity: 0.8;
    }
  }

  /* Navigation container - uses base typography from shared styles */
  .table-of-contents {
    font-size: 1rem;
    line-height: 1.2777778rem;
  }

  /* Lists */
  .toc-list,
  .toc-sublist {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .toc-sublist {
    margin-left: var(--space-md);
    margin-top: var(--space-xs);
  }

  /* List items */
  .toc-item {
    margin: 0;
    padding: 0;
  }

  .toc-item:not(:last-child) {
    margin-bottom: var(--space-xs);
  }

  /* Links */
  .toc-link {
    display: block;
    color: var(--color-text);
    text-decoration: none;
    padding: var(--space-xs) var(--space-sm);
    border-radius: 4px;
    line-height: 1.4;
    transition: all var(--transition-fast);
    border-left: 3px solid transparent;
  }

  .toc-link:hover {
    background: var(--color-primary);
    color: var(--color-accent-hover);
    text-decoration: none;
    border-left-color: var(--color-border-strong);
  }

  .toc-link:focus {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }

  .toc-link.active {
    background: var(--color-primary);
    font-weight: 500;
    border-left-color: var(--color-primary-active);
  }

  /* Level-specific styling with progressive indentation */
  .toc-level-1 .toc-link {
    font-weight: 500;
    font-size: 1em;
    padding-left: var(--space-sm);
  }

  .toc-level-2 .toc-link {
    font-size: 0.95em;
    padding-left: var(--space-sm);
  }

  .toc-level-3 .toc-link {
    font-size: 0.9em;
    opacity: 0.9;
    padding-left: calc(var(--space-sm) + 0.5rem);
  }

  .toc-level-4 .toc-link {
    font-size: 0.85em;
    opacity: 0.8;
    padding-left: calc(var(--space-sm) + 1rem);
  }

  .toc-level-5 .toc-link {
    font-size: 0.8em;
    opacity: 0.75;
    padding-left: calc(var(--space-sm) + 1.5rem);
  }

  .toc-level-6 .toc-link {
    font-size: 0.75em;
    opacity: 0.7;
    padding-left: calc(var(--space-sm) + 2rem);
  }

  /* Empty state */
  .toc-empty {
    color: var(--color-text-secondary);
    font-style: italic;
    text-align: center;
    margin: var(--space-md) 0;
  }

  /* Scrollbar styling */
  .toc-container::-webkit-scrollbar {
    width: 6px;
  }

  .toc-container::-webkit-scrollbar-track {
    background: var(--color-background);
    border-radius: 3px;
  }

  .toc-container::-webkit-scrollbar-thumb {
    background: var(--color-border-strong);
    border-radius: 3px;
  }

  .toc-container::-webkit-scrollbar-thumb:hover {
    background: var(--color-primary);
  }

  /* Responsive design */
  @media (max-width: 1024px) {
    :host {
      position: relative;
      top: 0;
    }

    .toc-container {
      max-height: min(calc(100vh - 6rem), 400px);
      margin-bottom: var(--space-xl);
    }
  }

  /* Mobile collapse/expand functionality */
  @media (max-width: 768px) {
    :host {
      position: sticky;
      top: var(--space-sm);
      z-index: 100;
    }

    .toc-toggle {
      display: flex; /* Show toggle button on mobile */
    }

    .toc-wrapper.collapsed .toc-content {
      display: none;
    }

    .toc-wrapper.expanded .toc-content {
      display: block;
    }

    .toc-content.hidden {
      display: none;
    }

    .toc-content.visible {
      display: block;
    }

    .toc-container {
      padding: var(--space-md);
      max-height: min(calc(100vh - 10rem), 300px);
    }

    .scroll-indicator-top {
      top: 48px; /* Account for toggle button height */
    }

    .toc-sublist {
      margin-left: var(--space-sm);
    }

    /* Reduce indentation on mobile for better space usage */
    .toc-level-3 .toc-link {
      padding-left: calc(var(--space-sm) + 0.25rem);
    }

    .toc-level-4 .toc-link {
      padding-left: calc(var(--space-sm) + 0.5rem);
    }

    .toc-level-5 .toc-link {
      padding-left: calc(var(--space-sm) + 0.75rem);
    }

    .toc-level-6 .toc-link {
      padding-left: calc(var(--space-sm) + 1rem);
    }

    .toc-link {
      padding: var(--space-xs);
    }
  }

  /* Animation preferences */
  @media (prefers-reduced-motion: reduce) {
    .toc-link {
      transition: none !important;
    }
  }
`;
