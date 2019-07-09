<template>
  <header>
    <nav
      class="nav flex items-center justify-between flex-wrap text-right border-b border-secondary text-primary font-display text-xl"
    >
      <a href="https://www.kyleblankrollins.com/" class="cursor-pointer">
        <div>
          <svg
            version="1.1"
            viewBox="0 0 26.458 15.259"
            xmlns="http://www.w3.org/2000/svg"
            class="h-10"
          >
            <g transform="translate(-101.3 -204.23)">
              <g transform="translate(-.20095 .83476)">
                <path
                  d="m105.43 210.46-1.5162 1.7892v3.3964h-1.2736v-10.583h1.2736v5.5191h0.0455l1.3949-1.7588 3.1235-3.7603h1.5314l-3.7148 4.4577 3.8209 6.1256h-1.4859z"
                  fill="#ffffff"
                  style="font-feature-settings:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-variant-numeric:normal"
                />
                <path d="m111.5 217v-0.52917h6.9596v0.52917z" fill="#cc4162" />
                <path
                  d="m121.12 215.64h-1.2736v-10.583h3.8512q1.4708 0 2.244 0.8036 0.77328 0.80361 0.77328 2.244 0 1.2888-0.66714 2.0621-0.66715 0.77329-1.9408 0.89458l2.6989 4.579h-1.4253l-2.5776-4.5184h-1.683zm2.5473-5.5949q0.8036 0 1.2433-0.39423 0.45487-0.40938 0.45487-1.1523v-0.78844q0-0.74297-0.45487-1.1372-0.43971-0.40938-1.2433-0.40938h-2.5473v3.8816z"
                  fill="#ffffff"
                  style="font-feature-settings:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-variant-numeric:normal"
                />
              </g>
            </g>
          </svg>
        </div>
      </a>

      <div v-on:click="openNav()" class="lg:hidden">
        <button
          class="flex m-5 px-3 py-2 border text-secondary rounded border-secondary hover:text-callout hover:border-callout"
        >
          <svg class="fill-current h-6 w-6" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <title>Menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
        </button>
      </div>
      <div class="w-full block justify-end lg:flex lg:w-auto">
        <div class="lg:flex-grow">
          <span>
            <span :class="hidden">
              <a
                href="https://www.kyleblankrollins.com/"
                class="py-2 px-4 lg:mt-0 no-underline uppercase text-primary hover:text-callout hover:underline"
              >About</a>
              <a
                href="https://www.kyleblankrollins.com/samples/"
                class="py-2 px-4 lg:mt-0 no-underline uppercase text-primary hover:text-callout hover:underline"
              >Samples</a>
              <a
                href="https://www.kyleblankrollins.com/projects/"
                class="py-2 px-4 lg:mt-0 no-underline uppercase hover:text-callout hover:underline bg-secondary text-white"
              >Web Projects</a>
            </span>
          </span>
        </div>
      </div>
    </nav>
    <img class="mt-2" src="@/assets/dok-logo.svg" alt="DoK Compare">
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
.router-link-exact-active {
  background: #18151c;
  color: #f8f8f8 !important;
}
</style>