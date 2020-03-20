<template>
  <div class="navigation">
    <h2>Projects</h2>
    <nav>
      <ul role="menu">
        <li v-for="(page, index) in navItems" :key="index">
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
.navigation ul {
  padding: 0;
  margin: 0;
  list-style: none;
}

.navigation li {
  display: inline-block;
  padding: 0 10px;
}

.navigation a {
  color: #333;
  text-decoration: none;
}
</style>