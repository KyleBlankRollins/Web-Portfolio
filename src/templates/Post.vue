<template>
  <PostLayout :title="$page.post.title" class="text-secondary">
    <header class="border-b border-secondary">
      <div class="flex items-end">
        <h2 class="w-3/4 font-displayb uppercase">{{ $page.post.title }}</h2>
        <p class="w-1/4 flex justify-end">{{ $page.post.timeToRead }} minutes to read</p>
      </div>
      <div class="mb-4">
        <ul class="flex flex-wrap">
          <li
            v-for="(category, index) in $page.post.categories"
            :key="index"
            class="p-2 mx-2 bg-callout text-white shadow-lg rounded"
          >
            <p class="no-margin text-sm">{{ category }}</p>
          </li>
        </ul>
      </div>
    </header>
    <div class="m-4" v-html="$page.post.content"></div>
    <div class="border-t border-secondary">
      <ul class="flex flex-wrap mt-4">
        <li
          v-for="(tag, index) in $page.post.tags"
          :key="index"
          class="p-2 mx-2 bg-primary-light shadow-lg rounded"
        >
          <p class="no-margin text-sm">{{ tag }}</p>
        </li>
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
import PostLayout from "~/layouts/PostLayout.vue";

export default {
  components: {
    PostLayout
  },
  metaInfo() {
    return {
      title: this.$page.post.title
    };
  }
};
</script>
