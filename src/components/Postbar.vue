<template>
  <div class="bg-secondary text-white rounded shadow-xl">
    <div class="gradient-bar h-1 rounded-t"></div>
    <header class="p-2 bg-white text-secondary border">
      <nav class="text-xl font-bold">
        <g-link to="/" class="pr-2 hover:text-primary">Home</g-link>
        <g-link to="/blog" class="pl-2 hover:text-primary">Archive</g-link>
      </nav>
    </header>
    <div class="flex p-2">
      <ul v-for="post in $static.posts.edges" :key="post.node.id">
        <a :href="post.node.path">
          <li class="m-2 px-2 hover:bg-white rounded hover:text-secondary">
            <h2 class="text-lg m-0">{{ post.node.title }}</h2>
            <p class="text-base">{{ post.node.date }}</p>
          </li>
        </a>
      </ul>
    </div>
  </div>
</template>

<static-query>
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

<style>
li {
  list-style: none;
}
</style>