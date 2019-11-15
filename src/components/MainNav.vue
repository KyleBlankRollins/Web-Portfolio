<template>
  <div class="bg-green-700 w-full main-nav flex shadow-lg">
    <nav class="w-full">
      <ul class="bg-green-200 h-16 flex list-none">
        <!-- TODO: Figure out how to get the router link to work with @click. -->
        <router-link
          to="/"
          :class="{'nav-slide': activeHome}"
          class="bg-green-200 skew cursor-pointer"
        >
          <li @click="setCurrentNav('0')" class="px-6">
            <span class="flex skew-reset px-4 my-2">
              <p>Home</p>
            </span>
          </li>
        </router-link>
        <router-link
          to="/samples"
          :class="{'nav-slide': activeSamples}"
          class="bg-green-300 skew cursor-pointer"
        >
          <li @click="setCurrentNav('1')" class="px-6">
            <span class="flex skew-reset px-4 my-2">
              <p>Samples</p>
            </span>
          </li>
        </router-link>
        <router-link
          to="/web_projects"
          :class="{'nav-slide': activeProjects}"
          class="bg-green-400 skew cursor-pointer"
        >
          <li @click="setCurrentNav('2')" class="px-6">
            <span class="flex skew-reset px-4 my-2">
              <p>Web Projects</p>
            </span>
          </li>
        </router-link>
      </ul>
    </nav>
    <div class="bg-green-700 skew flex justify-end items-center">
      <router-link to="/" class="skew-reset px-6">
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
  data() {
    return {
      activeHome: true,
      activeSamples: false,
      activeProjects: false
    };
  },
  methods: {
    setCurrentNav(activeComponent) {
      if (activeComponent === "0") {
        this.activeHome = true;
        this.activeSamples = false;
        this.activeProjects = false;
      } else if (activeComponent === "1") {
        this.activeHome = false;
        this.activeSamples = true;
        this.activeProjects = false;
      } else if (activeComponent === "2") {
        this.activeHome = false;
        this.activeSamples = false;
        this.activeProjects = true;
      }
    }
  }
};
</script>

<style scoped>
.nav-slide {
  @apply w-full;
}
</style>