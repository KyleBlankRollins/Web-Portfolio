/**
 * Manage Posts Page Styles
 *
 * Container for the Kanban board and post management tools.
 */

import { css } from "lit";

export const managePostsPageStyles = css`
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
    overflow: hidden;
  }
`;
