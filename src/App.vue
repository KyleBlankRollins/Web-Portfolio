<template>
  <div id="app">
    <Navbar class="p-10 bg-black"/>
    <router-view class="p-10 font-body" />
  </div>
</template>

<script>
// @ is an alias to /src
import Navbar from "@/components/Nav.vue";

export default {
  name: "layout",
  components: {
    Navbar
  }
};
</script>