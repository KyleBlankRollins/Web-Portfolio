<template>
  <div class="bg-green-700 w-full flex shadow-lg">
    <nav class="w-full">
      <ul class="bg-green-200 h-16 px-4 flex items-center list-none">
        <li>
          <p> section name </p>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "SideNav",
  mounted() {
    this.initialize();
  },
  data() {
    return {
      currentSectionId: ""
    };
  },
  methods: {
    initialize() {
      if(this.currentPathId !== this.currentNavId) {
        this.setCurrentNav(this.currentPathId);
      }
    },
    setCurrentNav(activeComponent) {
      if (activeComponent === "0") {
        this.currentNavId = "0"
        this.activeHome = true;
        this.activeSamples = false;
        this.activeProjects = false;
      } else if (activeComponent === "1") {
        this.currentNavId = "1"
        this.activeHome = false;
        this.activeSamples = true;
        this.activeProjects = false;
      } else if (activeComponent === "2") {
        this.currentNavId = "2"
        this.activeHome = false;
        this.activeSamples = false;
        this.activeProjects = true;
      }
    }
  }
};
</script>

<style scoped>
.nav-link {
  @apply w-1/12;
  -webkit-transition: width 1s ease-in-out;
  -moz-transition: width 1s ease-in-out;
  -o-transition: width 1s ease-in-out;
  transition: width 1s ease-in-out;
}

.nav-slide {
  @apply w-full;
}
</style>