/**
 * Admin Shell Styles
 *
 * Main application layout with navigation and page content.
 */

import { css } from "lit";

export const adminShellStyles = css`
  :host {
    display: block;
    width: 100%;
    height: 100%;
  }

  .admin-shell {
    display: flex;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .page-container {
    flex: 1;
    overflow: hidden;
  }

  /* Hide inactive pages */
  .page-container > *:not([active]) {
    display: none;
  }
`;
