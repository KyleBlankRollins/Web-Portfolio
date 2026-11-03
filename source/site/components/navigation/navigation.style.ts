import { css } from "lit";

export const navigationStyles = css`
  /* Host element - the <kbr-navigation> tag itself */
  :host {
    display: block;
  }

  /* Main navigation header */
  /* Sits on the flat page surface and is separated from it by a hairline,
     not a drop shadow - a shadow under a transparent bar reads as a floating
     strip once there is no gradient behind it. The brand gradient survives
     as the band along the top edge: the one place it still appears. */
  .site-header {
    background: transparent;
    padding: var(--space-md) 0;
    border-bottom: 1px solid var(--color-border);
    position: relative;
  }

  .site-header::before {
    content: "";
    display: block;
    position: absolute;
    inset: 0 0 auto 0;
    height: 4px;
    background: var(--gradient-primary);
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

  /* Hover is the filled chip from .nav-link in shared-styles.ts. The lift
     and drop shadow that used to accompany it are gone with the gradient. */
  .main-nav a {
    color: var(--color-text);
    display: block;
  }

  /* The current-page marker sits 2px below the link box, on the page
     surface - not on the hover chip - so it is measured against
     --color-background, where --color-text is the body text colour. */
  .main-nav a.active::after {
    content: "";
    position: absolute;
    bottom: -2px;
    left: 50%;
    transform: translateX(-50%);
    width: 20px;
    height: 2px;
    background-color: var(--color-text);
    border-radius: var(--radius-full);
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
      gap: var(--space-xs);
      padding-inline: var(--space-xs);
    }

    .header-actions {
      gap: var(--space-xs);
    }

    .main-nav ul {
      gap: 0;
      flex-wrap: wrap;
      justify-content: center;
    }

    .main-nav a {
      padding: var(--space-xs);
      font-size: var(--font-size-xs);
    }
  }

  /* The hover pulse used to sit inside @media (prefers-reduced-motion:
     no-preference), which inverted the guard: it was the only animation on
     the site that stayed off unless a preference was actively expressed, and
     browsers that report no preference at all never ran it. It is declared
     unconditionally now, and reducedMotionStyles suppresses it under
     a reduce preference like every other animation. See DF-22. */
  .main-nav a:hover {
    animation: subtle-pulse 0.3s ease;
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
