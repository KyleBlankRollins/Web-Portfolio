import { css } from "lit";

/**
 * Shared Typography Styles
 *
 * Typography system based on typography.css that can be imported
 * into web components to maintain consistent typography across
 * shadow DOM boundaries.
 */
export const typographyStyles = css`
  /* Typography Foundation */
  :host {
    font-family: var(--font-family-base);
    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1,
  h2,
  h3,
  h4,
  h5 {
    font-family: var(--font-family-heading);
  }
  h1,
  .h1 {
    font-size: 3rem;
    line-height: 3.63rem;
    margin-top: 0.91rem;
    margin-bottom: 1.81rem;
  }
  h2,
  .h2 {
    font-size: 2rem;
    line-height: 2.95rem;
    margin-top: 0.98rem;
    margin-bottom: 0.98rem;
  }
  h3,
  .h3 {
    font-size: 1.6111111rem;
    line-height: 2.5555556rem;
    margin-top: 1.2777778rem;
    margin-bottom: 0rem;
  }
  h4,
  .h4 {
    font-size: 1rem;
    line-height: 1.2777778rem;
    margin-top: 1.2777778rem;
    margin-bottom: 0rem;
  }
  h5,
  .h5 {
    font-size: 1rem;
    line-height: 1.2777778rem;
    margin-top: 1.2777778rem;
    margin-bottom: 0rem;
  }
  p,
  ul,
  ol,
  pre,
  table,
  blockquote {
    margin-top: 0rem;
    margin-bottom: 1.2777778rem;
  }
  ul ul,
  ol ol,
  ul ol,
  ol ul {
    margin-top: 0rem;
    margin-bottom: 0rem;
  }

  /* Let's make sure all's aligned */
  hr,
  .hr {
    border: 1px solid;
    margin: -1px 0;
  }
  b,
  i,
  strong,
  em,
  small,
  code {
    line-height: 0;
  }
  sub,
  sup {
    line-height: 0;
    position: relative;
    vertical-align: baseline;
  }
  sup {
    top: -0.5em;
  }
  sub {
    bottom: -0.25em;
  }

  /* Link Typography */
  a {
    color: var(--color-primary);
    text-decoration: none;
    transition: color var(--transition-fast);
  }

  a:hover {
    color: var(--color-primary-dark);
    text-decoration: underline;
  }

  /* UI Typography */
  .ui-label {
    font-family: var(--font-family-heading);
    font-size: var(--font-size-base);
  }
`;

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
    border-radius: 4px;
    font-family: inherit;
    font-size: 1rem;
    line-height: 1.2777778rem;
    font-weight: 500;
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
    background-color: var(--color-primary);
    color: var(--color-text-inverse);
    border-color: var(--color-primary);
  }

  .btn-primary:hover:not(:disabled) {
    background-color: var(--color-primary-dark);
    border-color: var(--color-primary-dark);
  }

  /* Secondary Button */
  .btn-secondary {
    background-color: transparent;
    color: var(--color-text);
    border-color: var(--color-border-dark);
  }

  .btn-secondary:hover:not(:disabled) {
    background-color: var(--color-background-secondary);
    border-color: var(--color-primary);
    color: var(--color-primary);
  }

  /* Ghost Button */
  .btn-ghost {
    background-color: transparent;
    color: var(--color-text);
    border-color: transparent;
  }

  .btn-ghost:hover:not(:disabled) {
    background-color: var(--color-background-secondary);
    color: var(--color-primary);
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
    font-weight: 500;
    padding: var(--space-xs) var(--space-sm);
    border-radius: 6px;
    transition: all var(--transition-fast);
    position: relative;
  }

  .nav-link:hover {
    background-color: rgba(255, 255, 255, 0.1);
    text-decoration: none;
  }

  .nav-link:focus {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }

  .nav-link.active {
    background-color: rgba(255, 255, 255, 0.2);
    font-weight: 600;
  }

  /* Tag Button Styles */
  .tag-button {
    display: inline-flex;
    align-items: center;
    gap: var(--space-xs);
    padding: var(--space-xs) var(--space-sm);
    background: var(--color-background);
    border: 1px solid var(--color-border);
    border-radius: 4px;
    color: var(--color-text);
    text-decoration: none;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .tag-button:hover {
    background: var(--color-background-secondary);
    border-color: var(--color-primary);
    color: var(--color-primary);
  }

  .tag-button:focus {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }

  .tag-button.active {
    background: var(--color-primary);
    border-color: var(--color-primary);
    color: var(--color-text-inverse);
  }

  .tag-button .tag-count {
    background: var(--color-background-secondary);
    color: var(--color-text-muted);
    padding: 2px 6px;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 500;
  }

  .tag-button.active .tag-count {
    background: rgba(255, 255, 255, 0.2);
    color: var(--color-text-inverse);
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
    max-width: var(--container-max-width);
    margin: 0 auto;
    padding: 0 var(--space-md);
  }

  /* Card Styles */
  .card {
    background: var(--color-background-secondary);
    border: 1px solid var(--color-border);
    border-radius: 8px;
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

/**
 * Shared Form Styles
 *
 * Consistent form input styling
 */
export const formStyles = css`
  .input {
    display: block;
    width: 100%;
    padding: var(--space-sm) var(--space-md);
    font-family: inherit;
    font-size: 1rem;
    line-height: 1.2777778rem;
    color: var(--color-text);
    background-color: var(--color-background);
    border: 1px solid var(--color-border);
    border-radius: 4px;
    transition: border-color var(--transition-fast);
  }

  .input:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px var(--color-primary-alpha);
  }

  .input:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: var(--color-background-muted);
  }

  .input::placeholder {
    color: var(--color-text-muted);
  }

  .label {
    display: block;
    font-weight: 500;
    margin-bottom: var(--space-xs);
    color: var(--color-text);
  }

  .form-group {
    margin-bottom: var(--space-md);
  }

  .form-error {
    color: var(--color-error);
    font-size: 0.8888889rem;
    margin-top: var(--space-xs);
  }

  .form-help {
    color: var(--color-text-muted);
    font-size: 0.8888889rem;
    margin-top: var(--space-xs);
  }
`;
