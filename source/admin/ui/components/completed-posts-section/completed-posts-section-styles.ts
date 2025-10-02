import { css } from "lit";

export const completedPostsSectionStyles = css`
  :host {
    display: block;
    background: white;
    border-radius: 8px;
    padding: 1.5rem;
    margin: 0 0 1rem 1rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid #e0e0e0;
  }

  .section-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #2e7d32;
  }

  .post-count {
    font-size: 0.875rem;
    color: #666;
    background: #e8f5e9;
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
  }

  .controls {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .search-box {
    flex: 1;
    padding: 0.5rem 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 0.875rem;
  }

  .search-box:focus {
    outline: none;
    border-color: #2e7d32;
  }

  .sort-controls {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .sort-label {
    font-size: 0.875rem;
    color: #666;
  }

  .sort-select {
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 0.875rem;
    background: white;
    cursor: pointer;
  }

  .sort-select:focus {
    outline: none;
    border-color: #2e7d32;
  }

  .posts-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    max-height: 400px;
    overflow-y: auto;
  }

  .posts-list:empty::after {
    content: "No published posts yet";
    display: block;
    text-align: center;
    color: #999;
    padding: 2rem;
    font-style: italic;
  }

  .post-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    background: #fafafa;
    cursor: grab;
    transition: all 0.2s ease;
  }

  .post-item:hover {
    background: #f5f5f5;
    border-color: #2e7d32;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .post-item.dragging {
    opacity: 0.5;
    cursor: grabbing;
  }

  .post-info {
    flex: 1;
  }

  .post-title {
    font-weight: 500;
    color: #333;
    margin-bottom: 0.25rem;
  }

  .post-meta {
    font-size: 0.75rem;
    color: #666;
  }

  .drag-handle {
    color: #999;
    font-size: 1.25rem;
    padding: 0.5rem;
  }
`;
