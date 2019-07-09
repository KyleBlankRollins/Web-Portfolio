<template>
  <div>
    <h1 class="text-2xl font-bold"> test </h1>
    <UnitSelector />
    <!-- <ul v-for="unit in galUnits.units" :key="unit.id">
      <li> 
        <h3 class="text-xl uppercase"> {{ unit.name }} </h3>
        <img :src="unit.image" :alt="unit.name">
      </li>
    </ul> -->
    
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: "Sandskimmer",
  data() {
    return {
      unitData: { }
    };
  },
  computed: {
    // mix the getters into computed with object spread operator
    ...mapGetters([
      'galUnits',
      'colUnits'
      // ...
    ])
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>