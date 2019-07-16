<template>
  <PostLayout :title="$page.post.title">
    <header class="flex">
      <h2> {{ $page.post.title }} </h2>
      <p> {{ $page.post.timeToRead }} </p>
    </header>
    <div class="m-4" v-html="$page.post.content"></div>
    <div class="flex flex-wrap">
      <ul v-for="(tag, index) in $page.post.tags" :key="index" class="p-2 mx-2 bg-primary-light shadow-lg rounded">
        <p> {{ tag }} </p>
      </ul>
    </div>
  </PostLayout>
</template>

<page-query>
query Post ($id: String!) {
  post: post (id: $id) {
    title
    content
    tags
    date
    timeToRead
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