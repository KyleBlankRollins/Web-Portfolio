/**
 * Kanban Board Component Styles
 *
 * Main container for the Kanban board with horizontal scrolling columns.
 */

import { css } from "lit";

export const kanbanBoardStyles = css`
  :host {
    display: block;
    width: 100%;
    height: 100%;
  }

  .kanban-board {
    display: flex;
    gap: 1rem;
    padding: 1rem;
    height: 100%;
    overflow-x: auto;
    overflow-y: hidden;
  }

  .kanban-board::-webkit-scrollbar {
    height: 12px;
  }

  .kanban-board::-webkit-scrollbar-track {
    background: #f5f5f5;
    border-radius: 6px;
  }

  .kanban-board::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 6px;
  }

  .kanban-board::-webkit-scrollbar-thumb:hover {
    background: #999;
  }

  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 400px;
    color: #666;
    font-size: 1rem;
  }

  .loading-spinner {
    display: inline-block;
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #2196f3;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-right: 1rem;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .error {
    padding: 2rem;
    margin: 1rem;
    background: #ffebee;
    border: 1px solid #ef5350;
    border-radius: 8px;
    color: #c62828;
  }

  .error-title {
    font-weight: 600;
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }

  .error-message {
    font-size: 0.875rem;
    line-height: 1.5;
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
`;
