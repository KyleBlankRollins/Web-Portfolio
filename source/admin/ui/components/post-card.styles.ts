/**
 * Post Card Component Styles
 *
 * Visual styling for individual post cards in the Kanban board.
 * Cards are draggable and display post metadata.
 */

import { css } from "lit";

export const postCardStyles = css`
  :host {
    display: block;
    margin-bottom: 0.75rem;
  }

  .post-card {
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    padding: 0.875rem;
    cursor: grab;
    transition: all 0.2s ease;
    position: relative;
  }

  .post-card:hover {
    border-color: #2196f3;
    box-shadow: 0 2px 8px rgba(33, 150, 243, 0.15);
    transform: translateY(-1px);
  }

  .post-card.dragging {
    opacity: 0.5;
    cursor: grabbing;
    transform: rotate(2deg);
  }

  .post-card.drag-over {
    border-color: #4caf50;
    background: #f1f8f4;
  }

  .post-title {
    font-size: 0.875rem;
    font-weight: 500;
    color: #212121;
    margin-bottom: 0.5rem;
    line-height: 1.4;
  }

  .post-metadata {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    font-size: 0.75rem;
    color: #757575;
  }

  .metadata-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.125rem 0.5rem;
    background: #f5f5f5;
    border-radius: 12px;
  }

  .priority-badge {
    font-weight: 500;
  }

  .priority-high {
    background: #ffebee;
    color: #c62828;
  }

  .priority-medium {
    background: #fff3e0;
    color: #e65100;
  }

  .priority-low {
    background: #e3f2fd;
    color: #1565c0;
  }

  .drag-handle {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    width: 16px;
    height: 16px;
    opacity: 0.3;
    cursor: grab;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .drag-handle::before,
  .drag-handle::after {
    content: "";
    width: 100%;
    height: 2px;
    background: currentColor;
    border-radius: 1px;
  }

  .post-card:hover .drag-handle {
    opacity: 0.6;
  }

  .post-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
    margin-top: 0.5rem;
  }

  .tag {
    font-size: 0.7rem;
    padding: 0.125rem 0.375rem;
    background: #e8eaf6;
    color: #3f51b5;
    border-radius: 3px;
  }
`;
