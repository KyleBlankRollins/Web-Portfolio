<template>
  <div class="flex flex-col m-1 md:m-10 items-center">
    <Navbar class="w-full" />
    <div class="max-w-6xl pb-2 mb-10 bg-secondary-light rounded">
      <Postbar class="mb-4" />
      <div class="bg-white p-4 m-4 shadow-lg rounded">
        <slot />
      </div>
    </div>
    <Footer class="w-full" />
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