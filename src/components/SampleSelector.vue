<template>
  <div>
    <component :is="currentComponent"></component>
  </div>
</template>

<script>
// @ is an alias to /src
import FailState from "@/components/ui/FailState.vue";

import UserDocs from "@/components/UserDocs.vue";
import DevDocs from "@/components/DevDocs.vue";
import BlogDocs from "@/components/BlogDocs.vue";

export default {
  name: "sampleSelector",
  props: {
    selectedComponent: String
  },
  components: {
    UserDocs,
    DevDocs,
    BlogDocs,
    FailState
  },
  computed: {
    currentComponent() {
      if (this.selectedComponent) {
        if (this.selectedComponent === "UserDocs") {
          return UserDocs;
        } else if (this.selectedComponent === "DevDocs") {
          return DevDocs;
        } else if (this.selectedComponent === "BlogDocs") {
          return BlogDocs;
        } else {
          return FailState;
        }
      } else {
        return FailState;
      }
    }
  }
};
</script>
