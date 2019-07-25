<template>
  <Layout :title="this.$route.params.id">
    <div>
      <main>
        <h2 class="font-displayB">All {{ $route.params.id }} posts</h2>
        <article
          v-for="post in posts"
          :key="post.id"
          class="posts p-4 my-4 bg-white border-l-2 border-secondary rounded"
        >
          <div class="md:flex mb-4">
            <h3 class="w-3/4 font-display">{{ post.title }}</h3>
            <g-link :to="post.path" class="md:flex md:justify-end md:inline-block md:w-1/4">
              <button
                class="p-2 h-12 bg-white border border-callout font-displayB text-callout font-bold hover:bg-primary hover:text-white hover:border-white shadow-lg rounded"
              >Read more</button>
            </g-link>
          </div>
          <div class="flex mb-4 items-end">
            <p class="w-2/3 no-margin font-mono text-sm">{{ post.date }}</p>
            <p
              class="w-1/3 flex justify-end no-margin font-mono text-sm"
            >{{ post.timeToRead }} min to read</p>
          </div>
          <p class="mt-4 font-body">{{ post.excerpt }}</p>
        </article>
      </main>
    </div>
  </Layout>
</template>

<page-query>
query Categories($id: String!) {
  category(id: $id) {
    title
    belongsTo {
      edges {
        node {
          ... on Post {
            id
            title
            path
            excerpt
            timeToRead
            date
          }
        }
      }
    }
  }
}
</page-query>

<script>
export default {
  metaInfo() {
    return {
      title: this.$route.params.id
    };
  },
  computed: {
    posts() {
      return this.$page.category.belongsTo.edges.map(e => e.node);
    }
  }
};
</script>