import { css } from "lit";

export const navigationStyles = css`
  /* Host element - the <kbr-navigation> tag itself */
  :host {
    display: block;
  }

  /* Main navigation header */
  .site-header {
    background: linear-gradient(
      135deg,
      var(--color-primary) 0%,
      var(--color-accent) 100%
    );
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
    color: var(--color-text-inverse);
    text-decoration: none;
    transition: all var(--transition-fast);
    letter-spacing: 0.1em;
  }

  .logo a:hover {
    opacity: 0.8;
    transform: scale(1.05);
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
    color: var(--color-text-inverse);
    display: block;
    transform: translateY(0);
    box-shadow: none;
    transition: all var(--transition-fast);
  }

  .main-nav a:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  .main-nav a.active::after {
    content: "";
    position: absolute;
    bottom: -2px;
    left: 50%;
    transform: translateX(-50%);
    width: 20px;
    height: 2px;
    background-color: var(--color-text-inverse);
    border-radius: 1px;
    opacity: 0.9;
  }

  /* Focus states for accessibility */
  .logo a:focus,
  .main-nav a:focus {
    outline: 2px solid rgba(255, 255, 255, 0.8);
    outline-offset: 2px;
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

  /* Dark mode adjustments (if needed beyond theme variables) */
  @media (prefers-color-scheme: dark) {
    .main-nav a:hover {
      background-color: rgba(255, 255, 255, 0.15);
    }

    .main-nav a.active {
      background-color: rgba(255, 255, 255, 0.25);
    }
  }
`;
