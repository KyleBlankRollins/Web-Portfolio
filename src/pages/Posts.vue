<template>
  <Layout class="text-secondary">
    <h2 class="font-displayB">All posts</h2>
    <div>
      <ul>
        <li
          v-for="post in $page.posts.edges"
          :key="post.node.id"
          class="posts p-4 my-4 bg-white border-l-2 border-secondary rounded"
        >
          <div class="md:flex">
            <h3 class="w-3/4 font-display">{{ post.node.title }}</h3>
            <a class="md:flex md:justify-end md:inline-block md:w-1/4" :href="post.node.path">
              <button
                class="p-2 h-12 bg-white border border-callout font-displayB text-callout font-bold hover:bg-primary hover:text-white hover:border-white shadow-lg rounded"
              >Read more</button>
            </a>
          </div>
          <div class="flex mb-4 items-end">
            <p class="w-2/3 no-margin font-mono text-sm">{{ post.node.date }}</p>
            <p
              class="w-1/3 flex justify-end no-margin font-mono text-sm"
            >{{ post.node.timeToRead }} min to read</p>
          </div>
          <p class="mt-4 font-body">{{ post.node.excerpt }}</p>
          <div class="md:flex my-4">
            <div>
              <ul class="flex flex-wrap">
                <li
                  v-for="(category, index) in post.node.categories"
                  :key="index"
                  class="p-2 mx-2 my-1 bg-callout text-white shadow-lg rounded"
                >
                  <p class="no-margin text-sm">{{ category }}</p>
                </li>
              </ul>
            </div>
            <div>
              <ul class="flex flex-wrap">
                <li
                  v-for="(tag, index) in post.node.tags"
                  :key="index"
                  class="p-2 mx-2 my-1 bg-white shadow-lg rounded"
                >
                  <p class="no-margin text-sm">{{ tag }}</p>
                </li>
              </ul>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </Layout>
</template>

<page-query>
query Posts {
  posts: allPost {
    edges {
      node { 
        id
        title
        excerpt
        date
        timeToRead
        path
        tags
        categories
        thumbnail
      }
    }
  }
}
</page-query>

<script>
export default {
  metaInfo: {
    title: "Posts"
  }
};
</script>

<style>
.posts:nth-child(odd) {
  background-color: #b2d5b3;
}

.posts:nth-child(even) {
  background-color: #cab3bf;
}
</style>