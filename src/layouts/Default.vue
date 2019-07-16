<template>
  <div class="m-10">
    <Navbar />
    <div class=" lg:flex mb-10 bg-secondary-light rounded">
      <Sidebar class="w-full lg:w-1/4 shadow-lg rounded" />
      <div class="w-full lg:w-3/4 bg-white p-4 m-4 shadow-lg rounded">
        <slot />
      </div>
    </div>
    <Footer />
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