# Visual Analytics Implementation Roadmap
## 1. Frontend Core UI Paradigm: Docking Layout & Dual-View Explorer
- **Docking Layout Engine:** Users can drag-and-drop to split the screen horizontally or vertically, grouping views into tabs (similar to VS Code). This supports simultaneous comparisons or quick tab switching.
- **Data Explorer (Dual-View):**
  - **Tree View (Sidebar default):** Hierarchical folder structure by domain/source for quick finding. Double-click or drag to open.
  - **Catalog View (Card/Thumbnail):** Expanded view showing data summaries, preview thumbnails, and metadata as cards for visually finding datasets.

## 2. Database Schema & State Management
- **`Workspace` Table:** Backend table to store layouts, open tabs, and view options as a single `JSONB` column.
  - Guarantees restoring the exact state upon the next login.
  - `id` (UUID), `user_id`, `title`, `layout_state` (JSONB), `is_shared` (Boolean).

## 3. URL Routing & Sharing Strategy
- **Share Full Workspace:** `/analytics/workspace/{uuid}` loads the full multi-pane layout state from the database.
- **Share Single View:** `/analytics/view?dataset=...` loads a specific standalone analytics view via URL parameters.

## 4. Implementation Steps
1. Create frontend docking layout scaffolding.
2. Build the Dual-View Data Explorer.
3. Design and implement the backend Workspace API and schema.
4. Integrate frontend state management to sync layout with the backend and URL.
