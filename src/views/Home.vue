<template>
  <div class="flex">
    <div class="mr-2">
      <CoalitionUnitViewer />
    </div>
    <div class="ml-2">
      <GaalsienUnitViewer />
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import CoalitionUnitViewer from "@/components/CoalitionUnitViewer.vue";
import GaalsienUnitViewer from "@/components/GaalsienUnitViewer.vue";

export default {
  name: "Home",
  components: {
    CoalitionUnitViewer,
    GaalsienUnitViewer
  },
  // computed: {
  //   currentUnitLeft: function() {
  //     return "tab-" + this.currentTab.toLowerCase();
  //   }
  // }
  // https://jsfiddle.net/chrisvfritz/o3nycadu/
  // https://vuejs.org/v2/guide/components.html#Dynamic-Components
};
</script>
