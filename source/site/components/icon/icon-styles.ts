import { css } from "lit";

export const iconStyles = css`
  :host {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  svg {
    width: 1em;
    height: 1em;
    fill: currentColor;
    stroke: currentColor;
    display: block;
  }

  /* Icon size variants */
  :host(.icon-xs) svg {
    width: 0.75em;
    height: 0.75em;
  }
  :host(.icon-sm) svg {
    width: 0.875em;
    height: 0.875em;
  }
  :host(.icon-lg) svg {
    width: 1.25em;
    height: 1.25em;
  }
  :host(.icon-xl) svg {
    width: 1.5em;
    height: 1.5em;
  }
  :host(.icon-2xl) svg {
    width: 2em;
    height: 2em;
  }
  :host(.icon-3xl) svg {
    width: 3em;
    height: 3em;
  }

  /* Loading state */
  :host(.loading) svg {
    opacity: 0.5;
    animation: icon-loading 1s ease-in-out infinite alternate;
  }

  @keyframes icon-loading {
    from {
      opacity: 0.3;
    }
    to {
      opacity: 0.7;
    }
  }

  /* Error state */
  :host(.error) svg {
    color: var(--color-error, #ef4444);
  }
`;
