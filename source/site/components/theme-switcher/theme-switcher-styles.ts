import { css } from "lit";

export const themeSwitcherStyles = css`
  :host {
    display: block;
    position: fixed;
    bottom: var(--space-lg);
    left: var(--space-lg);
    z-index: 1000;
  }

  .theme-switcher {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    padding: var(--space-4);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    box-shadow: 0 4px 12px var(--color-shadow);
    min-width: 240px;
    backdrop-filter: blur(10px);
    background: rgba(255, 255, 255, 0.95);
  }

  [data-color-scheme="dark"] .theme-switcher {
    background: rgba(30, 41, 59, 0.95);
  }

  .theme-controls {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    flex: 1;
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
    background: var(--color-surface);
    color: var(--color-text);
    font-size: var(--font-size-sm);
    font-family: inherit;
    cursor: pointer;
    transition: border-color var(--transition-fast);
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
    transition: background-color var(--transition-fast);
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
    transition: transform var(--transition-fast);
    pointer-events: none;
  }

  .toggle-input:checked ~ .toggle-thumb {
    transform: translateX(24px);
  }

  .toggle-input:focus + .toggle-track {
    outline: var(--focus-ring-width) var(--focus-ring-style)
      var(--color-accent);
    outline-offset: var(--focus-ring-offset);
  }

  .toggle-icons {
    display: flex;
    align-items: center;
    gap: var(--space-1);
    font-size: var(--font-size-sm);
    margin-left: var(--space-2);
  }

  .icon-light,
  .icon-dark {
    transition: opacity var(--transition-fast);
  }

  .icon-light {
    opacity: 1;
  }

  .icon-dark {
    opacity: 0.5;
  }

  [data-color-scheme="dark"] .icon-light {
    opacity: 0.5;
  }

  [data-color-scheme="dark"] .icon-dark {
    opacity: 1;
  }

  .theme-preview {
    display: flex;
    align-items: center;
    gap: var(--space-1);
    padding: var(--space-2);
    margin-left: var(--space-2);
    border-radius: var(--radius);
    border: 1px solid var(--color-border);
    min-width: 60px;
  }

  .color-swatch {
    width: 12px;
    height: 12px;
    border-radius: var(--radius-sm);
    border: 1px solid var(--color-border-secondary);
  }

  .swatch-primary {
    background: var(--color-primary);
  }

  .swatch-accent {
    background: var(--color-accent);
  }

  .swatch-secondary {
    background: var(--color-secondary);
  }

  /* Compact mode for smaller screens */
  @media (max-width: 600px) {
    :host {
      bottom: var(--space-md);
      left: var(--space-md);
    }

    .theme-switcher {
      min-width: 200px;
      padding: var(--space-3);
    }

    .theme-controls {
      gap: var(--space-2);
    }

    .theme-select label,
    .color-scheme-toggle label {
      min-width: 36px;
      font-size: var(--font-size-xs);
    }
  }

  /* Mobile: Make it more compact */
  @media (max-width: 480px) {
    :host {
      bottom: var(--space-sm);
      left: var(--space-sm);
    }

    .theme-switcher {
      min-width: 180px;
      padding: var(--space-2);
    }

    .theme-preview {
      display: none; /* Hide preview on very small screens */
    }
  } /* High contrast mode adjustments */
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
