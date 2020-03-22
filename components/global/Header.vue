<template>
  <div class="flex bg-theme-black shadow-2xl">
    <Navigation class="w-4/5"></Navigation>
    <AppLogo class="w-1/5"></AppLogo>
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

</style>