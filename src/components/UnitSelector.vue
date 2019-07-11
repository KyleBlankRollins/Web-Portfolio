<template>
  <nav>
    <div class="my-6 shadow-lg">
      <div class="gradient-bar h-1 rounded-t"></div>
      <h1 class="bg-white m-0 px-2 gradient-bar-bg">{{ unitdata.name }}</h1>
      <button class="w-full bg-primary font-bold p-4 rounded-b">
        <p v-on:click="openNav()" class="text-xl text-dark-grey text-left">
          Select unit...
        </p>
      </button>
    </div>
    <span :class="hidden">
      <div>
        <ul
          v-if="this.unitdata.name === 'Gaalsien'"
          class="flex flex-wrap cursor-pointer"
        >
          <li
            v-for="unit in unitdata.units"
            :key="unit.id"
            v-on:click="
              openNav();
              setGalUnit(unit);
            "
            class="w-1/2 relative border border-white opacity-75 hover:opacity-100"
          >
            <h3
              class="w-full text-xl text-dark-grey uppercase absolute px-2 bg-callout opacity-75"
            >
              {{ unit.name }}
            </h3>
            <img :src="unit.image" :alt="unit.name" />
          </li>
        </ul>
        <ul v-else class="flex flex-wrap cursor-pointer">
          <li
            v-for="unit in unitdata.units"
            :key="unit.id"
            v-on:click="
              openNav();
              setColUnit(unit);
            "
            class="w-1/2 relative border border-white opacity-75 hover:opacity-100"
          >
            <h3
              class="w-full text-xl text-dark-grey uppercase absolute px-2 bg-secondary opacity-75"
            >
              {{ unit.name }}
            </h3>
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
    currentUnit: Object
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
      this.$store.commit("setGalUnit", selectedUnit);
    },
    setColUnit(selectedUnit) {
      this.$store.commit("setColUnit", selectedUnit);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
