import { css, unsafeCSS } from "lit";
import typographyCss from "./typography.css?inline";

/**
 * Reduced Motion
 *
 * One universal rule, adopted by every component that animates. Reduced-motion
 * handling used to be per-component and inconsistent: post-card scoped rules
 * to individual selectors, post-list used `* { transition: none !important }`,
 * table-of-contents guarded a single class, tag-filter had nothing at all, and
 * navigation inverted the query with `no-preference` - which means its
 * animations were the only ones that stayed off by default and switched on
 * only when a preference was expressed.
 *
 * This has to live inside each shadow root. A rule in styles/style.css does
 * not cross the shadow boundary, which is why per-component blocks existed in
 * the first place; the fix is to share one block, not to move it out.
 *
 * Near-zero rather than `none`: a 0.01ms animation still fires its end event,
 * so anything sequencing on `animationend` or `transitionend` keeps working.
 * `animation-iteration-count: 1` is what actually stops the infinite pulses
 * (activeTagPulse, scroll-pulse, icon-loading, spin).
 *
 * See DF-22.
 */
export const reducedMotionStyles = css`
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
`;

/** Typography CSS is shared by the light DOM and every component shadow root. */
export const typographyStyles = unsafeCSS(typographyCss);

/**
 * Shared Button Styles
 *
 * Consistent button styling that can be imported into components
 */
export const buttonStyles = css`
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-sm) var(--space-md);
    border: 1px solid transparent;
    border-radius: var(--radius-sm);
    font-family: inherit;
    font-size: 1rem;
    line-height: 1.2777778rem;
    font-weight: var(--font-weight-medium);
    text-decoration: none;
    cursor: pointer;
    transition: all var(--transition-fast);
    user-select: none;
  }

  .btn:focus {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }

  .btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
  }

  /* Primary Button */
  .btn-primary {
    background-color: var(--color-on-surface);
    color: var(--color-text-inverse);
    border-color: var(--color-on-surface);
  }

  .btn-primary:hover:not(:disabled) {
    background-color: var(--color-on-surface-hover);
    border-color: var(--color-on-surface-hover);
  }

  /* Secondary Button */
  .btn-secondary {
    background-color: transparent;
    color: var(--color-text);
    border-color: var(--color-border-strong);
  }

  .btn-secondary:hover:not(:disabled) {
    background-color: var(--color-background-secondary);
    border-color: var(--color-on-surface);
    color: var(--color-on-surface);
  }

  /* Ghost Button */
  .btn-ghost {
    background-color: transparent;
    color: var(--color-text);
    border-color: transparent;
  }

  .btn-ghost:hover:not(:disabled) {
    background-color: var(--color-background-secondary);
    color: var(--color-on-surface);
  }

  /* Button Sizes */
  .btn-sm {
    padding: var(--space-xs) var(--space-sm);
    font-size: 0.8888889rem;
  }

  .btn-lg {
    padding: var(--space-md) var(--space-lg);
    font-size: 1.1111111rem;
  }

  /* Navigation Link Styles */
  .nav-link {
    display: inline-block;
    color: inherit;
    text-decoration: none;
    font-weight: var(--font-weight-medium);
    padding: var(--space-xs) var(--space-sm);
    border-radius: var(--radius-sm);
    transition: all var(--transition-fast);
    position: relative;
  }

  /* Hover fills rather than tinting. The header has no background of its own
     - it sits on the page gradient - so a white-alpha wash had nothing to
     lighten: it measured 1.03:1 against the gradient in base/dark, where the
     gradient's first stop is the surface color exactly. --color-on-surface is
     visible against the gradient in every scheme (3.25:1 to 9.98:1), and
     carries --color-text-inverse at 4.5:1 or better by contract. */
  .nav-link:hover {
    background-color: var(--color-on-surface);
    color: var(--color-text-inverse);
    text-decoration: none;
  }

  .nav-link:focus {
    outline: var(--focus-ring-width) var(--focus-ring-style)
      var(--focus-ring-color);
    outline-offset: var(--focus-ring-offset);
  }

  /* The current page is marked by weight plus the underline drawn in
     navigation.style.ts, not by a fill - so hover stays distinguishable from
     active instead of both rendering as the same chip. */
  .nav-link.active {
    font-weight: var(--font-weight-semibold);
  }

  /* Tag Button Styles */
  .tag-button {
    display: inline-flex;
    align-items: center;
    gap: var(--space-xs);
    padding: var(--space-xs) var(--space-sm);
    background: var(--color-background);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    color: var(--color-text);
    text-decoration: none;
    font-size: 0.9rem;
    font-weight: var(--font-weight-medium);
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .tag-button:hover {
    background: var(--color-background-secondary);
    border-color: var(--color-on-surface);
    color: var(--color-on-surface);
  }

  .tag-button:focus {
    outline: var(--focus-ring-width) var(--focus-ring-style)
      var(--focus-ring-color);
    outline-offset: var(--focus-ring-offset);
  }

  .tag-button.active {
    background: var(--color-on-surface);
    border-color: var(--color-on-surface);
    color: var(--color-text-inverse);
  }

  .tag-button .tag-count {
    background: var(--color-background-secondary);
    color: var(--color-text-secondary);
    padding: 2px 6px;
    border-radius: var(--radius-md);
    font-size: 0.75rem;
    font-weight: var(--font-weight-medium);
  }

  .tag-button.active .tag-count {
    background: var(--color-background-secondary);
    color: var(--color-text-secondary);
  }
`;

/**
 * Shared Layout Styles
 *
 * Common layout patterns and utilities
 */
export const layoutStyles = css`
  /* Container Styles */
  .container {
    max-width: var(--content-max-width);
    margin: 0 auto;
    padding: 0 var(--space-md);
  }

  /* Card Styles */
  .card {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    padding: var(--space-lg);
  }

  .card-header {
    padding-bottom: var(--space-md);
    border-bottom: 1px solid var(--color-border);
    margin-bottom: var(--space-md);
  }

  .card-footer {
    padding-top: var(--space-md);
    border-top: 1px solid var(--color-border);
    margin-top: var(--space-md);
  }

  /* Flex Utilities */
  .flex {
    display: flex;
  }

  .flex-col {
    flex-direction: column;
  }

  .items-center {
    align-items: center;
  }

  .justify-center {
    justify-content: center;
  }

  .justify-between {
    justify-content: space-between;
  }

  /* Spacing Utilities */
  .gap-xs {
    gap: var(--space-xs);
  }

  .gap-sm {
    gap: var(--space-sm);
  }

  .gap-md {
    gap: var(--space-md);
  }

  .gap-lg {
    gap: var(--space-lg);
  }
`;
