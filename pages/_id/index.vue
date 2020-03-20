<template>
  <div class="page-component">
    <hr />
    <h1>{{page.fields.heading}}</h1>
    <img
      :src="page.fields.image.fields.file.url"
      :alt="page.fields.heading"
      v-if="page.fields.image"
    />
    <div class="content-container">
      <!-- Future page side-nav -->
      <!-- Pass page.fields.components or a computed property with list of component names to the sub nav. Might need to handle this the same way the main page nave works with a Vuex store module. -->
      <nav class="placeholder-side-nav"></nav>
      <p>{{page.fields.content}}</p>
    </div>
  </div>
</template>

<script>
import { createClient } from "../../plugins/contentful";

const contentfulClient = createClient();

export default {
  name: "index",
  asyncData({ env, params }) {
    return contentfulClient
      .getEntries({
        content_type: "page",
        "fields.slug": params.id
      })
      .then(page => {
        return {
          page: page.items[0]
        };
      })
      .catch(console.error);
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

.placeholder-side-nav {
  width: 20%;
  margin-right: 2em;
  background-color: black;
}

</style>