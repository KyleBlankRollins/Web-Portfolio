<template>
  <header class="mb-6">
    <div class="flex mt-6 items-center text-secondary">
      <g-image src="~/assets/logo-opt.svg" class="h-10 w-10 mr-4" />
      <h1 class="leading-tight m-0">THE CANNEY VALLEY</h1>
    </div>
  </header>
</template>

<script>
export default {
  name: "Navbar",
  data() {
    return {
      hidden: "lg:inline-block md:hidden sm:hidden hidden"
    };
  },
  methods: {
    openNav() {
      if (this.hidden == "lg:inline-block md:hidden sm:hidden hidden")
        this.hidden = "p-2 block";
      else {
        this.hidden = "lg:inline-block md:hidden sm:hidden hidden";
      }
    }
  }
};
</script>

<style>
</style>