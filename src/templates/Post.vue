<template>
  <PostLayout :title="$page.post.title">
    <header>
      <div class="flex items-baseline">
        <h2 class="w-3/4 uppercase"> {{ $page.post.title }} </h2>
      <p class="w-1/4"> {{ $page.post.timeToRead }} </p>
      </div>
      <div class="flex flex-wrap">
        <ul v-for="(category, index) in $page.post.categories" :key="index" class="p-2 mx-2 bg-callout shadow-lg rounded">
        <p> {{ category }} </p>
      </ul>
      </div>
    </header>
    <div class="m-4" v-html="$page.post.content"></div>
    <div class="flex flex-wrap">
      <ul v-for="(tag, index) in $page.post.tags" :key="index" class="p-2 mx-2 bg-primary-light shadow-lg rounded">
        <p class="uppercase"> {{ tag }} </p>
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
    categories
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