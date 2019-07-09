<template>
  <nav>
    <button class="w-1/2 bg-primary font-bold p-4 mb-2 rounded">
      <p v-on:click="openNav()" class="text-xl text-dark-grey text-left">Select unit...</p>
    </button>
    <span :class="hidden">
      <div class="flex">
        <div class="w-1/2">
        <ul v-for="unit in galUnits.units" :key="unit.id">
          <li v-on:click="openNav()" class="relative border border-white opacity-75 hover:opacity-100">
            <h3 class="w-full text-xl text-dark-grey uppercase absolute px-2 bg-callout opacity-75">{{ unit.name }}</h3>
            <img :src="unit.image" :alt="unit.name" />
          </li>
        </ul>
      </div>
      <div class="w-1/2">
        <ul v-for="unit in colUnits.units" :key="unit.id">
          <li v-on:click="openNav()" class="relative border border-white opacity-75 hover:opacity-100">
            <h3 class="w-full text-xl text-dark-grey uppercase absolute px-2 bg-secondary opacity-75">{{ unit.name }}</h3>
            <img :src="unit.image" :alt="unit.name" />
          </li>
        </ul>
      </div>
      </div>
    </span>
  </nav>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "UnitSelector",
  data() {
    return {
      hidden: "hidden"
    };
  },
  computed: {
    // mix the getters into computed with object spread operator
    ...mapGetters([
      "galUnits",
      "colUnits"
      // ...
    ])
  },
  methods: {
    openNav() {
      if (this.hidden == "hidden")
        this.hidden = "p-2 block";
      else {
        this.hidden = "hidden";
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
