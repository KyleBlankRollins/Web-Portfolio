import { css } from "lit";

export const discardedPostsSectionStyles = css`
  :host {
    display: block;
    background: white;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    border: 2px dashed #e0e0e0;
    margin: 0 1rem 1rem 0;
  }

  :host(.drag-over) {
    border-color: #d32f2f;
    background: #ffebee;
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
    color: #d32f2f;
  }

  .post-count {
    font-size: 0.875rem;
    color: #666;
    background: #ffebee;
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
  }

  .drop-zone-hint {
    text-align: center;
    padding: 2rem;
    color: #999;
    font-style: italic;
    font-size: 0.875rem;
    border: 2px dashed #ddd;
    border-radius: 4px;
    margin-bottom: 1.5rem;
    background: #fafafa;
  }

  .drop-zone-hint.active {
    border-color: #d32f2f;
    background: #ffebee;
    color: #d32f2f;
  }

  .posts-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    max-height: 400px;
    overflow-y: auto;
  }

  .posts-list:empty::after {
    content: "No discarded posts";
    display: block;
    text-align: center;
    color: #999;
    padding: 2rem;
    font-style: italic;
  }

  .post-item {
    padding: 1rem;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    background: #fafafa;
  }

  .post-header {
    display: flex;
    justify-content: space-between;
    align-items: start;
    margin-bottom: 0.5rem;
  }

  .post-title {
    font-weight: 500;
    color: #666;
    text-decoration: line-through;
  }

  .post-date {
    font-size: 0.75rem;
    color: #999;
  }

  .discard-reason {
    font-size: 0.875rem;
    color: #d32f2f;
    background: #ffebee;
    padding: 0.5rem;
    border-radius: 4px;
    margin-top: 0.5rem;
    border-left: 3px solid #d32f2f;
  }

  .reason-label {
    font-weight: 600;
    margin-bottom: 0.25rem;
  }

  /* Modal styles */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal {
    background: white;
    border-radius: 8px;
    padding: 2rem;
    max-width: 500px;
    width: 90%;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .modal-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 1rem;
  }

  .modal-post-title {
    font-size: 0.875rem;
    color: #666;
    margin-bottom: 1.5rem;
    padding: 0.5rem;
    background: #f5f5f5;
    border-radius: 4px;
  }

  .modal-label {
    display: block;
    font-weight: 500;
    color: #333;
    margin-bottom: 0.5rem;
  }

  .modal-textarea {
    width: 100%;
    min-height: 100px;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-family: inherit;
    font-size: 0.875rem;
    resize: vertical;
  }

  .modal-textarea:focus {
    outline: none;
    border-color: #d32f2f;
  }

  .modal-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 1.5rem;
  }

  .modal-button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .modal-button.cancel {
    background: #f5f5f5;
    color: #666;
  }

  .modal-button.cancel:hover {
    background: #e0e0e0;
  }

  .modal-button.discard {
    background: #d32f2f;
    color: white;
  }

  .modal-button.discard:hover {
    background: #c62828;
  }

  .modal-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
