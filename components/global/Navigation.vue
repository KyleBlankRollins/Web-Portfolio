<template>
  <div class="text-primary px-4">
    <h2 class="font-mono text-4xl">Projects</h2>
    <nav>
      <ul class="flex" role="menu">
        <li class="p-2 text-xl" v-for="(page, index) in navItems" :key="index">
          <nuxt-link :to="'/' + page.fields.slug.trim()" role="menuitem">{{page.fields.navTitle}}</nuxt-link>
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
  }
};
</script>

<style>

</style>