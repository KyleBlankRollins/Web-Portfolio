<template>
  <section class="container">
    <div class="container__content">
      <h1>Please select a page you wish to view</h1>
      <p>This is a website for demo purposes of using Nuxt & Contentful together</p>
    </div>
  </section>
</template>

<script>
  // import {createClient} from '../plugins/contentful';
  // const contentfulClient = createClient();
  export default {
    /*asyncData ({env}) {
      return Promise.all([
        // fetch all blog posts sorted by creation date
        contentfulClient.getEntries({
          'content_type': 'frontpage',
          order: '-sys.createdAt'
        })
      ]).then(([pages]) => {
        // return data that should be available
        // in the template
        return {
          pages: pages.items
        }
      }).catch(console.error)
    }*/
  }
</script>

<style>
.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; /* 1 */
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>

