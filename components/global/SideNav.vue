<template>
  <div class="py-4 pr-2 border border-theme-black text-sm">
    <nav>
      <ul role="menu">
        <li class="p-2" v-for="(item, index) in items" :key="index" @click="$emit('linkchange', item)">
          <nuxt-link class="sub-nav-link p-2 border-l-4 border-theme-white hover:bg-primary" :class="{ 'active-component': item.fields.name === currentItem.fields.name }" to="" role="menuitem"> {{ item.fields.name }} </nuxt-link>
        </li>
      </ul>
    </nav>
  </div>
</template>
    
<script>

export default {
  name: "SideNav",
  props: {
    items: Array,
    currentItem: Object
  },
};
</script>

<style>
.sub-nav-link {
  transition: border 1s ease;
}

.active-component {
  @apply border-primary;
} 
</style>