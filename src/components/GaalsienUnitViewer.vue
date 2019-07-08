<template>
  <div>
    <h1> Gaalsien </h1>
    <ul v-for="unit in galUnits.units" :key="unit.id">
      <li> 
        <p> {{ unit.name }} </p>
        <img :src="unit.image" :alt="unit.name">
      </li>
    </ul>
    
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: "GaalsienUnitViwer",
  computed: {
    // mix the getters into computed with object spread operator
    ...mapGetters([
      'galUnits',
      // ...
    ])
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
