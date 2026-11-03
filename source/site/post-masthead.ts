/**
 * Sticky masthead on post pages.
 *
 * The contents bar is position: sticky (blog-post.css). CSS cannot tell a
 * stuck element from one still in flow, so a zero-height sentinel sits just
 * before it: once the sentinel has scrolled above the viewport the bar is
 * stuck, and data-stuck lets the stylesheet reveal the compact title.
 */
function initializePostMasthead(): void {
  const masthead = document.querySelector<HTMLElement>("[data-post-masthead]");
  const sentinel = document.querySelector<HTMLElement>(
    "[data-post-masthead-sentinel]"
  );
  if (!masthead || !sentinel || !("IntersectionObserver" in window)) {
    return;
  }

  const observer = new IntersectionObserver(
    ([entry]) => {
      const scrolledPast =
        !entry.isIntersecting && entry.boundingClientRect.top < 0;
      masthead.toggleAttribute("data-stuck", scrolledPast);
    },
    { threshold: 0 }
  );
  observer.observe(sentinel);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializePostMasthead, {
    once: true,
  });
} else {
  initializePostMasthead();
}
