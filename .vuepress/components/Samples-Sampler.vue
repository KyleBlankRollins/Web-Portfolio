<template>
  <div class="flex flex-wrap text-xl">
    <div class="samples max-w-sm lg:max-w-full py-8 px-8 my-10 shadow-md rounded" v-for="sample in samples">
      <div class="lg:flex lg:max-w-full no-underline">
        <div class="w-1/4 bg-cover bg-white border-4 border-white hover:border-4 hover:border-callout mr-4 rounded grow grow:hover">
          <router-link :to="sample.path">
            <img class="min-h-full" :src="sample.frontmatter.image" :alt="sample.frontmatter.imgAlt" />
          </router-link>
        </div>
        <div class="w-3/4 flex flex-col justify-between border bg-white rounded">
          <div class="lg:flex w-full">
            <div class="p-2">
              <h3 class="text-primary font-displayB text-3xl m-0">{{ sample.frontmatter.title }}</h3>
            </div>
          </div>

          <div class="p-2 font-bodyB text-lg">
            <p>{{ sample.frontmatter.description }}</p>
          </div>

          <div class="flex flex-wrap p-2">
            <div
              class="p-2 m-1 bg-secondary text-sm text-white border-2 border-primary items-center rounded"
              v-for="skill in sample.frontmatter.skills"
            >
              <p class="margin-override font-mono">{{ skill.name }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Samples",
  computed: {
    samples() {
      let currentPage = this.page ? this.page : this.$page.path;
      let samples = this.$site.pages.filter(x => {
        return x.path.match(new RegExp(`(${currentPage})(?=.*html)`));
      });
      return samples;
    }
  }
};
</script>

<style>
.samples:nth-child(odd) {
  background-color: #756265;
}

.samples:nth-child(even) {
  background-color: #6290a4;
}
</style>
