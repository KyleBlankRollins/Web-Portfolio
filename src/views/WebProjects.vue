<template>
  <section class="web-projects bg-default mt-6">
    <div class="web-intro text-primary p-4">
      <div>
        <h2>Web projects</h2>
        <p>
          As a hobbyist web developer, I'm always looking for interesting things
          to do and learn. You'll find a number of my recent projects on this
          page.
        </p>
      </div>
      <nav>
        <ul class="flex flex-wrap justify-center">
          <li
            v-for="project in projects"
            :key="project.id"
            class="relative flex w-2/3 h-24 my-2 cursor-pointer border-b-4 border-primary opacity-50 hover:opacity-75 shadow-lg rounded"
            :class="{
              'active-project': selectedComponent === project.component
            }"
            @click="setSelectedComp(project.component)"
          >
            <div class="w-full bg-tertiary rounded relative">
              <img
                class="absolute h-full w-full inset-0 object-cover object-right rounded"
                :src="project.image"
                :alt="project.alt"
              />
            </div>
            <div
              class="opaque absolute w-full flex bottom-0 p-2 items-center justify-center"
            >
              <h3 class="m-0">{{ project.name }}</h3>
            </div>
          </li>
        </ul>
      </nav>
    </div>
    <div class="web-items">
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
      selectedComponent: "DefaultProject",
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
.web-projects {
  display: grid;
  grid-template-areas:
    "lmargin  content  rmargin"
    "items    items    items";
  grid-template-columns: 1fr minmax(min-content, 900px) 1fr;
}

.web-intro {
  grid-area: content;
}

.web-items {
  grid-area: items;
}

.opaque {
  background: rgba(208, 167, 126, 0.9);
}

.active-project {
  @apply border-accent;
  @apply opacity-100;
}
</style>
