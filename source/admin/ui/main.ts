/**
 * Admin UI Entry Point
 *
 * This initializes the admin interface for managing blog post backlog.
 * It connects to the admin server API running on port 4000.
 */

import "./style.css";
import type {
  PostMetadata,
  ApiResponse,
} from "../types/post-metadata.js";

const API_BASE = "http://localhost:4000";

/**
 * Fetch all posts from the admin API
 */
async function fetchPosts(): Promise<PostMetadata[]> {
  try {
    const response = await fetch(`${API_BASE}/api/posts`);
    const data: ApiResponse<PostMetadata[]> = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Failed to fetch posts");
    }

    return data.data || [];
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    throw error;
  }
}

/**
 * Update a post's status
 */
async function updatePostStatus(
  id: string,
  status: string
): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/api/posts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    const data: ApiResponse<unknown> = await response.json();
    return data.success;
  } catch (error) {
    console.error("Failed to update post:", error);
    return false;
  }
}

/**
 * Initialize the admin UI
 */
async function init() {
  const app = document.getElementById("app");
  if (!app) return;

  try {
    // Fetch posts from API
    const posts = await fetchPosts();

    // Clear loading message
    app.innerHTML = `
      <header>
        <h1>📝 Blog Post Admin</h1>
        <p class="subtitle">Manage your blog post backlog - drag and drop to change status</p>
      </header>
      <div class="posts-container">
        <div class="status-message">
          Loaded ${posts.length} posts from backlog.md
        </div>
        <div class="kanban-placeholder">
          <p>🚧 Kanban board component coming soon...</p>
          <p>Posts loaded: ${posts.map((p) => p.title).join(", ")}</p>
        </div>
      </div>
    `;

    console.log("Loaded posts:", posts);
  } catch (error) {
    app.innerHTML = `
      <header>
        <h1>📝 Blog Post Admin</h1>
        <p class="subtitle">Manage your blog post backlog</p>
      </header>
      <div class="error">
        <strong>Error:</strong> ${
          error instanceof Error ? error.message : "Unknown error"
        }
        <br><br>
        Make sure the admin server is running on port 4000.
        <br>
        Run: <code>npm run admin:server</code>
      </div>
    `;
  }
}

// Start the app
init();

// Export for testing
export { fetchPosts, updatePostStatus };
