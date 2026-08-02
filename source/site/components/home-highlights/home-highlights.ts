import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { homeHighlightsStyles } from "./home-highlights.style.js";
import {
  typographyStyles,
  reducedMotionStyles,
} from "../../styles/shared-styles.js";

interface BlogPostSummary {
  title: string;
  description: string;
  date: string;
  formattedDate: string;
  url: string;
}

interface BlogManifest {
  posts: BlogPostSummary[];
}

interface CareerPosition {
  title: string;
  endDate: string;
}

interface CareerCompany {
  company: string;
  companyWebsite: string;
  positions: CareerPosition[];
}

@customElement("kbr-home-highlights")
export class KbrHomeHighlights extends LitElement {
  @state() private latestPost: BlogPostSummary | null = null;
  @state() private currentRole: CareerCompany | null = null;
  @state() private isLoading = true;
  @state() private loadError = false;

  static styles = [typographyStyles, homeHighlightsStyles, reducedMotionStyles];

  connectedCallback(): void {
    super.connectedCallback();
    void this.loadHighlights();
  }

  render() {
    if (this.isLoading) {
      return html`<section class="home-highlights" aria-label="Highlights">
        <p class="status">Loading highlights...</p>
      </section>`;
    }

    if (this.loadError) {
      return html`<section class="home-highlights" aria-label="Highlights">
        <p class="status">Highlights are temporarily unavailable.</p>
      </section>`;
    }

    if (!this.latestPost && !this.currentRole) {
      return html`<section class="home-highlights" aria-label="Highlights">
        <p class="status">No highlights are available yet.</p>
      </section>`;
    }

    return html`
      <section class="home-highlights" aria-labelledby="home-highlights-title">
        <div class="home-highlights-heading">
          <p class="eyebrow">Recently</p>
          <h2 id="home-highlights-title">Recent writing and experience</h2>
        </div>
        <div class="home-highlights-grid">
          ${this.latestPost ? this.renderLatestPost(this.latestPost) : ""}
          ${this.currentRole ? this.renderCurrentRole(this.currentRole) : ""}
        </div>
      </section>
    `;
  }

  private renderLatestPost(post: BlogPostSummary) {
    return html`
      <article class="highlight-item">
        <p class="eyebrow">Latest writing</p>
        <h3><a href="${post.url}">${post.title}</a></h3>
        <p>${post.description}</p>
        <time datetime="${post.date}">${post.formattedDate || post.date}</time>
      </article>
    `;
  }

  private renderCurrentRole(company: CareerCompany) {
    const currentPosition = company.positions.find(
      (position) => position.endDate.toLowerCase() === "present"
    );

    if (!currentPosition) {
      return "";
    }

    return html`
      <article class="highlight-item">
        <p class="eyebrow">Current role</p>
        <h3>${currentPosition.title}</h3>
        <p>
          ${company.company}
          <span aria-hidden="true"> · </span>
          <a href="${company.companyWebsite}">Company site</a>
        </p>
        <a class="highlight-link" href="/career.html">View career timeline</a>
      </article>
    `;
  }

  private async loadHighlights(): Promise<void> {
    try {
      const [manifestResponse, careerResponse] = await Promise.all([
        fetch("/data/blog-manifest.json"),
        fetch("/data/experience-data.json"),
      ]);

      if (!manifestResponse.ok || !careerResponse.ok) {
        throw new Error("Unable to load homepage highlights");
      }

      const manifest = (await manifestResponse.json()) as BlogManifest;
      const career = (await careerResponse.json()) as CareerCompany[];

      this.latestPost = manifest.posts?.[0] || null;
      this.currentRole =
        career.find((company) =>
          company.positions.some(
            (position) => position.endDate.toLowerCase() === "present"
          )
        ) || null;
    } catch (error) {
      console.error("Failed to load homepage highlights:", error);
      this.loadError = true;
    } finally {
      this.isLoading = false;
    }
  }
}
