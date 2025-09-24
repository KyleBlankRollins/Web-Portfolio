import { css } from "lit";

export const imageLightboxStyles = css`
  :host {
    display: block;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    border-radius: inherit;
  }

  .image-container {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    border-radius: inherit;
  }

  .image {
    width: 100%;
    height: auto;
    object-fit: contain;
    object-position: center;
    transition: transform var(--transition-normal),
      filter var(--transition-normal);
    border-radius: inherit;
  }

  /* Hover effects */
  .zoom-overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 50px;
    height: 50px;
    background: rgba(0, 0, 0, 0.7);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity var(--transition-fast);
    pointer-events: none;
    backdrop-filter: blur(10px);
    z-index: 1;
  }

  .zoom-icon {
    color: white;
    font-size: 20px;
  }

  :host(:hover) .zoom-overlay {
    opacity: 1;
  }

  /* :host(:hover) .image {
    transform: scale(1.02);
    filter: brightness(0.85);
  } */

  /* Focus styles for accessibility */
  :host(:focus) {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }

  /* Modal styles */
  .modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 75vw;
    height: 75vh;
    background-color: rgba(0, 0, 0, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    opacity: 0;
    visibility: hidden;
    transition: opacity var(--transition-normal),
      visibility var(--transition-normal);
    cursor: pointer;
    padding: var(--space-lg);
    box-sizing: border-box;
  }

  .modal.active {
    opacity: 1;
    visibility: visible;
  }

  .modal-content {
    position: relative;
    max-width: 75vw;
    max-height: 75vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: default;
  }

  .modal-image {
    width: 100%;
    height: auto;
    max-width: 100%;
    max-height: calc(75vh - 4rem);
    object-fit: contain;
    border-radius: 8px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  }

  .modal-caption {
    margin-top: var(--space-md);
    color: white;
    text-align: center;
    font-size: var(--font-size-sm);
    max-width: 600px;
    line-height: 1.4;
  }

  .modal-close {
    position: absolute;
    top: var(--space-lg);
    right: var(--space-lg);
    width: 44px;
    height: 44px;
    background: rgba(255, 255, 255, 0.2);
    border: none;
    border-radius: 50%;
    color: white;
    font-size: 24px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color var(--transition-fast);
    backdrop-filter: blur(10px);
    z-index: 1001;
  }

  .modal-close:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  .modal-close:focus {
    outline: 2px solid white;
    outline-offset: 2px;
  }

  /* Loading state */
  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 200px;
    color: var(--color-text-muted);
  }

  /* Error state */
  .error {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 200px;
    color: var(--color-error, #ef4444);
    text-align: center;
    padding: var(--space-md);
  }
`;
