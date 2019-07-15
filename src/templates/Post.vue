<template>
  <Layout :title="$page.post.title">
    <div v-html="$page.post.content"></div>
  </Layout>
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
import PostLayout from '~/layouts/PostLayout.vue'

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