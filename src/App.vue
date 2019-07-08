<template>
  <div id="app" class="m-10">
    <Navbar />
    <router-view class="m-10" />
  </div>
</template>

<script>
// @ is an alias to /src
import Navbar from "@/components/Nav.vue";

export default {
  name: "home",
  components: {
    Navbar
  }
};
</script>