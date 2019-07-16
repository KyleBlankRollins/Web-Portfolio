<template>
  <Layout class="text-secondary">
    <h2 class="font-displayB">All posts</h2>
    <div>
      <ul>
        <li v-for="post in $page.posts.edges" :key="post.node.id" class="posts p-4 my-4 bg-white border-l-2 border-secondary rounded">
          <h2 class="font-display uppercase">{{ post.node.title }}</h2>
          <p class="font-body">{{ post.node.excerpt }}</p>
          <div class="flex mb-4 items-end">
            <p class="w-2/4 no-margin font-mono text-sm">{{ post.node.date }}</p>
            <p class="w-1/4 no-margin font-mono text-sm">{{ post.node.timeToRead }} minutes to read</p>
            <a class="w-1/4" :href="post.node.path">
              <button class="p-2 bg-white border border-callout font-displayB text-callout font-bold hover:bg-primary hover:text-white hover:border-white rounded">Read more</button>
            </a>
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