# Admin UI Components

This directory contains the LitElement web components for the blog admin interface.

## Architecture

The admin UI uses a page-based architecture with navigation:

### Application Structure

```
admin-shell (Main app container)
├── admin-navigation (Left sidebar)
└── Page Router
    ├── manage-posts-page
    │   └── admin-kanban-board
    │       ├── admin-kanban-column (One per status)
    │       │   └── admin-post-card (Multiple per column)
    └── reports-page (Placeholder)
```

## Shell & Navigation Components

### 1. `admin-shell`

**Files:**

- `admin-shell.ts` - Main app shell component
- `admin-shell.styles.ts` - Shell layout styles

**Purpose:** Top-level application container that manages navigation and page routing.

**Responsibilities:**

- Contains the navigation sidebar and main content area
- Manages active page state
- Routes between different admin pages
- Provides the overall application layout

**State:**

- `activePage: string` - Currently active page ID

**Events Handled:**

- `page-change` - Fired by navigation when user switches pages

---

### 2. `admin-navigation`

**Files:**

- `admin-navigation.ts` - Navigation component
- `admin-navigation.styles.ts` - Navigation styles

**Purpose:** Left sidebar navigation for switching between admin pages.

**Responsibilities:**

- Displays list of available pages
- Highlights currently active page
- Emits page-change events when user clicks navigation items

**Props:**

- `activePage: string` - Currently active page (for highlighting)

**Events Dispatched:**

- `page-change` - When user clicks a navigation item
  ```typescript
  detail: {
    pageId: string;
  }
  ```

---

## Kanban Board Components

### 3. `admin-kanban-board`

**Files:**

- `kanban-board.ts` - Component logic
- `kanban-board.styles.ts` - Component styles (using Lit's `css` tagged template)

**Purpose:** Main orchestrator component that manages the entire Kanban board view.

**Responsibilities:**

- Fetches posts from the API on mount
- Manages loading and error states
- Handles post status updates via drag-and-drop
- Optimistically updates UI before syncing with server
- Provides toolbar with refresh button and stats

**Props:** None (self-contained)

**Events Handled:**

- `post-status-change` - Bubbled from columns when a post is dropped

**State:**

- `posts: PostMetadata[]` - All posts from the API
- `loading: boolean` - Loading state
- `error: string | null` - Error message if fetch fails
- `syncing: boolean` - True when updating post status

---

### 2. `admin-kanban-column`

**Files:**

- `kanban-column.ts` - Component logic
- `kanban-column.styles.ts` - Component styles (using Lit's `css` tagged template)

**Purpose:** Represents a single status column in the Kanban board.

**Responsibilities:**

- Displays posts for a specific status
- Handles drag-and-drop events (dragover, drop, etc.)
- Shows visual feedback during drag operations
- Dispatches `post-status-change` event when a post is dropped

**Props:**

- `status: PostStatus` - The status this column represents
- `title: string` - Display title for the column
- `posts: PostMetadata[]` - Posts to display in this column

**Events Dispatched:**

- `post-status-change` - When a post is dropped into this column
  ```typescript
  detail: {
    post: PostMetadata,
    newStatus: PostStatus
  }
  ```

---

## Page Components

### 4. `manage-posts-page`

**Files:**

- `manage-posts-page.ts` - Page component
- `manage-posts-page.styles.ts` - Page styles

**Purpose:** Container page for the Kanban board view.

**Responsibilities:**

- Provides page header with title and instructions
- Contains the Kanban board component
- Main page for managing blog post status

**Props:** None (activated via routing)

**Events:** None (passes through events from child components)

---

### 5. `reports-page`

**Files:**

- `reports-page.ts` - Page component
- `reports-page.styles.ts` - Page styles

**Purpose:** Placeholder page for future analytics and reporting features.

**Responsibilities:**

- Shows planned features list
- Provides UI for future analytics implementation

**Props:** None (activated via routing)

**State:** Currently a static placeholder

---

### 6. `admin-post-card`

**Files:**

- `post-card.ts` - Component logic
- `post-card.styles.ts` - Component styles (using Lit's `css` tagged template)

**Purpose:** Displays an individual blog post card that can be dragged.

**Responsibilities:**

- Renders post metadata (title, priority, date, tags)
- Handles drag start and end events
- Transfers post data via DataTransfer API
- Shows visual feedback during drag

**Props:**

- `post: PostMetadata` - The post to display

**Events Dispatched:**

- `post-drag-start` - When dragging begins
  ```typescript
  detail: {
    post: PostMetadata;
  }
  ```
- `post-drag-end` - When dragging ends
  ```typescript
  detail: {
    post: PostMetadata;
  }
  ```

**State:**

- `dragging: boolean` - Visual state while being dragged

## Styling Approach

Each component has its own `.styles.ts` file that exports Lit's `css` tagged template:

- **Type-Safe Styles**: Using Lit's `css` tagged template for type safety
- **Scoped Styles**: Shadow DOM ensures all styles are scoped to the component
- **No `unsafeCSS`**: Direct use of Lit's `css` function (safer than importing raw CSS)
- **Follows Portfolio Pattern**: Same approach used in the main portfolio site
- **CSS Custom Properties**: Can be used for theming (future enhancement)
- **Status Colors**: Column borders are color-coded by status
- **Responsive**: Horizontal scrolling for columns, vertical scrolling within columns

### Style File Pattern

```typescript
// component-name.styles.ts
import { css } from "lit";

export const componentStyles = css`
  :host {
    /* styles */
  }
`;

// component-name.ts
import { componentStyles } from "./component-name.styles.js";

static styles = componentStyles;
```

## Page Routing System

The admin UI uses a simple event-driven routing system without external dependencies:

### How It Works

1. **Navigation Component**: Displays page links in the sidebar

   - Each page has an ID, label, and icon
   - Clicking a link dispatches a `page-change` CustomEvent
   - Active page is visually highlighted

2. **Shell Component**: Manages routing

   - Listens for `page-change` events
   - Updates `activePage` state
   - Sets `?active` attribute on the active page component

3. **Page Components**: Show/hide based on routing
   - Use `display: none` when inactive
   - Full display when `?active` is present

### Adding New Pages

To add a new page:

1. Create the page component in `source/admin/ui/pages/`
2. Add an entry to `NAV_ITEMS` in `admin-navigation.ts`:
   ```typescript
   { id: "new-page", label: "New Page", icon: "🆕" }
   ```
3. Import the page component in `admin-shell.ts`
4. Add the page element in `admin-shell.ts` render method:
   ```html
   <new-page ?active=${this.activePage === "new-page"}></new-page>
   ```

## Data Flow

```
1. User opens admin UI → admin-shell loads
2. admin-shell renders navigation and manage-posts-page (default)
3. manage-posts-page loads kanban-board
4. kanban-board fetches posts from API
5. Posts are grouped by status and passed to columns
6. Columns render post-card components for each post
7. User drags post-card to new column
8. Column dispatches post-status-change event
9. kanban-board catches event and updates API
10. Board optimistically updates UI
11. On API success, UI stays updated
12. On API failure, UI reverts to previous state
```

## Drag-and-Drop Flow

```
1. User mousedown on post-card
2. post-card.handleDragStart()
   - Sets dragging=true
   - Stores post data in DataTransfer
   - Dispatches post-drag-start event
3. User drags over kanban-column
4. column.handleDragOver()
   - Prevents default to allow drop
   - Sets dragOver=true for visual feedback
5. User releases mouse
6. column.handleDrop()
   - Reads post data from DataTransfer
   - Dispatches post-status-change event
   - Sets dragOver=false
7. post-card.handleDragEnd()
   - Sets dragging=false
   - Dispatches post-drag-end event
8. kanban-board.handleStatusChange()
   - Optimistically updates posts array
   - Calls API to persist change
   - Reverts on failure
```

## Future Enhancements

- [ ] Add post creation form
- [ ] Edit post metadata inline
- [ ] Delete posts
- [ ] Filter by priority/tags
- [ ] Search functionality
- [ ] Keyboard navigation
- [ ] Undo/redo for status changes
- [ ] Bulk operations
- [ ] Post preview
- [ ] Sorting within columns
