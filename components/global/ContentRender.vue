<template>
  <div class="top-bar">
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
 .top-bar {
    display: flex;
    align-items: center;
    background-color: #f1f1f1;
    padding: 50px 0;
 }
</style>