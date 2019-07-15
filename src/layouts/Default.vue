<template>
  <div class="m-10">
    <Navbar class="nav" />
    <Sidebar class="sidebar" />
    <div class="ml-10">
      <header class="header">
        <strong>
          <g-link to="/">{{ $static.metaData.siteName }}</g-link>
        </strong>
      </header>
      <slot />
    </div>
    <Footer class="footer" />
  </div>
</template>

<static-query>
query {
  metaData {
    siteName
  }
}
</static-query>

<script>
import Sidebar from "~/components/Sidebar.vue";
import Footer from "~/components/Footer.vue";
import Navbar from "~/components/Navbar.vue";

export default {
  components: {
    Sidebar,
    Footer,
    Navbar
  }
};
</script>

<style>
#app {
  display: grid;
  grid-template-columns: 0.2fr 1fr;
  grid-template-areas: 
  "nav nav"
  "sidebar content"
  "footer footer"
}

.nav {
  grid-area: nav;
}

.sidebar {
  grid-area: sidebar;
}

.layout {
  grid-area: content;
}

.footer {
  grid-area: footer;
}
</style>
