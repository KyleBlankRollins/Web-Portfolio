<template>
  <div class="pb-12">
    <div>
      <div class="flex bg-theme-black text-primary shadow-xl">
        <div class="w-24 p-4 bg-theme-white">
          <img
            :src="page.fields.image.fields.file.url"
            :alt="page.fields.navTitle"
            v-if="page.fields.image"
          />
        </div>
        <div class="flex w-full ml-4 items-center">
          <h1 class="text-2xl my-0">{{ page.fields.navTitle }}</h1>
        </div>
      </div>
      <content-render class="flex justify-center" :body="page.fields.content"></content-render>
    </div>

    <div class="flex w-full justify-center">
      <div class="w-1/4 h-1 mb-8" :style="{ backgroundImage: gradientBar }"></div>
    </div>

    <div class="flex mx-4">
      <side-nav
        class="font-mono w-1/5"
        @linkchange="updateCurrentContent"
        :current-item="currentItem"
        :items="components"
      ></side-nav>
      <content-render class="w-4/5 ml-12" :body="currentContent"></content-render>
    </div>
  </div>
</template>

<script>
import { createClient } from "../../plugins/contentful";
import ContentRender from "../../components/global/ContentRender.vue";
import SideNav from "../../components/global/SideNav.vue";

const contentfulClient = createClient();

export default {
  name: "index",
  components: {
    ContentRender,
    SideNav
  },
  asyncData({ env, params }) {
    return contentfulClient
      .getEntries({
        content_type: "page",
        "fields.slug": params.id
      })
      .then(page => {
        return {
          page: page.items[0],
          components: page.items[0].fields.components,
          theme: page.items[0].fields.theme,
          currentContent: page.items[0].fields.components[0].fields.description,
          currentItem: page.items[0].fields.components[0]
        };
      })
      .catch(console.error);
  },
  computed: {
    gradientBar() {
      return `linear-gradient(${50}deg, ${this.theme.light.colors.background.default}, ${this.theme.light.colors.background.accent})`;
    },

    // Sorts components array alphabetically by the 'name' field.
    sortedComponents() {
      const sortedArray = this.components.sort((a, b) =>
        a.fields.name > b.fields.name
          ? 1
          : b.fields.name > a.fields.name
          ? -1
          : 0
      );

      return sortedArray;
    }
  },
  methods: {
    updateCurrentContent(item) {
      this.currentContent = item.fields.description;
      this.currentItem = item;
    }
  }
};
</script>

<style>

</style>