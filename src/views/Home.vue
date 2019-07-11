<template>
  <div class="md:flex lg:flex xl:flex">
    <div class="mr-2">
      <UnitSelector
        :unitdata="this.colUnits"
        :currentUnit="this.currentUnits.currentColUnit"
      />
      <CoalitionUnitViewer
        :unit="this.currentUnits.currentColUnit"
        :comparison="this.comparison.colUnit"
      />
    </div>
    <div class="ml-2">
      <UnitSelector
        :unitdata="this.galUnits"
        :currentUnit="this.currentUnits.currentGalUnit"
      />
      <GaalsienUnitViewer
        :unit="this.currentUnits.currentGalUnit"
        :comparison="this.comparison.galUnit"
      />
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapGetters } from "vuex";

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
    ]),
    comparison: function() {
      // Initialize data to be returned.
      var comparison = {
        galUnit: {
          speed: null,
          armor: null,
          damage: null,
          hull: null
        },
        colUnit: {
          speed: null,
          armor: null,
          damage: null,
          hull: null
        }
      };

      // Comparison logic for speed, armor, damage, and hull.
      // SPEED
      if (
        this.currentUnits.currentGalUnit.speed >
        this.currentUnits.currentColUnit.speed
      ) {
        comparison.galUnit.speed = true;
        comparison.colUnit.speed = false;
      } else if (
        this.currentUnits.currentGalUnit.speed <
        this.currentUnits.currentColUnit.speed
      ) {
        comparison.galUnit.speed = false;
        comparison.colUnit.speed = true;
      } else {
        comparison.galUnit.speed = null;
        comparison.colUnit.speed = null;
      }

      // ARMOR
      if (
        this.currentUnits.currentGalUnit.armor >
        this.currentUnits.currentColUnit.armor
      ) {
        comparison.galUnit.armor = true;
        comparison.colUnit.armor = false;
      } else if (
        this.currentUnits.currentGalUnit.armor <
        this.currentUnits.currentColUnit.armor
      ) {
        comparison.galUnit.armor = false;
        comparison.colUnit.armor = true;
      } else {
        comparison.galUnit.armor = null;
        comparison.colUnit.armor = null;
      }

      // DAMAGE
      if (
        this.currentUnits.currentGalUnit.damage >
        this.currentUnits.currentColUnit.damage
      ) {
        comparison.galUnit.damage = true;
        comparison.colUnit.damage = false;
      } else if (
        this.currentUnits.currentGalUnit.damage <
        this.currentUnits.currentColUnit.damage
      ) {
        comparison.galUnit.damage = false;
        comparison.colUnit.damage = true;
      } else {
        comparison.galUnit.damage = null;
        comparison.colUnit.damage = null;
      }

      // HULL
      if (
        this.currentUnits.currentGalUnit.hull >
        this.currentUnits.currentColUnit.hull
      ) {
        comparison.galUnit.hull = true;
        comparison.colUnit.hull = false;
      } else if (
        this.currentUnits.currentGalUnit.hull <
        this.currentUnits.currentColUnit.hull
      ) {
        comparison.galUnit.hull = false;
        comparison.colUnit.hull = true;
      } else {
        comparison.galUnit.hull = null;
        comparison.colUnit.hull = null;
      }

      // Return comparison data.
      return comparison;
    }
  }
};
</script>
