<template>
  <div class="bg-secondary text-white rounded shadow-xl">
    <div class="gradient-bar h-1 rounded-t"></div>
    <header class="p-2 bg-white text-secondary border">
      <nav class="text-xl font-bold">
        <g-link to="/" class="pr-2 hover:text-primary">Home</g-link>
        <g-link to="/posts" class="pl-2 hover:text-primary">All posts</g-link>
      </nav>
    </header>
    <div class="p-2">
      <ul v-for="post in $static.posts.edges" :key="post.node.id">
        <g-link :to="post.node.path">
          <li class="m-2 px-2 hover:bg-white rounded hover:text-secondary">
            <h2 class="text-lg m-0">{{ post.node.title }}</h2>
            <p class="text-sm font-mono">{{ post.node.date }}</p>
          </li>
        </g-link>
      </ul>
    </div>
  </div>
</template>

<static-query>
query Posts {
  posts: allPost (sortBy: "date", order: DESC, limit: 10) {
    edges {
      node { 
        id
        title
        excerpt
        date
        timeToRead
        path
      }
    }
  }
}
</static-query>

<script scoped>
export default {
  name: "Sidebar"
};
</script>

<style scoped>
li {
  list-style: none;
}
a.active--exact {
  @apply bg-white;
  @apply text-callout;
}
</style>