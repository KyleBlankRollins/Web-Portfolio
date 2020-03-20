<template>
  <div class="side-navigation">
    <nav>
      <ul role="menu">
        <li v-for="(item, index) in navItems" :key="index">
          <nuxt-link to="" role="menuitem"> {{ item.fields.name }} </nuxt-link>
        </li>
      </ul>
    </nav>
  </div>
</template>
    
<script>

export default {
  name: "SideNav",
  props: {
    pageTitle: String,
    navItems: Object
  }
};
</script>

<style>
.side-navigation {
  width: 20%;
  margin-right: 2em;
  background-color: black;
}

.side-navigation li {
  background-color: bisque;
}
</style>