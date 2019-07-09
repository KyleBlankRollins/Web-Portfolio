<template>
  <div>
    <h1 class="text-2xl font-bold"> Gaalsien </h1>
    <component :is="currentUnit"> </component>
    <!-- <ul v-for="unit in galUnits.units" :key="unit.id">
      <li> 
        <h3 class="text-xl uppercase"> {{ unit.name }} </h3>
        <img :src="unit.image" :alt="unit.name">
      </li>
    </ul> -->
    
  </div>
</template>

<script>
import Sandskimmer from "@/components/units/Sandskimmer-g.vue";

export default {
  name: "GaalsienUnitViwer",
  props: {
    units: Object
  },
  data() {
    return {
      currentUnit: 'Sandskimmer'
    }
  },
  components: {
    Sandskimmer
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
