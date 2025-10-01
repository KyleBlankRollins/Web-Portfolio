/**
 * Reports Page Styles
 *
 * Placeholder for future reporting functionality.
 */

import { css } from "lit";

export const reportsPageStyles = css`
  :host {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
  }

  .page-header {
    flex-shrink: 0;
    padding: 1.5rem 2rem;
    background: white;
    border-bottom: 1px solid #e0e0e0;
  }

  .page-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0 0 0.25rem 0;
    color: #212121;
  }

  .page-description {
    font-size: 0.875rem;
    color: #666;
    margin: 0;
  }

  .page-content {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }

  .placeholder {
    text-align: center;
    max-width: 500px;
  }

  .placeholder-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }

  .placeholder-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0 0 0.5rem 0;
    color: #424242;
  }

  .placeholder-text {
    font-size: 0.875rem;
    color: #757575;
    line-height: 1.6;
  }

  .feature-list {
    margin-top: 1.5rem;
    text-align: left;
    display: inline-block;
  }

  .feature-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0.5rem 0;
    font-size: 0.875rem;
    color: #616161;
  }

  .feature-icon {
    font-size: 1rem;
  }
`;
