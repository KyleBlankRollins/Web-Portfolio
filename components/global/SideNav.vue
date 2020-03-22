<template>
  <div class="side-navigation">
    <nav>
      <ul role="menu">
        <li class="px-2 text-lg" v-for="(item, index) in items" :key="index" @click="$emit('linkchange', item.fields.description)">
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
    items: Array
  },
};
</script>

<style>
nav ul li:hover {
  background-color: #8EB6CB;
  background-image: linear-gradient(
      rgba(245, 245, 250, 0.3) 2px,
      transparent 2px
    ),
    linear-gradient(90deg, rgba(245, 245, 250, 0.3) 2px, transparent 2px),
    linear-gradient(rgba(245, 245, 250, 0.3) 1px, transparent 1px),
    linear-gradient(90deg, rgba(245, 245, 250, 0.3) 1px, transparent 1px);
  background-size: 100px 100px, 100px 100px, 20px 20px, 20px 20px;
}
</style>