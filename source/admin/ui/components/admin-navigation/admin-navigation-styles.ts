/**
 * Admin Navigation Styles
 *
 * Left sidebar navigation for switching between admin pages.
 */

import { css } from "lit";

export const adminNavigationStyles = css`
  :host {
    display: block;
    width: 240px;
    height: 100%;
    background: #2c3e50;
    color: white;
    flex-shrink: 0;
  }

  .nav-header {
    padding: 1.5rem 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .nav-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0;
    color: white;
  }

  .nav-subtitle {
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.6);
    margin-top: 0.25rem;
  }

  .nav-menu {
    padding: 1rem 0;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.875rem 1rem;
    margin: 0.25rem 0.5rem;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    font-size: 0.9rem;
    border: none;
    background: none;
    width: calc(100% - 1rem);
    text-align: left;
  }

  .nav-item:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }

  .nav-item.active {
    background: rgba(52, 152, 219, 0.3);
    color: white;
    font-weight: 500;
  }

  .nav-icon {
    font-size: 1.25rem;
    width: 24px;
    text-align: center;
  }

  .nav-label {
    flex: 1;
  }

  .nav-footer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.5);
  }
`;
