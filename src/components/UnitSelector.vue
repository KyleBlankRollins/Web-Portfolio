<template>
  <nav>
    <button class="w-full bg-primary font-bold p-4 mb-2 rounded">
      <p v-on:click="openNav()" class="text-xl text-dark-grey text-left">Select unit...</p>
    </button>
    <span :class="hidden">
      <div>
        <ul v-if="this.unitdata.name === 'Gaalsien'" class="w-1/2 cursor-pointer">
          <li
            v-for="unit in unitdata.units"
            :key="unit.id"
            v-on:click="openNav(); setGalUnit(unit.name); "
            class="relative border border-white opacity-75 hover:opacity-100"
          >
            <h3
              class="w-full text-xl text-dark-grey uppercase absolute px-2 bg-callout opacity-75"
            >{{ unit.name }}</h3>
            <img :src="unit.image" :alt="unit.name" />
          </li>
        </ul>
        <ul v-else class="w-1/2 cursor-pointer">
          <li
            v-for="unit in unitdata.units"
            :key="unit.id"
            v-on:click="openNav(); setColUnit(unit.name);"
            class="relative border border-white opacity-75 hover:opacity-100"
          >
            <h3
              class="w-full text-xl text-dark-grey uppercase absolute px-2 bg-secondary opacity-75"
            >{{ unit.name }}</h3>
            <img :src="unit.image" :alt="unit.name" />
          </li>
        </ul>
      </div>
    </span>
  </nav>
</template>

<script>
export default {
  name: "UnitSelector",
  props: {
    unitdata: Object,
    currentUnit: String
  },
  data() {
    return {
      hidden: "hidden"
    };
  },
  methods: {
    openNav() {
      if (this.hidden == "hidden") this.hidden = "p-2 block";
      else {
        this.hidden = "hidden";
      }
    },
    setGalUnit(selectedUnit) {
      this.$store.commit('setGalUnit', selectedUnit);
    },
    setColUnit(selectedUnit) {
      this.$store.commit('setColUnit', selectedUnit);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
