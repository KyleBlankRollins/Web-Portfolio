<template>
  <div class="text-primary px-4">
    <h2 class="font-mono mb-0">Projects</h2>
    <nav>
      <ul class="flex mb-0" role="menu">
        <li class="p-1 my-2" v-for="(page, index) in navItems" :key="index">
          <nuxt-link class="nav-link p-2 border-b-2 border-theme-black hover:text-theme-black hover:bg-theme-white" :to="'/' + page.fields.slug.trim()" role="menuitem">{{page.fields.navTitle}}</nuxt-link>
        </li>
      </ul>
    </nav>
  </div>
</template>
    
<script>
import { mapState } from "vuex";

export default {
  name: "Navigation",
  computed: {
    ...mapState("navigation", ["navItems"])
  },
  mounted() {
    this.$store.dispatch("navigation/getPageItems");
  },
};
</script>

<style>
.nav-link {
  transition: border 1s ease;
}

.nuxt-link-exact-active {
  @apply border-theme-white;
} 

</style>