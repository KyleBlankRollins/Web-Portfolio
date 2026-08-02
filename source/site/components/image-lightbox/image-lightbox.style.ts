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
    transition:
      transform var(--transition-normal),
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
    border-radius: var(--radius-full);
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
    outline: 2px solid var(--color-on-surface);
    outline-offset: 2px;
  }

  /* Modal styles

     The backdrop covers the whole viewport. It was a 75vw x 75vh centred box,
     which read as a floating black rectangle rather than a lightbox - and
     since the dismiss handler is bound to .modal, the outer 25% of the screen
     was dead: clicking where a reader expects to dismiss did nothing. The size
     constraint belongs on .modal-content, which already carries it.

     z-index sits above the theme switcher's 1000. The two used to share 1000
     and never met, because the old 75vh box was centred and the switcher is
     pinned to the bottom edge. A full-viewport backdrop overlaps it, and at
     equal z-index the switcher won on document order - floating a page
     control on top of a modal overlay. */
  .modal {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    opacity: 0;
    visibility: hidden;
    transition:
      opacity var(--transition-normal),
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
    border-radius: var(--radius);
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

  /* Fixed, not absolute: .modal-content is position: relative, so an absolute
     close button anchored there landed over the top-right corner of the image
     instead of at the overlay's corner. */
  .modal-close {
    position: fixed;
    top: var(--space-lg);
    right: var(--space-lg);
    width: 44px;
    height: 44px;
    background: rgba(255, 255, 255, 0.2);
    border: none;
    border-radius: var(--radius-full);
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
    color: var(--color-text-secondary);
  }

  /* Error state */
  .error {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 200px;
    color: var(--color-error);
    text-align: center;
    padding: var(--space-md);
  }
`;
