/**
 * Kanban Column Component Styles
 *
 * Visual styling for status columns in the Kanban board.
 * Columns contain draggable post cards.
 */

import { css } from "lit";

export const kanbanColumnStyles = css`
  :host {
    display: flex;
    flex-direction: column;
    min-width: 280px;
    max-width: 320px;
    flex: 1;
  }

  .column {
    display: flex;
    flex-direction: column;
    background: #fafafa;
    border-radius: 8px;
    height: 100%;
    overflow: hidden;
  }

  .column-header {
    padding: 1rem;
    background: white;
    border-bottom: 2px solid #e0e0e0;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .column-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: #424242;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .column-count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 20px;
    height: 20px;
    padding: 0 0.375rem;
    background: #e0e0e0;
    color: #616161;
    border-radius: 10px;
    font-size: 0.75rem;
    font-weight: 500;
  }

  .column-body {
    flex: 1;
    padding: 1rem;
    overflow-y: auto;
    min-height: 200px;
  }

  .column-body::-webkit-scrollbar {
    width: 8px;
  }

  .column-body::-webkit-scrollbar-track {
    background: transparent;
  }

  .column-body::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 4px;
  }

  .column-body::-webkit-scrollbar-thumb:hover {
    background: #999;
  }

  /* Drag states */
  .column.drag-over {
    background: #e8f5e9;
  }

  .column.drag-over .column-header {
    border-bottom-color: #4caf50;
    background: #f1f8f4;
  }

  .column-body.empty {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #9e9e9e;
    font-size: 0.875rem;
    font-style: italic;
  }

  .empty-message {
    text-align: center;
    padding: 2rem 1rem;
  }

  /* Status-specific colors */
  :host([status="planned"]) .column-header {
    border-bottom-color: #90caf9;
  }

  :host([status="researching"]) .column-header {
    border-bottom-color: #ce93d8;
  }

  :host([status="outlining"]) .column-header {
    border-bottom-color: #ffcc80;
  }

  :host([status="writing"]) .column-header {
    border-bottom-color: #ffab91;
  }

  :host([status="editing"]) .column-header {
    border-bottom-color: #fff59d;
  }

  :host([status="published"]) .column-header {
    border-bottom-color: #81c784;
  }

  :host([status="discarded"]) .column-header {
    border-bottom-color: #e0e0e0;
  }
`;
