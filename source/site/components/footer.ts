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

customElements.define("kbr-page-footer", PageFooter);
