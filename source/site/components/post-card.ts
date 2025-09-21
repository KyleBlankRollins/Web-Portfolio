/**
 * Blog Post Card Web Component
 *
 * A reusable card component for displaying individual blog posts in lists.
 * Used by kbr-post-list component.
 *
 * Usage: <kbr-post-card title="..." description="..." date="..." tags='["tag1", "tag2"]' url="..."></kbr-post-card>
 */

interface PostCardData {
  title: string;
  description: string;
  date: string;
  formattedDate: string;
  tags: string[];
  url: string;
}

class KbrPostCard extends HTMLElement {
  private data: PostCardData | null = null;

  static get observedAttributes() {
    return [
      "title",
      "description",
      "date",
      "formatted-date",
      "tags",
      "url",
    ];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.updateData();
    this.render();
  }

  attributeChangedCallback() {
    if (this.shadowRoot) {
      this.updateData();
      this.render();
    }
  }

  private updateData(): void {
    const tagsAttr = this.getAttribute("tags") || "[]";
    let tags: string[] = [];

    try {
      tags = JSON.parse(tagsAttr);
    } catch {
      // Fallback to comma-separated parsing
      tags = tagsAttr
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);
    }

    this.data = {
      title: this.getAttribute("title") || "Untitled Post",
      description: this.getAttribute("description") || "",
      date: this.getAttribute("date") || "",
      formattedDate:
        this.getAttribute("formatted-date") ||
        this.getAttribute("date") ||
        "",
      tags: tags,
      url: this.getAttribute("url") || "#",
    };
  }

  private render(): void {
    if (!this.shadowRoot || !this.data) return;

    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="/styles/component-typography.css">
      <link rel="stylesheet" href="/components/post-card.css">
      ${this.getCardHTML()}
    `;

    // Add event listeners for tag buttons
    this.attachEventListeners();
  }

  private getCardHTML(): string {
    if (!this.data) return "";

    const { title, description, formattedDate, date, tags, url } =
      this.data;

    return `
      <article class="post-card">
        <div class="post-card-content">
          <header class="post-card-header">
            <h3 class="post-card-title">
              <a href="${url}" class="post-title-link">${title}</a>
            </h3>
            ${
              formattedDate
                ? `
              <div class="post-card-date">
                <time datetime="${date}">${formattedDate}</time>
              </div>
            `
                : ""
            }
          </header>

          ${
            description
              ? `
            <div class="post-card-description">
              <p>${description}</p>
            </div>
          `
              : ""
          }

          ${
            tags.length > 0
              ? `
            <div class="post-card-tags">
              <div class="tag-list">
                ${tags
                  .map(
                    (tag) =>
                      `<button class="post-tag" data-tag="${tag}">${tag}</button>`
                  )
                  .join("")}
              </div>
            </div>
          `
              : ""
          }

          <footer class="post-card-footer">
            <a href="${url}" class="read-more-link">Read more →</a>
          </footer>
        </div>
      </article>
    `;
  }

  private attachEventListeners(): void {
    if (!this.shadowRoot) return;

    // Handle tag button clicks - navigate to blog page with tag filter
    const tagButtons = this.shadowRoot.querySelectorAll(".post-tag");

    tagButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        const tag = (e.target as HTMLElement).dataset.tag;

        if (tag) {
          // Navigate to blog page with tag filter (consistent with other tag buttons)
          const blogUrl = new URL(
            "/blog.html",
            window.location.origin
          );
          blogUrl.searchParams.set("tag", tag);
          window.location.href = blogUrl.href;
        }
      });
    });
  }
}

// Register the custom element
customElements.define("kbr-post-card", KbrPostCard);

export { KbrPostCard, type PostCardData };
