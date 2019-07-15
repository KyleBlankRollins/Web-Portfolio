<template>
  <div>
    <nav class="text-xl">
      <g-link to="/" class="pr-2">Home</g-link>
      <g-link to="/blog" class="pl-2">Blog</g-link>
    </nav>
    <div>
      <ul v-for="post in $static.posts.edges" :key="post.node.id">
        <a :href="post.node.path">
          <li>
            <h2>{{ post.node.title }}</h2>
            <p>{{ post.node.date }}</p>
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

<script>
export default {
  name: "Sidebar"
};
</script>

<style>
li {
  list-style: none;
}
</style>