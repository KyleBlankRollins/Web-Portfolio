<template>
  <div>
    <ul v-for="post in $page.posts.edges" :key="post.node.id">
      <li>
        <h2>{{ post.node.title }}</h2>
        <p>{{ post.node.excerpt }}</p>
        <p>{{ post.node.date }}</p>
        <p>{{ post.node.timeToRead }}</p>
        <a :href="post.node.path">
          <button>Read more</button>
        </a>
      </li>
    </ul>
  </div>
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
      }
    }
  }
}
</page-query>

<script>
export default {
  name: 'Sidebar'
};
</script>

<style>
li {
  list-style: none;
}
</style>