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
│   └── style.css          # UI styles
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

The admin system uses `source/site/content/__drafts/backlog.md` as its single source of truth. Posts are organized by markdown sections:

```markdown
## Planned

- Post title 1
- Post title 2

## In Progress

- Post title 3

## Done

- Post title 4
```

### Section to Status Mapping

| Section Header            | PostStatus                |
| ------------------------- | ------------------------- |
| Planned                   | `planned`                 |
| In Progress / Researching | `writing` / `researching` |
| Outline                   | `outlining`               |
| Edit                      | `editing`                 |
| Review                    | `ready-for-review`        |
| Done                      | `published`               |
| Discarded                 | `discarded`               |

## Current Implementation Status

### ✅ Completed

- Admin directory structure
- BacklogParser - reads and parses backlog.md
- BacklogWriter - updates backlog.md while preserving formatting
- Express server with REST API
- Admin UI scaffold with basic interface
- npm scripts for easy launching
- TypeScript type definitions
- CORS configuration for local development

### 🚧 To Do

- Kanban board component with drag-and-drop
- Visual post status management
- Add/edit/delete post functionality in UI
- Post metadata editing (priority, dates, etc.)

## Design Principles

1. **Isolated Plugin**: Admin system is completely separate from main blog build
2. **Local Only**: Never deploy to production (CORS restricted to localhost)
3. **Markdown as Database**: backlog.md is the single source of truth
4. **Fail Safe**: Admin errors don't affect main blog build
5. **Graceful Degradation**: If admin fails, blog still works

## Testing

The admin server successfully:

- ✅ Starts on port 4000
- ✅ Parses backlog.md
- ✅ Returns posts via API
- ✅ Serves health check endpoint

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

## Next Steps

To complete the admin UI, implement the Kanban board component:

1. Install a drag-and-drop library (e.g., `@dnd-kit/core`)
2. Create `admin-kanban-board.ts` as a LitElement component
3. Integrate with the API for status updates
4. Add visual feedback for drag operations
