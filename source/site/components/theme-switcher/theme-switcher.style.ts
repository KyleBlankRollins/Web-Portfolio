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
     it opens inward from the header rather than off the side of the page.

     A fixed width rather than max-content: two stacked fields need no more
     than this, and a popover that changes size with the longest theme name
     looks unplanned. The old single-row layout was both cramped (the row
     overflowed the panel) and oversized (it ran 440px wide to show two
     controls). */
  .theme-panel {
    position: absolute;
    top: calc(100% + var(--space-2));
    right: 0;
    z-index: 1000;
    box-sizing: border-box;
    width: 16rem;
    max-width: calc(100vw - var(--space-md) * 2);
    padding: var(--space-4);
    display: grid;
    gap: var(--space-4);
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

  /* A field is a label over a control. fieldset is used for the radio
     group, so it is reset to look like the div. */
  .field {
    display: grid;
    gap: var(--space-2);
    margin: 0;
    padding: 0;
    border: 0;
    min-width: 0;
  }

  /* Same voice as .eyebrow in typography.css, restated here because this
     is shadow DOM. Mono, small caps-sized, secondary - a label, not a
     heading. */
  .field-label {
    font-family: var(--font-family-mono);
    font-size: var(--font-size-xs);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-text-secondary);
    padding: 0;
  }

  .theme-dropdown {
    width: 100%;
    padding: var(--space-2) var(--space-3);
    border: var(--input-border-width) solid var(--color-border);
    border-radius: var(--radius-sm);
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

  .theme-dropdown:focus-visible {
    outline: var(--focus-ring-width) var(--focus-ring-style)
      var(--focus-ring-color);
    outline-offset: var(--focus-ring-offset);
    border-color: var(--color-border-interactive);
  }

  /* Segmented control for the colour scheme: two radio buttons styled as
     halves of one bordered track, the chosen half filled. Replaces a
     switch plus a "Mode: Dark" readout - the control now shows its own
     state, and both options are visible before choosing. The fill is
     --color-on-surface with inverse text, the same pairing the nav and
     table of contents use for a selected item. */
  .segmented {
    display: grid;
    grid-template-columns: 1fr 1fr;
    border: var(--input-border-width) solid var(--color-border);
    border-radius: var(--radius-sm);
    background: var(--color-background-secondary);
    overflow: hidden;
  }

  .segment {
    position: relative;
    display: block;
    cursor: pointer;
  }

  .segment input {
    position: absolute;
    inset: 0;
    margin: 0;
    opacity: 0;
    cursor: pointer;
  }

  .segment span {
    display: block;
    padding: var(--space-2) var(--space-3);
    text-align: center;
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    color: var(--color-text);
    transition:
      background-color var(--transition-fast),
      color var(--transition-fast);
  }

  .segment + .segment span {
    border-left: var(--input-border-width) solid var(--color-border);
  }

  .segment:hover span {
    background: var(--color-background-tertiary);
  }

  .segment input:checked + span {
    background: var(--color-on-surface);
    color: var(--color-text-inverse);
  }

  .segment input:focus-visible + span {
    outline: var(--focus-ring-width) var(--focus-ring-style)
      var(--focus-ring-color);
    outline-offset: calc(-1 * var(--focus-ring-width));
  }

  @media (max-width: 768px) {
    .theme-panel {
      padding: var(--space-3);
      gap: var(--space-3);
    }
  }

  /* High contrast mode adjustments */
  @media (prefers-contrast: high) {
    .collapsed-trigger,
    .theme-panel,
    .segmented {
      border-width: 2px;
    }
  }
`;
