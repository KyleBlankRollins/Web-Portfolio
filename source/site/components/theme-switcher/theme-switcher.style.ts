import { css } from "lit";

export const themeSwitcherStyles = css`
  /* Lives in the site header, slotted into .header-content by
     navigation.ts, and sits in normal flow rather than floating.

     It was position: fixed against the viewport - first bottom-centred, then
     bottom-left. Either way a fixed control overlaps page content at some
     width: bottom-centre put it inside the blog reading column, bottom-left
     clipped the portfolio's full-width cards. Occupying layout space in the
     header is what actually removes the collision. See DF-31.

     position: relative is the anchor for the expanded dropdown below. */
  :host {
    display: inline-block;
    position: relative;
  }

  .theme-switcher {
    position: relative;
  }

  /* The trigger stays in flow in both states, so the header does not reflow
     when the panel opens. */
  .collapsed-trigger {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-2) var(--space-3);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    font-family: inherit;
    cursor: pointer;
    transition:
      background-color var(--transition-normal),
      border-color var(--transition-normal);
  }

  .collapsed-trigger:hover {
    background: var(--color-background-tertiary);
    border-color: var(--color-border-interactive);
  }

  .collapsed-trigger:focus-visible {
    outline: var(--focus-ring-width) var(--focus-ring-style)
      var(--focus-ring-color);
    outline-offset: var(--focus-ring-offset);
  }

  .theme-switcher.expanded .collapsed-trigger {
    border-color: var(--color-border-interactive);
  }

  /* The panel drops below the trigger and is anchored to its right edge, so
     it opens inward from the header rather than off the side of the page. */
  .theme-panel {
    position: absolute;
    top: calc(100% + var(--space-2));
    right: 0;
    z-index: 1000;
    min-width: 320px;
    padding: var(--space-4);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    box-shadow: 0 4px 12px var(--color-shadow);
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

  @media (max-width: 768px) {
    /* The header stacks at these widths, so the panel is narrower than the
       320px desktop minimum and is capped to the viewport. It still opens
       from the trigger's right edge, which keeps it on screen. */
    .theme-panel {
      min-width: 0;
      width: max-content;
      max-width: calc(100vw - var(--space-md) * 2);
      padding: var(--space-3);
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
    .collapsed-trigger,
    .theme-panel {
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
