<template>
  <div class="page-component">
    <hr />
    <div :style="{ backgroundImage: bannerGradient }">
      <h1>{{page.fields.heading}}</h1>
    </div>
    <img
      :src="page.fields.image.fields.file.url"
      :alt="page.fields.heading"
      v-if="page.fields.image"
    />
    <div class="content-container">
      <!-- Future page side-nav -->
      <!-- Pass page.fields.components or a computed property with list of component names to the sub nav. Might need to handle this the same way the main page nave works with a Vuex store module. -->
      <side-nav :page-title="page.fields.navTitle" :nav-items="components" ></side-nav>
      <content-render :body="page.fields.content"></content-render>
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
          theme: page.items[0].fields.theme
        };
      })
      .catch(console.error);
  },
  computed: {
    bannerGradient() {
      return `linear-gradient(${50}deg, ${this.theme.light.colors.background.default}, ${this.theme.light.colors.background.accent})`;
    }
  }
};
</script>

<style>

hr {
  margin: 20px 0;
}

.page-component {
  padding: 50px;
  max-width: 1280px;
  margin: 0 auto;
}

.page-component > img {
  margin: 50px 0;
}

.content-container {
  display: flex;
}

</style>