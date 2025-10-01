/**
 * Admin UI Entry Point
 *
 * This initializes the admin interface for managing blog post backlog.
 * It connects to the admin server API running on port 4000.
 */

import "./style.css";
import "./components/admin-shell.js";

/**
 * Initialize the admin UI
 */
function init() {
  const app = document.getElementById("app");
  if (!app) return;

  // Mount the admin shell component
  app.innerHTML = `<admin-shell></admin-shell>`;
}

// Start the app when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
