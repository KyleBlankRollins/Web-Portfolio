<template>
  <PostLayout :title="$page.post.title" class="text-secondary">
    <header class="border-b border-secondary">
      <div class="md:flex md:items-end">
        <h2 id="post-title" class="w-3/4 font-displayB uppercase">{{ $page.post.title }}</h2>
        <p class="w-1/4 mx-2 flex justify-end">{{ $page.post.timeToRead }} min to read</p>
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

    <g-image :src="$page.post.thumbnail" class="w-full my-4 rounded"/>

    <div id="post" class="m-4" v-html="$page.post.content"></div>

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
    thumbnail
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
