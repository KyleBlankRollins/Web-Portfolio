let appUI = {
  header: "",
  mainNav: "",
  navWrapper: "",
  subNavItems: "",
  navLinks: "",
  navToggle: "",
  imageDivider: "",
  imageSlider: "",
};

(function () {
  window.addEventListener("DOMContentLoaded", (event) => {
    // Initialize UI elements
    appUI.header = document.querySelector(".accessibility-nav");
    appUI.mainNav = document.querySelector(".nav-main");
    appUI.navWrapper = document.querySelector(".nav-wrapper");
    appUI.subNavItems = [...document.querySelectorAll(".has-subnav")];
    appUI.navLinks = [...document.querySelectorAll(".nav-main > ul > li > a")];
    appUI.navToggle = document.querySelector(".nav-toggle");
    appUI.divider = document.querySelector(".divider");
    appUI.slider = document.querySelector(".slider");

    // After UI elements set, initialize app logic
    initializeApp();
  });
})();

function initializeApp() {
  appUI.header.classList.add("has-js-loaded");
  appUI.subNavItems.forEach((subNavItem) => setupSubNavItem(subNavItem));
  appUI.navLinks.forEach((navLink) => setupNavLink(navLink));
  setupNavToggle(appUI.navToggle, appUI.navWrapper);
}

// Responsive and accessible navigation
function navToggleClickEventHandler(event) {
  toggleMainNav(this);
}

function navToggleKeydownHandler(event) {
  const toggleButton = event.target;

  switch (event.key) {
    // Actual button, so Spacebar is captured already...

    case "Esc":
    case "Escape":
      closeMainNav(toggleButton);
      break;
    default:
      return;
  }
}

function subNavClickEventHandler(event) {
  const subNav = this.parentNode.querySelector(".subnav");

  if (subNav !== null && window.innerWidth < 1000) {
    event.preventDefault();
    toggleSubNav(this, subNav);
  }
}

function subNavKeydownHandler(event) {
  let subNav;
  let currentNavItem;

  if (this.classList.contains(".subNav")) {
    subNav = this;
    currentNavItem = this.querySelector("a");
  } else {
    subNav = this.parentNode.querySelector(".subnav");
    currentNavItem = event.target;
  }

  switch (event.key) {
    case "Spacebar":
    case " ":
      // Open subnav and jump to first item
      toggleSubNav(currentNavItem, subNav);
      break;
    case "Esc":
    case "Escape":
      closeSubNav(currentNavItem, subNav);
      break;
    default:
      return;
  }
}

// Handle image comparison
function moveDivider() {
  appUI.divider.style.width = appUI.slider.value + "%";
}

function closeMainNav(button) {
  button.setAttribute("aria-expanded", "false");
  appUI.navWrapper.setAttribute("aria-hidden", "true");
  appUI.navWrapper.classList.add("noshow");
}

function openMainNav(button) {
  button.setAttribute("aria-expanded", "true");
  appUI.navWrapper.setAttribute("aria-hidden", "false");
  appUI.navWrapper.classList.remove("noshow");
}

function toggleMainNav(button) {
  if (button.getAttribute("aria-expanded") === "true") {
    closeMainNav(button);
  } else {
    openMainNav(button);
  }
}

function closeSubNav(link, subNav) {
  link.setAttribute("aria-expanded", "false");
  subNav.setAttribute("aria-hidden", "true");
  subNav.classList.add("noshow");
}

function openSubNav(link, subNav) {
  link.setAttribute("aria-expanded", "true");
  subNav.setAttribute("aria-hidden", "false");
  subNav.classList.remove("noshow");
}

function toggleSubNav(link, subNav) {
  console.log("toggle subnav");
  if (subNav !== null) {
    if (link.getAttribute("aria-expanded") === "true") {
      closeSubNav(link, subNav);
    } else {
      openSubNav(link, subNav);
    }
  }
}

function setupSubNavItem(subNavItem) {
  let link = subNavItem.querySelector("a");
  let subNav = subNavItem.querySelector(".subnav");

  link.setAttribute("aria-expanded", "false");
  link.setAttribute("role", "button");

  // Show subnav by default on screens wider than 1000px.
  if (subNav && window.innerWidth < 1000) {
    subNav.removeAttribute("hidden");
    subNav.setAttribute("aria-hidden", "true");
    subNav.classList.add("noshow");
  }
}

function setupNavLink(navLink) {
  navLink.addEventListener("click", subNavClickEventHandler);
  navLink.parentNode.addEventListener("keydown", subNavKeydownHandler);
}

function setupNavToggle(navToggle, navWrapper) {
  navToggle.setAttribute("aria-expanded", "false");
  navWrapper.classList.add("noshow");

  // Show nav by default on screens wider than 1000px.
  if (window.innerWidth > 1000) {
    navWrapper.classList.remove("noshow");
  }

  navToggle.addEventListener("click", navToggleClickEventHandler);
  navToggle.addEventListener("keydown", navToggleKeydownHandler);
}
