<template>
  <div class="m-10">
    <Navbar />
    <Postbar class="mb-4" />
    <div class="p-2 mb-10 bg-secondary-light rounded">
      <div class="bg-white p-2 m-4 shadow-lg rounded">
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
import Postbar from "~/components/Postbar.vue";
import Footer from "~/components/Footer.vue";
import Navbar from "~/components/Navbar.vue";

export default {
  name: "PostLayout",
  components: {
    Postbar,
    Footer,
    Navbar
  }
};
</script>