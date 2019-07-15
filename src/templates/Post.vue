<template>
  <PostLayout :title="$page.post.title">
    <div class="m-4" v-html="$page.post.content"></div>
  </PostLayout>
</template>

<page-query>
query Post ($id: String!) {
  post: post (id: $id) {
    title
    content
  }
}
</page-query>

<script>
import PostLayout from '~/layouts/PostLayout.vue';

export default {
  components: {
    PostLayout
  },
  metaInfo () {
    return {
      title: this.$page.post.title
    }
  }
}
</script>