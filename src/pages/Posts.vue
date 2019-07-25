<template>
  <Layout class="text-secondary">
    <h2 class="font-displayB">All posts</h2>
    <ul>
      <li
        v-for="post in $page.posts.edges"
        :key="post.node.id"
        class="posts p-4 my-4 bg-white border-l-2 border-secondary rounded"
      >
        <header class="md:flex mb-4">
          <h3 class="w-3/4 font-display">{{ post.node.title }}</h3>
          <g-link :to="post.node.path" class="md:flex md:justify-end md:inline-block md:w-1/4">
            <button
              class="p-2 h-12 bg-white border border-callout font-displayB text-callout font-bold hover:bg-primary hover:text-white hover:border-white shadow-lg rounded"
            >Read more</button>
          </g-link>
        </header>
        <div class="flex mb-4 items-end">
          <p class="w-2/3 no-margin font-mono text-sm">{{ post.node.date }}</p>
          <p
            class="w-1/3 flex justify-end no-margin font-mono text-sm"
          >{{ post.node.timeToRead }} min to read</p>
        </div>
        <article>
          <p class="mt-4 font-body">{{ post.node.excerpt }}</p>
        </article>
        <footer class="md:flex my-4">
          <div>
            <ul class="flex flex-wrap">
              <li
                v-for="(category, index) in post.node.categories"
                :key="index"
                class="p-2 mx-2 my-1 bg-callout text-white shadow-lg rounded"
              >
                <g-link :to="category.path">
                  <span class="w-full">
                    <p class="no-margin text-sm">{{ category.id }}</p>
                  </span>
                </g-link>
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
                <g-link :to="tag.path">
                  <span class="w-full">
                    <p class="no-margin text-sm">{{ tag.id }}</p>
                  </span>
                </g-link>
              </li>
            </ul>
          </div>
        </footer>
      </li>
    </ul>
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
        tags {
          id
          path
        }
        categories {
          id
          path
        }
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