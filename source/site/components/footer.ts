class PageFooter extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      </html>
    `;
  }
}

customElements.define("kr-page-footer", PageFooter);
