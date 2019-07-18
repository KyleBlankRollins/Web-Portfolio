<template>
  <div class="bg-secondary text-white rounded shadow-xl">
    <div class="gradient-bar h-1 rounded-t"></div>
    <header class="p-2 bg-white text-secondary border">
      <nav class="text-lg font-display uppercase">
        <g-link to="/" class="pr-2 hover:text-primary">Home</g-link>
        <g-link to="/posts" class="pl-2 hover:text-primary">All posts</g-link>
      </nav>
    </header>
    <div class="flex p-2">
      <div class="flex border-r border-white self-center">
        <p class="m-0 pl-2 pr-4 py-3 font-display"> Recent posts </p>
      </div>
      <ul v-for="post in $static.posts.edges" :key="post.node.id">
        <g-link :to="post.node.path">
          <li class="m-2 px-2 hover:bg-white list-none rounded hover:text-secondary">
            <p class="text-lg font-display uppercase leading-snug m-0">{{ post.node.title }}</p>
            <p class="text-sm no-margin font-mono">{{ post.node.date }}</p>
          </li>
        </g-link>
      </ul>
    </div>
  </div>
</template>

<static-query>
query Posts {
  posts: allPost (sortBy: "date", order: DESC, limit: 3) {
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
  name: "Postbar"
};
</script>

<style scoped>
a.active--exact {
  @apply text-callout-light;
}
</style>