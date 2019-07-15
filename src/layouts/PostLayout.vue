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
  name: "PostLayout",
  components: {
    Sidebar,
    Footer,
    Navbar
  }
};
</script>