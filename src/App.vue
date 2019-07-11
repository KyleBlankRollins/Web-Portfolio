<template>
  <div id="app">
    <Navbar class="p-10 bg-black"/>
    <router-view class="px-10 pb-10 font-body" />
    <Footer />
  </div>
</template>

<script>
// @ is an alias to /src
import Navbar from "@/components/Nav.vue";
import Footer from "@/components/Footer.vue";

export default {
  name: "layout",
  components: {
    Navbar,
    Footer
  }
};
</script>