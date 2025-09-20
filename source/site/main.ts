// Import CSS for proper Vite hot reload
import "./styles/index.css";

// Import components
import "./components/navigation";
import "./components/post-list";
import "./components/post-card";
import "./components/table-of-contents";
import "./components/anchor-copy";
import "./components/tag-filter";

// Global tag navigation for individual blog post pages (main DOM)
function setupGlobalTagNavigation() {
  // Use event delegation on document for main DOM tag buttons
  document.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;

    // Check if clicked element is a blog-tag button in main DOM
    if (target.matches(".blog-tag[data-tag]")) {
      e.preventDefault();

      const tag = target.getAttribute("data-tag");
      if (tag) {
        const blogUrl = new URL("/blog.html", window.location.origin);
        blogUrl.searchParams.set("tag", tag);
        window.location.href = blogUrl.href;
      }
    }
  });
}

// Set up when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    setupGlobalTagNavigation
  );
} else {
  // DOM is already ready
  setupGlobalTagNavigation();
}
