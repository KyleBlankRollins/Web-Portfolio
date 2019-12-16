<template>
  <div class="foot flex items-center justify-end">
    <ThemeBar @themeChange="emitTheme" />
  </div>
</template>

<script>
// @ is an alias to /src
import ThemeBar from "@/components/ui/ThemeBar.vue";

export default {
  name: "foot",
  components: {
    ThemeBar
  },
  methods: {
    emitTheme(event) {
      this.$emit("themeChange", event);
    }
  }
};
</script>
