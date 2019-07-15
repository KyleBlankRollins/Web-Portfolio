<template>
  <div class="m-10">
    <Navbar class="nav" />
    <div class="flex mb-10 shadow-lg">
      <Sidebar class="w-1/4 sidebar rounded-l" />
      <div class="w-3/4 bg-white p-2 rounded-r">
        <slot />
      </div>
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