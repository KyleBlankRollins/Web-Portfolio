# Admin System Quick Start Guide

## 🚀 Getting Started

### 1. Start the Admin System

```bash
cd /Users/kylerollins/Documents/GitHub/Web-Portfolio
npm run admin
```

This starts:

- **Admin Server** on http://localhost:4000
- **Admin UI** on http://localhost:4001

### 2. Access the Admin Interface

Open http://localhost:4001 in your browser

## 📋 What You'll See

### Kanban Board Layout

```
┌──────────────────────────────────────────────────────────────┐
│ 📝 Blog Post Admin                                           │
│ Manage your blog post backlog - drag and drop to change     │
├──────────────────────────────────────────────────────────────┤
│ ● Connected  📊 11 total  ✅ 2 published     🔄 Refresh     │
├──────────────────────────────────────────────────────────────┤
│ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐    │
│ │Planned │ │Research│ │Outline │ │Writing │ │Published│    │
│ │   8    │ │   0    │ │   0    │ │   1    │ │   2     │    │
│ ├────────┤ ├────────┤ ├────────┤ ├────────┤ ├────────┤    │
│ │ Post 1 │ │        │ │        │ │ Post 9 │ │ Post 10 │    │
│ │ Post 2 │ │        │ │        │ │        │ │ Post 11 │    │
│ │ Post 3 │ │        │ │        │ │        │ │         │    │
│ │ ...    │ │        │ │        │ │        │ │         │    │
│ └────────┘ └────────┘ └────────┘ └────────┘ └────────┘    │
└──────────────────────────────────────────────────────────────┘
```

## 🎯 How to Use

### Change Post Status

1. **Click and hold** on any post card
2. **Drag** the card to a different column
3. **Release** to drop
4. Status updates automatically in backlog.md

### Visual Feedback

- **Hover**: Cards highlight with blue border
- **Dragging**: Card becomes semi-transparent and rotates slightly
- **Drag Over Column**: Column background turns light green
- **Syncing**: Orange pulsing dot in toolbar

### Toolbar Features

- **Status Indicator**: Shows connection state
- **Stats**: Total posts and published count
- **Refresh Button**: Reloads data from backlog.md

## 🔧 Troubleshooting

### Admin UI won't load

```bash
# Check if server is running
curl http://localhost:4000/health

# Should return:
# {"status":"ok","backlogExists":true,"backlogPath":"..."}
```

### Posts not updating

1. Check server terminal for errors
2. Look for PATCH request logs
3. Verify backlog.md is writable
4. Check browser console for errors

### Server won't start

```bash
# Check if port 4000 is in use
lsof -i :4000

# Kill the process if needed
kill -9 <PID>
```

## 📁 File Locations

- **Backlog Source**: `source/site/content/__drafts/backlog.md`
- **Server Code**: `source/admin/server/`
- **UI Code**: `source/admin/ui/`
- **Components**: `source/admin/ui/components/`
- **Types**: `source/admin/types/`

## 🎨 Customization

### Change Column Order

Edit `COLUMNS` array in `source/admin/ui/components/kanban-board.ts`:

```typescript
const COLUMNS: ColumnConfig[] = [
  { status: "planned", title: "Planned", icon: "📋" },
  // Reorder or remove columns here
];
```

### Change Colors

Edit CSS files in `source/admin/ui/components/`:

- `kanban-board.css` - Overall layout
- `kanban-column.css` - Column styles and status colors
- `post-card.css` - Card styles and drag effects

### Add Post Metadata

1. Update `PostMetadata` interface in `source/admin/types/post-metadata.ts`
2. Update parser/writer to handle new fields
3. Update UI components to display new fields

## 📊 Current Posts (as of Oct 1, 2025)

**Planned (8):**

- Navigating a product deprecation
- Meeting SMEs where they are
- Docs and code examples in an LLM world
- Code example philosophy
- The promotion paradox
- Strategies for scaling yourself
- Inbox zero and only necessary tabs
- Intentional work patterns

**Writing (1):**

- Rule of thirds

**Published (2):**

- Typography test page
- LLM as SME

## 🚨 Important Notes

1. **Local Only**: Never deploy admin system to production
2. **Backup First**: Make a backup of backlog.md before major changes
3. **One User**: Not designed for multi-user scenarios
4. **No Auth**: No authentication - local dev only
5. **Manual Refresh**: UI doesn't auto-refresh when backlog.md changes externally

## 🎓 Learning Resources

- **LitElement**: https://lit.dev/
- **Drag and Drop API**: https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API
- **Express**: https://expressjs.com/
- **Component Documentation**: See `source/admin/ui/components/README.md`
