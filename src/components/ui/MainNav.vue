<template>
  <div class="w-full md:h-16 md:flex bg-default text-primary shadow-lg">
    <nav class="w-full">
      <!-- Only appears when viewport is sm or smaller. -->
      <ul class="md:hidden flex justify-between px-2">
        <router-link
          to="/"
          :class="{ 'sm-nav-slide': activeHome }"
          class="nav-link border-b border-default"
          v-on:click.native="setCurrentNav('0')"
        >
          <li class="px-2">
            <p class="m-0">Home</p>
          </li>
        </router-link>
        <router-link
          to="/samples"
          :class="{ 'sm-nav-slide': activeSamples }"
          class="nav-link border-b border-default"
          v-on:click.native="setCurrentNav('1')"
        >
          <li class="px-2">
            <p class="m-0">Samples</p>
          </li>
        </router-link>
        <router-link
          to="/web_projects"
          :class="{ 'sm-nav-slide': activeProjects }"
          class="nav-link border-b border-default"
          v-on:click.native="setCurrentNav('2')"
        >
          <li class="leading-tight px-2">
            <p class="m-0">Web</p>
          </li>
        </router-link>
      </ul>

      <!-- Only appears when viewport is md or larger. -->
      <ul class="hidden md:block md:h-16 md:flex">
        <router-link
          to="/"
          :class="{ 'nav-slide': activeHome }"
          class="inactive-nav-link nav-link border-b border-default"
          v-on:click.native="setCurrentNav('0')"
        >
          <li class="flex px-6">
            <p class="m-0">Home</p>
          </li>
        </router-link>
        <router-link
          to="/samples"
          :class="{ 'nav-slide': activeSamples }"
          class="inactive-nav-link nav-link border-b border-default"
          v-on:click.native="setCurrentNav('1')"
        >
          <li class="flex px-6">
            <p class="m-0">Samples</p>
          </li>
        </router-link>
        <router-link
          to="/web_projects"
          :class="{ 'nav-slide': activeProjects }"
          class="inactive-nav-link nav-link border-b border-default"
          v-on:click.native="setCurrentNav('2')"
        >
          <li class="flex leading-tight px-6">
            <p class="m-0">Web Projects</p>
          </li>
        </router-link>
      </ul>
    </nav>
    <div class="hidden md:block md:flex md:justify-end md:items-center">
      <router-link to="/" class="flex items-center px-6">
        <div class="text-primary">
          <svg
            class="fill-current"
            width="30"
            height="40"
            viewBox="0 0 30 40"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            xml:space="preserve"
            xmlns:serif="http://www.serif.com/"
            style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"
          >
            <path
              d="M10.487,20.344l-5.673,6.304l0,13.352l-4.814,0l0,-40l4.814,0l0,21.261l0.172,0l5.73,-6.934l12.092,-14.327l5.903,0l-14.9,17.135l15.931,22.865l-5.96,0l-13.295,-19.656Z"
              style="fill-rule:nonzero;"
            />
          </svg>
        </div>
        <div class="text-accent pt-4">
          <svg
            class="fill-current"
            width="28"
            height="40"
            viewBox="0 0 28 40"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            xml:space="preserve"
            xmlns:serif="http://www.serif.com/"
            style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"
          >
            <rect
              x="0"
              y="35.2"
              width="28"
              height="4.8"
              style="fill-rule:nonzero;"
            />
          </svg>
        </div>

        <div class="text-primary">
          <svg
            class="fill-current"
            width="29"
            height="40"
            viewBox="0 0 29 40"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            xml:space="preserve"
            xmlns:serif="http://www.serif.com/"
            style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"
          >
            <path
              d="M4.814,40l-4.814,0l0,-40l15.931,0c3.515,0 6.256,0.974 8.224,2.923c1.967,1.948 2.951,4.756 2.951,8.424c0,2.941 -0.678,5.358 -2.034,7.249c-1.357,1.891 -3.353,3.142 -5.989,3.754l9.169,17.65l-5.444,0l-8.653,-17.192l-9.341,0l0,17.192Zm11.117,-21.318c1.91,0 3.391,-0.497 4.441,-1.49c1.051,-0.993 1.576,-2.407 1.576,-4.241l0,-2.98c0,-1.833 -0.525,-3.247 -1.576,-4.24c-1.05,-0.994 -2.531,-1.49 -4.441,-1.49l-11.117,0l0,14.441l11.117,0Z"
              style="fill-rule:nonzero;"
            />
          </svg>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "MainNav",
  mounted() {
    this.initialize();
  },
  data() {
    return {
      currentNavId: "0",
      currentPathId: this.$route.meta.id,
      activeHome: true,
      activeSamples: false,
      activeProjects: false
    };
  },
  methods: {
    initialize() {
      if (this.currentPathId !== this.currentNavId) {
        this.setCurrentNav(this.currentPathId);
      }
    },
    setCurrentNav(activeComponent) {
      if (activeComponent === "0") {
        this.currentNavId = "0";
        this.activeHome = true;
        this.activeSamples = false;
        this.activeProjects = false;
      } else if (activeComponent === "1") {
        this.currentNavId = "1";
        this.activeHome = false;
        this.activeSamples = true;
        this.activeProjects = false;
      } else if (activeComponent === "2") {
        this.currentNavId = "2";
        this.activeHome = false;
        this.activeSamples = false;
        this.activeProjects = true;
      }
    }
  }
};
</script>

<style scoped>
.nav-link {
  @apply flex;
  @apply items-center;
  @apply cursor-pointer;
  @apply opacity-50;
}

.nav-link:hover {
  @apply bg-tertiary;
  @apply opacity-75;
}

.nav-link:focus {
  @apply border-b-4;
  @apply border-accent;
}

.inactive-nav-link {
  @apply w-1/6;
  -webkit-transition: width 1s ease-in-out;
  -moz-transition: width 1s ease-in-out;
  -o-transition: width 1s ease-in-out;
  transition: width 1s ease-in-out;
}

.nav-slide {
  @apply w-full;
  @apply border-b-2;
  @apply border-accent;
  @apply opacity-100;
}

.sm-nav-slide {
  @apply border-b-2;
  @apply border-accent;
  @apply opacity-100;
}
</style>
