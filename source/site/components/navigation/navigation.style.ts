import { css } from "lit";

export const navigationStyles = css`
  /* Host element - the <kbr-navigation> tag itself */
  :host {
    display: block;
  }

  /* Main navigation header */
  .site-header {
    background: transparent; /* No background - rely on page-level gradient */
    padding: var(--space-md) 0;
    box-shadow: 0 2px 4px var(--color-shadow);
    position: relative;
  }

  /* Header content container */
  .header-content {
    max-width: var(--content-max-width);
    margin: 0 auto;
    padding: 0 var(--space-md);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  /* Logo styling */
  .logo a {
    font-family: var(--font-family-mono);
    font-size: var(--font-size-lg);
    font-weight: bold;
    color: var(--color-text);
    text-decoration: none;
    transition: all var(--transition-fast);
    letter-spacing: 0.1em;
  }

  .logo a:hover {
    opacity: 0.8;
    transform: scale(1.05);
  }

  /* Right-hand cluster: nav links plus the slotted theme switcher. */
  .header-actions {
    display: flex;
    align-items: center;
    gap: var(--space-lg);
  }

  /* Main navigation */
  .main-nav ul {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    gap: var(--space-lg);
  }

  .main-nav li {
    position: relative;
  }

  .main-nav a {
    color: var(--color-text);
    display: block;
    transform: translateY(0);
    box-shadow: none;
    transition: all var(--transition-fast);
  }

  .main-nav a:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px var(--color-shadow-strong);
  }

  /* The current-page marker sits 2px below the link box, on the header
     gradient - not on the hover chip - so it is measured against the
     gradient. --color-text-inverse was 1.58:1 to 2.09:1 there; --color-text
     is 4.76:1 at worst. */
  .main-nav a.active::after {
    content: "";
    position: absolute;
    bottom: -2px;
    left: 50%;
    transform: translateX(-50%);
    width: 20px;
    height: 2px;
    background-color: var(--color-text);
    border-radius: 1px;
    opacity: 0.9;
  }

  /* Focus states for accessibility

     These selectors outrank .nav-link:focus in shared-styles.ts
     ((0,2,1) vs (0,2,0)), so whatever they declare is what the user sees.
     They previously hardcoded a white ring, which was written for a dark
     header background that no longer exists: 2.02:1 and 2.19:1 in the two
     light schemes, failing WCAG 2.4.7 on the site's primary navigation. */
  .logo a:focus,
  .main-nav a:focus {
    outline: var(--focus-ring-width) var(--focus-ring-style)
      var(--focus-ring-color);
    outline-offset: var(--focus-ring-offset);
  }

  /* Responsive design */
  @media (max-width: 768px) {
    .header-content {
      padding: 0 var(--space-sm);
      gap: var(--space-sm);
    }

    .logo a {
      font-size: var(--font-size-base);
    }

    .main-nav ul {
      gap: var(--space-md);
    }

    .main-nav a {
      padding: var(--space-xs);
      font-size: 0.9rem;
    }
  }

  @media (max-width: 480px) {
    .header-content {
      flex-direction: column;
      gap: var(--space-sm);
      text-align: center;
    }

    /* Stack the cluster too. Kept as a row, the three nav links plus the
       switcher exceed the width of a phone and force the link list to wrap
       onto a second line underneath the button. */
    .header-actions {
      flex-direction: column;
      gap: var(--space-sm);
    }

    .main-nav ul {
      gap: var(--space-sm);
      flex-wrap: wrap;
      justify-content: center;
    }

    .main-nav a {
      padding: var(--space-xs) var(--space-sm);
      font-size: 0.85rem;
    }
  }

  /* Animation for better user experience */
  @media (prefers-reduced-motion: no-preference) {
    .main-nav a {
      transition: all var(--transition-normal);
    }

    .main-nav a:hover {
      animation: subtle-pulse 0.3s ease;
    }
  }

  @keyframes subtle-pulse {
    0%,
    100% {
      transform: translateY(-1px) scale(1);
    }
    50% {
      transform: translateY(-2px) scale(1.02);
    }
  }

  /* Removed: a @media (prefers-color-scheme: dark) block that re-applied
     white-alpha hover and active backgrounds.

     It keyed off the OS preference rather than [data-color-scheme], so it
     fired whenever the OS was dark - including when the reader had explicitly
     chosen the site's light scheme, where white-on-light is invisible. The
     hover and active states are now defined once, in theme-aware tokens, and
     work in every scheme without a second mechanism. See DF-12. */
`;
