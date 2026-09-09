function initializeStaticBlog(): void {
  const blog = document.querySelector<HTMLElement>("[data-static-blog]");
  if (!blog) {
    return;
  }

  const tagButtons = Array.from(
    blog.querySelectorAll<HTMLButtonElement>("[data-tag]")
  );
  const postCards = Array.from(
    blog.querySelectorAll<HTMLElement>("[data-post-card]")
  );
  const clearButton = blog.querySelector<HTMLButtonElement>(
    "[data-clear-filter]"
  );
  const emptyState = blog.querySelector<HTMLElement>("[data-post-list-empty]");
  const resultsStatus = blog.querySelector<HTMLElement>(
    "[data-filter-results]"
  );

  const applyFilter = (tag: string | null): void => {
    const normalizedTag = tag?.toLowerCase() ?? null;
    let visibleCount = 0;

    for (const card of postCards) {
      const tags = (card.dataset.tags ?? "")
        .split("|")
        .map((value) => value.toLowerCase());
      const isVisible = !normalizedTag || tags.includes(normalizedTag);
      card.hidden = !isVisible;
      if (isVisible) {
        visibleCount += 1;
      }
    }

    for (const button of tagButtons) {
      const isActive =
        normalizedTag !== null &&
        button.dataset.tag?.toLowerCase() === normalizedTag;
      button.setAttribute("aria-pressed", String(isActive));
      button.classList.toggle("active", isActive);
    }

    if (clearButton) {
      clearButton.hidden = normalizedTag === null;
    }
    if (emptyState) {
      emptyState.hidden = visibleCount > 0;
    }
    if (resultsStatus) {
      resultsStatus.textContent = normalizedTag
        ? `${visibleCount} ${visibleCount === 1 ? "post" : "posts"} found for ${normalizedTag}.`
        : `${visibleCount} ${visibleCount === 1 ? "post" : "posts"} shown.`;
    }
  };

  const updateUrl = (tag: string | null): void => {
    const url = new URL(window.location.href);
    if (tag) {
      url.searchParams.set("tag", tag);
    } else {
      url.searchParams.delete("tag");
    }
    window.history.replaceState({}, "", url);
  };

  for (const button of tagButtons) {
    button.addEventListener("click", () => {
      const currentTag = new URL(window.location.href).searchParams.get("tag");
      const nextTag =
        currentTag?.toLowerCase() === button.dataset.tag?.toLowerCase()
          ? null
          : (button.dataset.tag ?? null);
      updateUrl(nextTag);
      applyFilter(nextTag);
      button.focus();
    });
  }

  for (const postTag of blog.querySelectorAll<HTMLButtonElement>(".post-tag")) {
    postTag.addEventListener("click", () => {
      const tag = postTag.dataset.tag;
      if (!tag) {
        return;
      }
      updateUrl(tag);
      applyFilter(tag);
      blog
        .querySelector<HTMLButtonElement>(
          `.tag-button[data-tag="${CSS.escape(tag)}"]`
        )
        ?.focus();
    });
  }

  clearButton?.addEventListener("click", () => {
    updateUrl(null);
    applyFilter(null);
  });

  applyFilter(new URL(window.location.href).searchParams.get("tag"));
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeStaticBlog, {
    once: true,
  });
} else {
  initializeStaticBlog();
}
