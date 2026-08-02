# Blog Admin System

## Overview

A local-only admin interface for managing blog post backlog via `backlog.md`. The admin system is completely isolated from the main blog build and runs as a plugin.

## Architecture

```
source/admin/
├── server/          # Express API server (port 4000)
│   ├── index.ts           # Server entry point
│   ├── api-routes.ts      # REST API endpoints
│   ├── backlog-parser.ts  # Parse backlog.md → JSON
│   └── backlog-writer.ts  # Update backlog.md
├── ui/              # Vite UI (port 4001)
│   ├── index.html         # UI entry point
│   ├── main.ts            # UI initialization
│   ├── style.css          # UI styles
│   └── components/        # LitElement web components
│       ├── kanban-board.ts   # Main Kanban board orchestrator
│       ├── kanban-board.css  # Board styles
│       ├── kanban-column.ts  # Status column component
│       ├── kanban-column.css # Column styles
│       ├── post-card.ts      # Individual post card
│       ├── post-card.css     # Card styles
│       └── README.md         # Component documentation
├── types/           # Shared TypeScript types
│   └── post-metadata.ts   # PostMetadata, PostStatus, etc.
└── vite.config.ts   # Vite config for admin UI
```

## Running the Admin System

### Start Both Server and UI

```bash
npm run admin
```

### Start Server Only

```bash
npm run admin:server
```

### Start UI Only

```bash
npm run admin:ui
```

## API Endpoints

All endpoints are available at `http://localhost:4000`:

- `GET /health` - Health check
- `GET /api/posts` - Get all posts from backlog.md
- `POST /api/posts` - Add a new post
- `PATCH /api/posts/:id` - Update a post's status
- `DELETE /api/posts/:id` - Remove a post

## Data Source

The admin system uses `source/site/content/__drafts/backlog.md` as its single source of truth. Posts are organized by markdown sections that correspond to the content lifecycle stages.

### Valid Section Headings

The parser only accepts the following exact section headings (case-sensitive):

```markdown
## Planned

- Post title 1
- Post title 2

## Researching

- Post title 3

## Outlining

- Post title 4

## Writing

- Post title 5

## Editing

- Post title 6

## Published

- Post title 7

## Discarded

- Post title 8
```

### Section to Status Mapping

| Section Header | PostStatus    |
| -------------- | ------------- |
| Planned        | `planned`     |
| Researching    | `researching` |
| Outlining      | `outlining`   |
| Writing        | `writing`     |
| Editing        | `editing`     |
| Published      | `published`   |
| Discarded      | `discarded`   |

**Note:** Section headings must match exactly. Unexpected headings will trigger a warning in the server logs and posts under those sections will default to `planned` status.

## Current Implementation Status

### ✅ Completed (v1.0)

**Backend:**

- Admin directory structure
- BacklogParser - reads and parses backlog.md
- BacklogWriter - updates backlog.md while preserving formatting
- Express server with REST API
- npm scripts for easy launching
- TypeScript type definitions
- CORS configuration for local development

**Frontend:**

- Admin UI scaffold with responsive layout
- Kanban board component with drag-and-drop
- Status columns (7 columns: planned → published)
- Post cards with metadata display
- Optimistic UI updates
- Visual feedback during drag operations
- Loading and error states
- Stats toolbar (total posts, published count)
- Full separation of concerns (logic/styles in separate files)

### 🚧 Future Enhancements (v2.0)

- Add post creation form
- Edit post metadata inline (priority, tags, notes)
- Delete posts functionality
- Filter by priority/tags
- Search functionality
- Keyboard navigation
- Undo/redo for status changes
- Bulk operations
- Post preview
- Sorting within columns

## Design Principles

1. **Isolated Plugin**: Admin system is completely separate from main blog build
2. **Local Only**: Never deploy to production (CORS restricted to localhost)
3. **Markdown as Database**: backlog.md is the single source of truth
4. **Fail Safe**: Admin errors don't affect main blog build
5. **Graceful Degradation**: If admin fails, blog still works

## Component Architecture

The admin UI uses LitElement web components with a clean separation of concerns:

### Component Hierarchy

```
admin-kanban-board (Main orchestrator)
├── Toolbar (stats, refresh button)
└── Columns Container (horizontal scroll)
    ├── admin-kanban-column (7 columns, one per status)
    │   └── admin-post-card (draggable cards)
```

### Data Flow

1. `kanban-board` fetches posts from API on mount
2. Posts grouped by status and passed to columns
3. Columns render `post-card` components
4. User drags card to new column
5. Column dispatches `post-status-change` event
6. Board catches event, updates API
7. UI updates optimistically (reverts on failure)

See `source/admin/ui/components/README.md` for detailed component documentation.

## Testing

The admin system is fully functional:

**Server:**

- ✅ Starts on port 4000
- ✅ Parses backlog.md successfully
- ✅ Returns posts via API
- ✅ Handles PATCH requests for status updates
- ✅ Logging middleware shows all requests

**UI:**

- ✅ Loads on port 4001
- ✅ Fetches and displays all posts
- ✅ Renders 7 status columns
- ✅ Shows post counts and stats
- ✅ Drag-and-drop works between columns
- ✅ Optimistic updates with error handling
- ✅ Visual feedback during drag operations

Example API response:

```json
{
  "success": true,
  "data": [
    {
      "id": "navigating-a-product-deprecation",
      "title": "Navigating a product deprecation",
      "status": "planned",
      "created": "2025-10-01"
    }
  ]
}
```

## Usage Guide

1. **Start the admin system:**

   ```bash
   npm run admin
   ```

   This starts both the server (port 4000) and UI (port 4001)

2. **Open the admin UI:**
   Navigate to http://localhost:4001

3. **Manage posts:**
   - View all posts organized by status in columns
   - Drag posts between columns to change status
   - Changes automatically sync to backlog.md
   - Refresh button reloads data from file

4. **Monitor status:**
   - Green dot = Connected
   - Orange dot (pulsing) = Syncing changes
   - Stats show total posts and published count
