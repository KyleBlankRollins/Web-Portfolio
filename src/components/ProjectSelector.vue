<template>
  <div>
    <component :is="currentComponent"></component>
  </div>
</template>

<script>
// @ is an alias to /src
import DefaultProject from "@/components/projects/DefaultProject.vue";
import DocDashboard from "@/components/projects/DocDashboard.vue";
import DokCompare from "@/components/projects/DokCompare.vue";
import TheCanneyValley from "@/components/projects/TheCanneyValley.vue";

export default {
  name: "projectSelector",
  props: {
    selectedComponent: String
  },
  components: {
    DefaultProject,
    DocDashboard,
    DokCompare,
    TheCanneyValley
  },
  computed: {
    currentComponent() {
      if (this.selectedComponent) {
        if (this.selectedComponent === "DocDashboard") {
          return DocDashboard;
        } else if (this.selectedComponent === "DokCompare") {
          return DokCompare;
        } else if (this.selectedComponent === "TheCanneyValley") {
          return TheCanneyValley;
        } else {
          return DefaultProject;
        }
      } else {
        return DefaultProject;
      }
    }
  }
};
</script>
