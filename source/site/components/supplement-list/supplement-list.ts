import { LitElement, html, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import {
  typographyStyles,
  reducedMotionStyles,
} from "../../styles/shared-styles.js";
import { supplementListStyles } from "./supplement-list.style.js";

interface SupplementManifestEntry {
  title: string;
  description: string;
  url: string;
  filename: string;
}

interface BlogPostManifestEntry {
  url: string;
  supplements?: SupplementManifestEntry[];
}

interface BlogManifest {
  posts: BlogPostManifestEntry[];
}

@customElement("kbr-supplement-list")
export class KbrSupplementList extends LitElement {
  static styles = [typographyStyles, supplementListStyles, reducedMotionStyles];

  @state()
  private supplements: SupplementManifestEntry[] = [];

  @state()
  private isLoading = true;

  @state()
  private hasError = false;

  connectedCallback(): void {
    super.connectedCallback();
    void this.loadSupplements();
  }

  private async loadSupplements(): Promise<void> {
    try {
      const response = await fetch("/data/blog-manifest.json");
      if (!response.ok) {
        throw new Error(`Failed to load blog manifest: ${response.statusText}`);
      }

      const manifest: BlogManifest = await response.json();
      const currentPath = window.location.pathname;
      const currentPost = manifest.posts.find(
        (post) => this.normalizePath(post.url) === currentPath
      );

      this.supplements = currentPost?.supplements ?? [];
    } catch (error) {
      console.error("Failed to load blog supplements:", error);
      this.hasError = true;
    } finally {
      this.isLoading = false;
    }
  }

  private normalizePath(url: string): string {
    if (url.length > 1 && url.endsWith("/")) {
      return url.slice(0, -1);
    }

    return url;
  }

  render() {
    if (this.isLoading || this.hasError || this.supplements.length === 0) {
      return nothing;
    }

    return html`
      <section class="supplements" aria-labelledby="supplements-heading">
        <h2 id="supplements-heading">Supplements</h2>
        <ul class="supplement-list">
          ${this.supplements.map(
            (supplement) => html`
              <li class="supplement-item">
                <a class="supplement-link" href=${supplement.url}
                  >${supplement.title}</a
                >
                ${
                  supplement.description
                    ? html`<p class="supplement-description">
                        ${supplement.description}
                      </p>`
                    : nothing
                }
              </li>
            `
          )}
        </ul>
      </section>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "kbr-supplement-list": KbrSupplementList;
  }
}
