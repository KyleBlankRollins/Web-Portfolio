<template>
  <Layout>
    
    <h2>Welcome!</h2>
   
    <p>
      This is The Canney Valley. It's a place where I take commonplace experiences and turn them into something more - something we can learn from.
    </p>
    <p>
      Whether technical tutorials or views on life in general, the information on The Canney Valley is practical and useful.
    </p>
    <p>
      You can see my latest posts on the left or browse the Archive for more reading.
    </p>

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
    title: 'Hello, world!'
  }
}
</script>

<style>
.home-links a {
  margin-right: 1rem;
}
</style>
