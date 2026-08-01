import { css } from "lit";

export const themeSwitcherStyles = css`
  :host {
    display: block;
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
    transition: all var(--transition-normal);
  }

  /* Host styles for expanded state */
  :host(:not(.collapsed)) {
    width: 100%;
    max-width: 600px;
    padding: 0 var(--space-md);
  }

  /* Host styles for collapsed state */
  :host(.collapsed) {
    width: auto;
    padding: 0;
  }

  .theme-switcher {
    display: flex;
    flex-direction: column;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
    box-shadow: 0 -4px 12px var(--color-shadow);
    backdrop-filter: blur(10px);
    transition: all var(--transition-normal);
    overflow: hidden;
  }

  /* Collapsed state */
  .theme-switcher.collapsed {
    width: auto;
    max-width: none;
    padding: 0;
  }

  /* Expanded state */
  .theme-switcher.expanded {
    width: 100%;
    gap: var(--space-3);
    padding: var(--space-4);
  }

  /* Collapsed trigger */
  .collapsed-trigger {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-3) var(--space-4);
    cursor: pointer;
    transition: background-color var(--transition-normal);
  }

  .collapsed-trigger:hover {
    background: var(--color-background-tertiary);
  }

  /* Expanded header */
  .expanded-header {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-2) 0;
    cursor: pointer;
    border-bottom: 1px solid var(--color-border);
    margin-bottom: var(--space-3);
    transition: background-color var(--transition-normal);
  }

  .expanded-header:hover {
    background: var(--color-background-tertiary);
    margin: 0 calc(-1 * var(--space-4)) var(--space-3) calc(-1 * var(--space-4));
    padding: var(--space-2) var(--space-4);
  }

  /* Icon and text styling */
  .trigger-icon {
    font-size: 1.2em;
    color: var(--color-text);
  }

  .trigger-text {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    color: var(--color-text);
  }

  .theme-controls {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    flex: 1;
  }

  @media (min-width: 480px) {
    .theme-controls {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-lg);
    }
  }

  .theme-select {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  .theme-select label {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    color: var(--color-text-secondary);
    min-width: 48px;
  }

  .theme-dropdown {
    flex: 1;
    padding: var(--input-padding-y) var(--input-padding-x);
    border: var(--input-border-width) solid var(--color-border);
    border-radius: var(--input-border-radius);
    background: var(--color-background-secondary);
    color: var(--color-text);
    font-size: var(--font-size-sm);
    font-family: inherit;
    cursor: pointer;
    transition: border-color var(--transition-normal);
  }

  .theme-dropdown:hover {
    border-color: var(--color-border-interactive);
  }

  .theme-dropdown:focus {
    outline: var(--focus-ring-width) var(--focus-ring-style)
      var(--focus-ring-color);
    outline-offset: var(--focus-ring-offset);
    border-color: var(--color-border-interactive);
  }

  .color-scheme-toggle {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  .color-scheme-toggle label {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    color: var(--color-text-secondary);
    min-width: 48px;
  }

  .toggle-switch {
    position: relative;
    display: inline-flex;
    align-items: center;
    width: 48px;
    height: 24px;
  }

  .toggle-input {
    position: absolute;
    opacity: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    cursor: pointer;
  }

  .toggle-track {
    width: 100%;
    height: 100%;
    background: var(--color-border-strong);
    border-radius: var(--radius-full);
    transition: background-color var(--transition-normal);
    position: relative;
    pointer-events: none;
  }

  .toggle-input:checked + .toggle-track {
    background: var(--color-accent);
  }

  .toggle-thumb {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 20px;
    height: 20px;
    background: white;
    border-radius: var(--radius-full);
    box-shadow: 0 2px 4px var(--color-shadow);
    transition: transform var(--transition-normal);
    pointer-events: none;
  }

  .toggle-input:checked ~ .toggle-thumb {
    transform: translateX(24px);
  }

  .toggle-input:focus + .toggle-track {
    outline: var(--focus-ring-width) var(--focus-ring-style)
      var(--focus-ring-color);
    outline-offset: var(--focus-ring-offset);
  }

  /* Mobile adjustments for bottom-centered layout */
  @media (max-width: 768px) {
    :host {
      max-width: 100%;
      padding: 0 var(--space-sm);
    }

    .theme-switcher {
      padding: var(--space-3);
      border-radius: var(--radius-md) var(--radius-md) 0 0;
    }

    /* Force vertical layout on mobile */
    .theme-controls {
      flex-direction: column;
      gap: var(--space-3);
    }

    .theme-select,
    .color-scheme-toggle {
      width: 100%;
      flex-direction: row;
      justify-content: space-between;
    }

    .theme-dropdown {
      flex: 1;
      max-width: 200px;
    }

    .theme-select label,
    .color-scheme-toggle label {
      min-width: 80px;
      font-size: var(--font-size-sm);
    }
  }

  @media (max-width: 479px) {
    .theme-select label,
    .color-scheme-toggle label {
      min-width: 60px;
      font-size: var(--font-size-xs);
    }
  }

  /* High contrast mode adjustments */
  @media (prefers-contrast: high) {
    .theme-switcher {
      border-width: 2px;
    }

    .toggle-track {
      border: 2px solid var(--color-border-strong);
    }

    .toggle-thumb {
      border: 2px solid var(--color-border-strong);
    }
  }
`;
