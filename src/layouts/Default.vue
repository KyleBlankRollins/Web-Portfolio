<template>
  <div class="flex flex-col m-1 md:m-10 items-center">
    <Navbar class="w-full" />
    <div class="max-w-6xl md:flex mb-10 bg-secondary-light rounded">
      <Sidebar class="hidden md:w-1/4 md:inline-block shadow-lg rounded" />
      <Postbar class="max-w-6xl mb-4 md:hidden" />
      <div class="md:w-3/4 bg-white p-4 m-4 shadow-lg rounded">
        <slot />
      </div>
    </div>
    <Footer class="w-full" />
  </div>
</template>

<static-query>
query {
  metadata {
    siteName
  }
}
</static-query>

<script>
import Sidebar from "~/components/Sidebar.vue";
import Postbar from "~/components/Postbar.vue";
import Footer from "~/components/Footer.vue";
import Navbar from "~/components/Navbar.vue";

export default {
  components: {
    Postbar,
    Sidebar,
    Footer,
    Navbar
  }
};
</script>