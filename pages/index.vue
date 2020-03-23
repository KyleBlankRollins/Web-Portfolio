<template>
  <section>
    <div>
      <content-render :body="topic.fields.description"></content-render>
    </div>
  </section>
</template>

<script>
import { createClient } from "../plugins/contentful";
import ContentRender from "../components/global/ContentRender.vue";

const contentfulClient = createClient();

export default {
  name: "Home",
  components: {
    ContentRender
  },
  asyncData({ env, params }) {
    return contentfulClient
      .getEntry("712v41E6N38DUfsP3oonW2")
      .then(topic => {
        return {
          topic: topic
        };
      })
      .catch(console.error);
  }
};
</script>

<style>
p img {
  max-width: 100px;
}
</style>

