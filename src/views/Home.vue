<template>
  <div class="flex">
    <div class="mr-2">
      <UnitSelector :unitdata="this.colUnits" :currentUnit="this.currentUnits.currentColUnit" />
      <CoalitionUnitViewer :units="this.colUnits.units" />
    </div>
    <div class="ml-2">
      <UnitSelector :unitdata="this.galUnits" :currentUnit="this.currentUnits.currentGalUnit" />
      <GaalsienUnitViewer :units="this.galUnits.units" />
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapGetters } from 'vuex';

import CoalitionUnitViewer from "@/components/CoalitionUnitViewer.vue";
import GaalsienUnitViewer from "@/components/GaalsienUnitViewer.vue";
import UnitSelector from "@/components/UnitSelector.vue";

export default {
  name: "Home",
  components: {
    CoalitionUnitViewer,
    GaalsienUnitViewer,
    UnitSelector
  },
  computed: {
    // mix the getters into computed with object spread operator
    ...mapGetters([
      "galUnits",
      "colUnits",
      "currentUnits"
      // ...
    ])
  }

  // computed: {
  //   currentUnitLeft: function() {
  //     return "tab-" + this.currentTab.toLowerCase();
  //   }
  // }
  // https://jsfiddle.net/chrisvfritz/o3nycadu/
  // https://vuejs.org/v2/guide/components.html#Dynamic-Components
};
</script>
