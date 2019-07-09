<template>
  <div>
    <h1 class="text-2xl font-bold">Coalition</h1>
    <UnitSelector />
    <!-- <ul v-for="unit in colUnits.units" :key="unit.id">
      <li>
        <h3 class="text-xl uppercase">{{ unit.name }}</h3>
        <img :src="unit.image" :alt="unit.name" />
      </li>
    </ul> -->
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import UnitSelector from "@/components/UnitSelector.vue";

export default {
  name: "CoalitionUnitViwer",
  components: {
    UnitSelector
  },
  computed: {
    // mix the getters into computed with object spread operator
    ...mapGetters([
      "colUnits",
      'galUnits'
      // ...
    ])
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
