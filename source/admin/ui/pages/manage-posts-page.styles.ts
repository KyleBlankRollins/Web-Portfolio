/**
 * Manage Posts Page Styles
 *
 * Container for the Kanban board and post management tools.
 */

import { css } from "lit";

export const managePostsPageStyles = css`
  :host {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto 1fr auto;
    grid-template-areas:
      "page-header page-header"
      "toolbar toolbar"
      "kanban-board kanban-board"
      "completed-posts discarded-posts";
    gap: 1em;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .page-header {
    grid-area: page-header;
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

  .toolbar {
    grid-area: toolbar;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 2rem;
    background: white;
    border-bottom: 1px solid #e0e0e0;
  }

  .toolbar-left {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .toolbar-right {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .status-indicator {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: #666;
  }

  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #4caf50;
  }

  .status-dot.syncing {
    background: #ff9800;
    animation: pulse 1.5s ease-in-out infinite;
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  .action-button {
    padding: 0.5rem 1rem;
    border: 1px solid #e0e0e0;
    background: white;
    border-radius: 4px;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .action-button:hover {
    border-color: #2196f3;
    color: #2196f3;
  }

  .action-button:active {
    transform: scale(0.98);
  }

  .stats {
    display: flex;
    gap: 1rem;
    font-size: 0.875rem;
    color: #666;
  }

  .stat-item {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .kanban-section {
    grid-area: kanban-board;
    overflow: hidden;
  }

  completed-posts-section {
    grid-area: completed-posts;
    overflow: hidden;
  }

  discarded-posts-section {
    grid-area: discarded-posts;
    overflow: hidden;
  }
`;
