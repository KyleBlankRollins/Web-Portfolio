/**
 * Blog Post List Web Component
 * 
 * This component displays a list of blog posts with metadata from their markdown files.
 * Supports filtering by tags and pagination (5 posts per page).
 * 
 * Usage: <kbr-post-list></kbr-post-list>
 */

interface BlogPostMetadata {
  title: string;
  description: string;
  date: string;
  formattedDate: string;
  tags: string[];
  url: string;
  filename: string;
  keywords?: string;
}

interface BlogManifest {
  posts: BlogPostMetadata[];
  totalPosts: number;
  generatedAt: string;
}

class KbrPostList extends HTMLElement {
  private posts: BlogPostMetadata[] = [];
  private filteredPosts: BlogPostMetadata[] = [];
  private currentFilter: string | null = null;
  private currentPage: number = 1;
  private postsPerPage: number = 5;
  private isLoading: boolean = false;

  static get observedAttributes() {
    return ['posts-per-page', 'filter'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    // Handle tag filtering events from post cards
    this.addEventListener('tag-filter', this.handleTagFilter.bind(this) as EventListener);
  }

  connectedCallback() {
    const postsPerPageAttr = this.getAttribute('posts-per-page');
    if (postsPerPageAttr) {
      this.postsPerPage = parseInt(postsPerPageAttr, 10) || 5;
    }
    
    const filterAttr = this.getAttribute('filter');
    if (filterAttr) {
      this.currentFilter = filterAttr;
    }
    
    this.loadBlogPosts();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue === newValue) return;
    
    if (name === 'posts-per-page') {
      this.postsPerPage = parseInt(newValue, 10) || 5;
      this.currentPage = 1;
      this.renderPostList();
    } else if (name === 'filter') {
      this.currentFilter = newValue;
      this.filterByTag(newValue);
    }
  }

  private async loadBlogPosts(): Promise<void> {
    this.isLoading = true;
    this.render();
    
    try {
      const response = await fetch('/blog-manifest.json');
      if (!response.ok) {
        throw new Error(`Failed to load blog posts: ${response.statusText}`);
      }
      
      const manifest: BlogManifest = await response.json();
      this.posts = manifest.posts;
      this.filteredPosts = [...this.posts];
      
      // Apply initial filter if set
      if (this.currentFilter) {
        this.filterByTag(this.currentFilter);
      }
      
      this.isLoading = false;
      this.renderPostList();
      
    } catch (error) {
      console.error('Failed to load blog posts:', error);
      this.isLoading = false;
      this.renderError();
    }
  }

  private render(): void {
    if (!this.shadowRoot) return;
    
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="/components/post-list.css">
      <div class="post-list-container">
        ${this.isLoading ? this.getLoadingHTML() : ''}
      </div>
    `;
  }

  private renderPostList(): void {
    if (!this.shadowRoot || this.isLoading) return;

    const startIndex = (this.currentPage - 1) * this.postsPerPage;
    const endIndex = startIndex + this.postsPerPage;
    const currentPosts = this.filteredPosts.slice(startIndex, endIndex);
    const totalPages = Math.ceil(this.filteredPosts.length / this.postsPerPage);

    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="/components/post-list.css">
      <div class="post-list-container">
        ${this.getHeaderHTML()}
        ${this.getFilterHTML()}
        ${currentPosts.length > 0 ? this.getPostsHTML(currentPosts) : this.getEmptyHTML()}
        ${totalPages > 1 ? this.getPaginationHTML(totalPages) : ''}
      </div>
    `;

    this.attachEventListeners();
  }

  private renderError(): void {
    if (!this.shadowRoot) return;
    
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="/components/post-list.css">
      <div class="post-list-container">
        <div class="post-list-error">
          <h2>Unable to load blog posts</h2>
          <p>There was an error loading the blog post list. Please try again later.</p>
        </div>
      </div>
    `;
  }

  private getLoadingHTML(): string {
    return `
      <div class="post-list-loading">
        <div class="loading-spinner"></div>
        <p>Loading blog posts...</p>
      </div>
    `;
  }

  private getHeaderHTML(): string {
    const totalPosts = this.filteredPosts.length;
    const headerText = this.currentFilter 
      ? `Blog posts tagged "${this.currentFilter}" (${totalPosts})`
      : `Latest blog posts (${totalPosts})`;
      
    return `
      <header class="post-list-header">
        <h2>${headerText}</h2>
      </header>
    `;
  }

  private getFilterHTML(): string {
    if (!this.currentFilter) return '';
    
    return `
      <div class="post-list-filter">
        <span class="filter-label">Filtered by: <strong>${this.currentFilter}</strong></span>
        <button class="clear-filter-btn" data-action="clear-filter">Clear filter</button>
      </div>
    `;
  }

  private getPostsHTML(posts: BlogPostMetadata[]): string {
    const postCards = posts.map(post => `
      <kbr-post-card
        title="${post.title}"
        description="${post.description}"
        date="${post.date}"
        formatted-date="${post.formattedDate}"
        tags='${JSON.stringify(post.tags)}'
        url="${post.url}">
      </kbr-post-card>
    `).join('');

    return `
      <div class="post-list-grid">
        ${postCards}
      </div>
    `;
  }

  private getEmptyHTML(): string {
    const message = this.currentFilter 
      ? `No blog posts found with the tag "${this.currentFilter}".`
      : 'No blog posts available yet.';
      
    return `
      <div class="post-list-empty">
        <p>${message}</p>
        ${this.currentFilter ? '<button class="clear-filter-btn" data-action="clear-filter">View all posts</button>' : ''}
      </div>
    `;
  }

  private getPaginationHTML(totalPages: number): string {
    const pages = [];
    
    // Previous button
    const prevDisabled = this.currentPage === 1 ? 'disabled' : '';
    pages.push(`<button class="pagination-btn" data-page="${this.currentPage - 1}" ${prevDisabled}>← Previous</button>`);
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
      const active = i === this.currentPage ? 'active' : '';
      pages.push(`<button class="pagination-btn ${active}" data-page="${i}">${i}</button>`);
    }
    
    // Next button
    const nextDisabled = this.currentPage === totalPages ? 'disabled' : '';
    pages.push(`<button class="pagination-btn" data-page="${this.currentPage + 1}" ${nextDisabled}>Next →</button>`);

    return `
      <nav class="post-list-pagination">
        ${pages.join('')}
      </nav>
    `;
  }

  private attachEventListeners(): void {
    if (!this.shadowRoot) return;

    // Pagination buttons
    const paginationButtons = this.shadowRoot.querySelectorAll('.pagination-btn[data-page]');
    paginationButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const page = parseInt(target.dataset.page || '1', 10);
        if (page !== this.currentPage && !target.hasAttribute('disabled')) {
          this.goToPage(page);
        }
      });
    });

    // Clear filter buttons
    const clearFilterButtons = this.shadowRoot.querySelectorAll('[data-action="clear-filter"]');
    clearFilterButtons.forEach(button => {
      button.addEventListener('click', () => {
        this.clearFilter();
      });
    });
  }

  private handleTagFilter(event: Event): void {
    const customEvent = event as CustomEvent;
    const tag = customEvent.detail?.tag;
    if (tag) {
      this.filterByTag(tag);
    }
  }

  private filterByTag(tag: string): void {
    if (!tag) {
      this.clearFilter();
      return;
    }
    
    this.currentFilter = tag;
    this.currentPage = 1;
    
    this.filteredPosts = this.posts.filter(post => 
      post.tags.some(postTag => postTag.toLowerCase() === tag.toLowerCase())
    );
    
    this.renderPostList();
    
    // Update attribute to reflect current state
    this.setAttribute('filter', tag);
  }

  private clearFilter(): void {
    this.currentFilter = null;
    this.currentPage = 1;
    this.filteredPosts = [...this.posts];
    
    this.renderPostList();
    
    // Remove filter attribute
    this.removeAttribute('filter');
  }

  private goToPage(page: number): void {
    const totalPages = Math.ceil(this.filteredPosts.length / this.postsPerPage);
    
    if (page >= 1 && page <= totalPages) {
      this.currentPage = page;
      this.renderPostList();
    }
  }
}

// Register the custom element
customElements.define('kbr-post-list', KbrPostList);

export { KbrPostList, type BlogPostMetadata };