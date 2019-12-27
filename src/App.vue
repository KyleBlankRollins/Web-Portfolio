<template>
  <div
    class="bg-default text-default"
    :class="{ dark: theme, light: !theme }"
    id="app"
  >
    <MainNav class="sticky top-0 z-40" />

    <transition :name="transitionName" mode="out-in">
      <router-view class="px-2 md:px-6" />
    </transition>
    <div class="sticky bottom-0 z-40 p-2">
      <ThemeBar @themeChange="updateTheme" />
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import MainNav from "@/components/ui/MainNav.vue";
import ThemeBar from "@/components/ui/ThemeBar.vue";

export default {
  name: "app",
  components: {
    MainNav,
    ThemeBar
  },
  data() {
    return {
      transitionName: "",
      theme: false
    };
  },
  methods: {
    updateTheme(event) {
      this.theme = event;
    }
  },
  watch: {
    $route(to, from) {
      const toDepth = to.meta.id;
      const fromDepth = from.meta.id;
      this.transitionName = toDepth < fromDepth ? "slide-right" : "slide-left";
    }
  }
};
</script>

<style>
.main-nav {
  position: fixed;
  @apply z-40;
  @apply bg-primary;
}
</style>
