<template>
  <div
    class="bg-default text-default"
    :class="{ dark: theme, light: !theme }"
    id="app"
  >
    <MainNav />
    <transition :name="transitionName">
      <router-view class="content" />
    </transition>
    <Foot @themeChange="updateTheme" />
  </div>
</template>

<script>
// @ is an alias to /src
import MainNav from "@/components/ui/MainNav.vue";
import Foot from "@/components/ui/Footer.vue";

export default {
  name: "app",
  components: {
    MainNav,
    Foot
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
#app {
  display: grid;
  grid-template-areas:
    "header  header  header"
    "content content content"
    "footer  footer  footer";
  grid-template-rows: 4rem 1fr 3rem;
  grid-template-columns: 1fr 800px 1fr;
}

.main-nav {
  grid-area: header;
  position: fixed;
  @apply z-40;
  @apply bg-primary;
}

.sub-nav {
  grid-area: sideNav;
}

.foot {
  grid-area: footer;
  position: fixed;
  bottom: 0;
  @apply z-40;
}

.content {
  grid-area: content;
}
</style>
