class PageHead extends HTMLElement {
  pageTitle: string;

  constructor(pageTitle: string) {
    super();

    this.pageTitle = pageTitle;
  }

  connectedCallback() {
    this.innerHTML = `
      <!doctype html>
      <html lang="en">

      <head>
        <meta charset="UTF-8" />
        <meta name="viewport"
              content="width=device-width, initial-scale=1.0" />
        <title>${this.pageTitle}</title>
        <link rel="stylesheet"
              href="/style.css" />
        <link rel="stylesheet"
              href="/theme.css" />
      </head>
    `;
  }
}

customElements.define("kbr-page-head", PageHead);
