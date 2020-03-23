<template>
  <div class="px-2 py-8 mx-8 text-xl">
    <div v-html="processedMarkdown"></div>
  </div>
</template>
    
<script>
import { processMarkdown } from "../../plugins/marked";

export default {
  name: "ContentRender",
  props: {
    body: String
  },
  computed: {
    processedMarkdown() {
      return processMarkdown(this.body);
    }
  }
};
</script>

<style>

</style>