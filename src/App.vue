<template>
  <div id="app">
    <Navbar class="p-10 bg-black"/>
    <router-view class="font-body" />
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