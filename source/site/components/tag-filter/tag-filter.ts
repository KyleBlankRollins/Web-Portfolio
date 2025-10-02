import { LitElement, html } from "lit";
import { customElement, state, property } from "lit/decorators.js";
import { tagFilterStyles } from "./tag-filter.style.js";
import {
  typographyStyles,
  buttonStyles,
  layoutStyles,
} from "../../styles/shared-styles.js";

/**
 * Blog Tag Filter Web Component
 *
 * This component displays all available tags and allows filtering the blog post list.
 * Works in conjunction with kbr-post-list to provide tag-based filtering.
 *
 * Usage: <kbr-tag-filter></kbr-tag-filter>
 */

interface BlogManifest {
  posts: any[];
  totalPosts: number;
  availableTags: string[];
  tagsWithCounts: { tag: string; count: number }[];
  generatedAt: string;
}

@customElement("kbr-tag-filter")
export default class KbrTagFilter extends LitElement {
  @property({ type: String, attribute: "active-tag" })
  declare activeTag: string | null;

  @state()
  declare private tagsWithCounts: { tag: string; count: number }[];

  @state()
  declare private isLoading: boolean;

  @state()
  declare private visibleTagCount: number;

  @state()
  declare private isExpanded: boolean;

  @state()
  declare private orderedTags: { tag: string; count: number }[];

  @state()
  declare private animatingTags: Set<string>;

  private originalTagsOrder: { tag: string; count: number }[] = [];
  private previousActiveTag: string | null = null;

  static styles = [
    typographyStyles,
    buttonStyles,
    layoutStyles,
    tagFilterStyles,
  ];

  constructor() {
    super();

    // Initialize properties
    this.activeTag = null;
    this.tagsWithCounts = [];
    this.isLoading = false;
    this.visibleTagCount = 5;
    this.isExpanded = false;
    this.orderedTags = [];
    this.originalTagsOrder = [];
    this.animatingTags = new Set();
    this.previousActiveTag = null;
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadAvailableTags();
  }

  updated(changedProperties: Map<PropertyKey, unknown>) {
    super.updated(changedProperties);

    if (
      changedProperties.has("activeTag") &&
      !this.isLoading &&
      this.tagsWithCounts.length > 0
    ) {
      // Update tag order when active tag changes
      this.updateTagOrder();
    }
  }

  firstUpdated() {
    // Check for URL parameters after first render
    this.checkUrlParameters();
  }

  /**
   * Check URL query parameters for tag filtering
   */
  private checkUrlParameters(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const tagParam = urlParams.get("tag");

    if (tagParam) {
      // Set both the internal state and the attribute
      this.activeTag = tagParam;

      // Use a small delay to ensure other components are ready
      setTimeout(() => {
        this.notifyPostList(tagParam);
      }, 50);
    }
  }

  /**
   * Load available tags from blog manifest
   */
  private async loadAvailableTags(): Promise<void> {
    this.isLoading = true;

    try {
      // Use relative URL for manifest
      const manifestUrl = `/data/blog-manifest.json`;

      const response = await fetch(manifestUrl);
      if (!response.ok) {
        throw new Error(
          `Failed to load tags: ${response.status} ${response.statusText}`
        );
      }

      const manifest: BlogManifest = await response.json();
      this.tagsWithCounts = manifest.tagsWithCounts || [];

      // Store original order and initialize ordered tags
      this.originalTagsOrder = [...this.tagsWithCounts];
      this.updateTagOrder();

      this.isLoading = false;

      // Check for URL parameter after tags are loaded and rendered
      this.checkUrlParameters();
    } catch (error) {
      console.error("Failed to load available tags:", error);
      this.isLoading = false;
    }
  }

  private updateTagOrder(): void {
    // Determine which tags need animation
    const newActiveTag = this.activeTag;
    const oldActiveTag = this.previousActiveTag;

    // Clear any existing animations
    this.animatingTags.clear();

    // Add animations for tags that are changing position
    if (oldActiveTag && oldActiveTag !== newActiveTag) {
      this.animatingTags.add(oldActiveTag);
    }
    if (newActiveTag && newActiveTag !== oldActiveTag) {
      this.animatingTags.add(newActiveTag);
    }

    // Update the tag order immediately for layout
    if (!this.activeTag) {
      // No active tag, use original order
      this.orderedTags = [...this.originalTagsOrder];
    } else {
      // Find the active tag and move it to the top
      const activeTagData = this.originalTagsOrder.find(
        (tagData) => tagData.tag === this.activeTag
      );

      if (activeTagData) {
        // Create new order with active tag first, then remaining tags in original order
        const remainingTags = this.originalTagsOrder.filter(
          (tagData) => tagData.tag !== this.activeTag
        );
        this.orderedTags = [activeTagData, ...remainingTags];
      } else {
        // Active tag not found, use original order
        this.orderedTags = [...this.originalTagsOrder];
      }
    }

    // Update previous active tag for next animation
    this.previousActiveTag = this.activeTag;

    // Clear animations after animation duration
    if (this.animatingTags.size > 0) {
      setTimeout(() => {
        this.animatingTags.clear();
        this.requestUpdate();
      }, 600); // Match animation duration
    }
  }

  render() {
    if (this.isLoading) {
      return html`
        <div class="tag-filter-container">
          <div class="loading">Loading tags...</div>
        </div>
      `;
    }

    if (this.tagsWithCounts.length === 0) {
      return html`
        <div class="tag-filter-container">
          <div class="error">
            No tags found. Make sure blog posts have tags defined.
          </div>
        </div>
      `;
    }

    // Determine how many tags to show from ordered tags (fallback to empty array)
    const orderedTagsToUse =
      this.orderedTags.length > 0 ? this.orderedTags : this.tagsWithCounts;
    const tagsToShow = this.isExpanded
      ? orderedTagsToUse
      : orderedTagsToUse.slice(0, this.visibleTagCount);

    return html`
      <div class="tag-filter-container">
        <div class="filter-header">
          <div class="ui-label filter-title">Filter by Tag</div>
        </div>
        <div class="tags-grid">
          ${tagsToShow.map(({ tag, count }) => {
            const isActive = this.activeTag === tag;
            const isAnimating = this.animatingTags.has(tag);
            const wasActive = this.previousActiveTag === tag && !isActive;

            let animationClass = "";
            if (isAnimating) {
              if (isActive) {
                animationClass = "moving-to-top";
              } else if (wasActive) {
                animationClass = "moving-from-top";
              }
            }

            return html`<button
              class="tag-button ${isActive
                ? "active"
                : ""} ${animationClass} ${isAnimating ? "animating" : ""}"
              @click="${() => this.handleTagClick(tag)}"
              @keydown="${(e: KeyboardEvent) => this.handleTagKeydown(e, tag)}"
              data-tag="${tag}"
              tabindex="0"
              aria-pressed="${isActive}"
            >
              ${tag} <span class="tag-count">(${count})</span>
            </button>`;
          })}
        </div>
        ${orderedTagsToUse.length > this.visibleTagCount
          ? html`<div class="expand-controls">
              ${this.renderExpandButton()}
            </div>`
          : ""}
      </div>
    `;
  }

  private renderExpandButton() {
    if (this.isExpanded) {
      return html`<button class="expand-tags-btn" @click="${this.collapseTags}">
        Less tags
      </button>`;
    } else {
      const remaining = this.tagsWithCounts.length - this.visibleTagCount;
      return html`<button class="expand-tags-btn" @click="${this.expandTags}">
        More tags (+${remaining})
      </button>`;
    }
  }

  /**
   * Handle tag filter selection
   */
  private handleTagClick(tag: string): void {
    // Toggle tag selection - if same tag is clicked, clear filter
    if (this.activeTag === tag) {
      this.clearFilter();
    } else {
      // Clear any existing filter and set new tag
      this.setActiveTag(tag);
    }
  }

  private handleTagKeydown(e: KeyboardEvent, tag: string): void {
    // Handle Enter and Space key presses
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      this.handleTagClick(tag);
    }
  }

  /**
   * Set active tag and update URL
   */
  private setActiveTag(tag: string): void {
    this.activeTag = tag;

    // Update URL without page reload
    const url = new URL(window.location.href);
    url.searchParams.set("tag", tag);
    window.history.replaceState({}, "", url.toString());

    // Notify post list component
    this.notifyPostList(tag);

    // Focus the active tag after animation completes
    this.focusActiveTag(tag);
  }

  /**
   * Focus the active tag button after reordering animation
   */
  private focusActiveTag(tag: string): void {
    // Wait for the reordering animation and DOM update to complete
    setTimeout(() => {
      const tagButton = this.shadowRoot?.querySelector(
        `button[data-tag="${tag}"]`
      ) as HTMLButtonElement;

      if (tagButton) {
        tagButton.focus();
      }
    }, 650); // Slightly longer than animation duration (600ms) to ensure completion
  }

  /**
   * Clear active filter
   */
  private clearFilter(): void {
    this.activeTag = null;

    // Remove tag from URL
    const url = new URL(window.location.href);
    url.searchParams.delete("tag");
    window.history.replaceState({}, "", url.toString());

    // Notify post list component
    this.notifyPostList(null);
  }

  /**
   * Notify the post list component of filter changes
   */
  private notifyPostList(tag: string | null): void {
    // Dispatch custom event that bubbles up to parent components
    this.dispatchEvent(
      new CustomEvent("tag-changed", {
        detail: { tag },
        bubbles: true,
        composed: true, // This allows the event to cross shadow DOM boundaries
      })
    );
  }

  /**
   * Expand to show more tags
   */
  private expandTags(): void {
    this.isExpanded = true;
  }

  /**
   * Collapse to show fewer tags
   */
  private collapseTags(): void {
    this.isExpanded = false;
  }
}
