<template>
  <div class="h-screen dark bg-primary text-primary" id="app">
    <MainNav />
    <transition :name="transitionName">
      <router-view class="content" />
    </transition>
    <Foot class="bg-default" />
  </div>
</template>

<script>
// @ is an alias to /src
import MainNav from "@/components/MainNav.vue";
import Foot from "@/components/Footer.vue";

export default {
  name: "app",
  components: {
    MainNav,
    Foot
  },
  data() {
    return {
      transitionName: ""
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
}

.sub-nav {
  grid-area: sideNav;
}

.foot {
  grid-area: footer;
}

.content {
  grid-area: content;
}
</style>
