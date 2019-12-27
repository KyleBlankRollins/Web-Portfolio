<template>
  <section class="mt-6">
    <div class="max-w-text text-primary px-2 md:px-6">
      <h2>Web projects</h2>
      <p>
        As a hobbyist web developer, I'm always looking for interesting things
        to do and learn. You'll find a number of my recent projects on this
        page.
      </p>
    </div>
    <nav class="w-full bg-default text-primary sticky top-0 shadow-lg z-50">
      <ul class="md:h-16 md:flex md:justify-center m-0">
        <li
          v-for="project in projects"
          :key="project.id"
          class="flex w-full cursor-pointer border-b border-default opacity-50 hover:bg-tertiary hover:opacity-75 rounded-t"
          :class="{
            'active-project': selectedComponent === project.component
          }"
          @click="setSelectedComp(project.component)"
        >
          <div class="w-full flex bottom-0 items-center justify-center">
            <p class="m-0">{{ project.name }}</p>
          </div>
        </li>
      </ul>
    </nav>
    <div class="pt-4 my-5">
      <ProjectSelector :selected-component="selectedComponent" />
    </div>
  </section>
</template>

<script>
// @ is an alias to /src
import ProjectSelector from "@/components/ProjectSelector.vue";

export default {
  name: "WebProjects",
  components: {
    ProjectSelector
  },
  data() {
    return {
      selectedComponent: "DocDashboard",
      projects: [
        {
          id: "10",
          component: "DocDashboard",
          name: "Doc Dashboard v2.0",
          image: require("../assets/images/sites/overview_dark.png"),
          alt: "Overview report for Doc Dashboard."
        },
        {
          id: "11",
          component: "DokCompare",
          name: "Dok Compare",
          image: require("../assets/images/sites/dok-compare.png"),
          alt: "Home page for the DoK Compare website."
        },
        {
          id: "12",
          component: "TheCanneyValley",
          name: "The Canney Valley",
          image: require("../assets/images/sites/the_canney_valley.png"),
          alt: "The home page of The Canney Valley."
        }
      ]
    };
  },
  methods: {
    setSelectedComp(name) {
      this.selectedComponent = name;
    }
  }
};
</script>

<style scoped>
.opaque {
  background: rgba(208, 167, 126, 0.9);
}

.active-project {
  @apply border-accent;
  @apply border-b-2;
  @apply opacity-100;
}
</style>
