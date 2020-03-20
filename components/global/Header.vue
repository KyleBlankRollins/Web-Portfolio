<template>
  <div class="top-bar">
    <AppLogo></AppLogo>
    <Navigation></Navigation>
  </div>
</template>
    
<script>
import AppLogo from "@/components/global/AppLogo.vue";
import Navigation from "@/components/global/Navigation.vue";

export default {
  name: "Header",
  components: {
    AppLogo,
    Navigation
  }
};
</script>

<style>
 .top-bar {
    display: flex;
    align-items: center;
    background-color: #f1f1f1;
    padding: 50px 0;
 }
</style>