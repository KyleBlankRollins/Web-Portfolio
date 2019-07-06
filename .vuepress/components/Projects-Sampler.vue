<template>
  <div class="flex flex-wrap text-xl">
    <div
      v-for="project in projects"
      class="projects max-w-sm md:max-w-full my-10 items-center shadow-md rounded"
    >
      <div class="flex px-6 py-2 bg-secondary rounded-t">
        <h3
          class="w-10/12 m-0 font-bold font-display text-2xl text-white"
        >{{ project.frontmatter.title }}</h3>
        <button v-if="project.frontmatter.url" class="w-2/12 text-center bg-button-primary hover:bg-callout grow hover:grow px-2 rounded" >
          <div>
            <a :href="project.frontmatter.url">
              <p class="text-white">Visit</p>
            </a>
          </div>
        </button>
        <div v-else class="w-2/12 text-center bg-button-warning px-2 rounded">
          <p>Not available</p>
        </div>
      </div>
      <div class="gradient-bar h-1"></div>
      <div class="bg-cover bg-white">
        <img class="min-h-full" :src="project.frontmatter.image" />
      </div>
      <div class="bg-white mx-8 my-8 rounded">
        <div class="px-6 py-2 font-body m-0">
          <div class="flex">
            <div class="pr-2">
              <p class="margin-override">Status:</p>
            </div>
            <div>
              <p
                class="margin-override italic text-primary font-bold"
              >{{ project.frontmatter.status }}</p>
            </div>
          </div>
          <p>{{ project.frontmatter.description }}</p>
          <div>
            <h3 class="margin-override pb-2 pt-6">Tech breakdown</h3>
          </div>
          <div class="flex flex-wrap p-2">
            <div
              class="p-2 m-1 bg-secondary text-sm text-white border-2 border-primary items-center rounded"
              v-for="tech in project.frontmatter.tech"
            >
              <p class="margin-override font-mono">{{ tech.name }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Projects",
  computed: {
    projects() {
      let currentPage = this.page ? this.page : this.$page.path;
      let projects = this.$site.pages.filter(x => {
        return x.path.match(new RegExp(`(${currentPage})(?=.*html)`));
      });
      return projects;
    }
  }
};
</script>

<style>
.projects:nth-child(odd) {
  background-color: #6290a4;
}

.projects:nth-child(even) {
  background-color: #756265;
}
</style>
