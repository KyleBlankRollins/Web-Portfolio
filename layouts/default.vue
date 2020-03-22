<template>
  <div class="h-screen font-body bg-primary grid-overlay">
    <Header></Header>
    <nuxt class="m-8 page-container bg-theme-white shadow-2xl" />
  </div>
</template>

<script>
import Header from "../components/global/Header";
export default {
  components: {
    Header
  }
};
</script>

<style>
.grid-overlay {
  background-image: linear-gradient(
      rgba(245, 245, 250, 0.3) 2px,
      transparent 2px
    ),
    linear-gradient(90deg, rgba(245, 245, 250, 0.3) 2px, transparent 2px),
    linear-gradient(rgba(245, 245, 250, 0.3) 1px, transparent 1px),
    linear-gradient(90deg, rgba(245, 245, 250, 0.3) 1px, transparent 1px);
  background-size: 100px 100px, 100px 100px, 20px 20px, 20px 20px;
}

.page-container {
  max-width: 1280px;
}
</style>

