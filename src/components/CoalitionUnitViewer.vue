<template>
  <div>
    <h1 class="text-2xl font-bold">Coalition</h1>
    <!-- <ul v-for="unit in colUnits.units" :key="unit.id">
      <li>
        <h3 class="text-xl uppercase">{{ unit.name }}</h3>
        <img :src="unit.image" :alt="unit.name" />
      </li>
    </ul> -->
  </div>
</template>

<script>
export default {
  name: "CoalitionUnitViwer",
  props: {
    units: Object
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
