<template>
  <Layout class="text-secondary">
    
    <h2 class="font-displayB">Welcome!</h2>
   
    <p>
      This is The Canney Valley. It's a place where I take commonplace experiences and turn them into something more - something we can learn from.
    </p>
    <p>
      Whether technical tutorials or views on life in general, the information on The Canney Valley is practical and useful.
    </p>
    <p>
      If you run into any technical issues, let me know through <g-link to="https://github.com/KyleBlankRollins/Web-Portfolio/tree/the-canney-valley" class="text-callout underline">GitHub</g-link>.
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
    title: 'Home'
  }
}
</script>

<style>
.home-links a {
  margin-right: 1rem;
}
</style>
