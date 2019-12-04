<template>
  <div class="main-nav w-full h-16 flex shadow-lg">
    <nav class="w-full">
      <ul class="h-16 flex">
        <router-link
          to="/"
          :class="{'nav-slide': activeHome}"
          class="inactive-nav-link skew nav-link"
          v-on:click.native="setCurrentNav('0')"
        >
          <li class="flex skew-reset px-6">
            <p class="m-0">Home</p>
          </li>
        </router-link>
        <router-link
          to="/samples"
          :class="{'nav-slide': activeSamples}"
          class="inactive-nav-link skew nav-link"
          v-on:click.native="setCurrentNav('1')"
        >
          <li class="flex skew-reset px-6">
            <p class="m-0">Samples</p>
          </li>
        </router-link>
        <router-link
          to="/web_projects"
          :class="{'nav-slide': activeProjects}"
          class="inactive-nav-link skew nav-link"
          v-on:click.native="setCurrentNav('2')"
        >
          <li class="flex skew-reset leading-tight px-6">
            <p class="m-0">Web Projects</p>
          </li>
        </router-link>
      </ul>
    </nav>
    <div class="flex justify-end items-center">
      <router-link to="/" class="px-6">
        <svg
          width="26.458mm"
          height="12mm"
          version="1.1"
          viewBox="0 0 26.458 15.259"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g transform="translate(-101.3 -204.23)">
            <g transform="translate(-.20095 .83476)">
              <path
                d="m105.43 210.46-1.5162 1.7892v3.3964h-1.2736v-10.583h1.2736v5.5191h0.0455l1.3949-1.7588 3.1235-3.7603h1.5314l-3.7148 4.4577 3.8209 6.1256h-1.4859z"
                fill="#082736"
                style="font-feature-settings:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-variant-numeric:normal"
              />
              <path d="m111.5 217v-0.52917h6.9596v0.52917z" fill="#cc4162" />
              <path
                d="m121.12 215.64h-1.2736v-10.583h3.8512q1.4708 0 2.244 0.8036 0.77328 0.80361 0.77328 2.244 0 1.2888-0.66714 2.0621-0.66715 0.77329-1.9408 0.89458l2.6989 4.579h-1.4253l-2.5776-4.5184h-1.683zm2.5473-5.5949q0.8036 0 1.2433-0.39423 0.45487-0.40938 0.45487-1.1523v-0.78844q0-0.74297-0.45487-1.1372-0.43971-0.40938-1.2433-0.40938h-2.5473v3.8816z"
                fill="#082736"
                style="font-feature-settings:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-variant-numeric:normal"
              />
            </g>
          </g>
        </svg>
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
  @apply border-r border-primary flex items-center cursor-pointer;
}

.nav-link:hover {
  @apply bg-default;
}

.nav-link:focus {
  @apply bg-secondary;
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
  @apply bg-secondary;
}
</style>