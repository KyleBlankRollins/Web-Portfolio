<template>
  <div
    class="w-20 flex flex-col bg-default text-primary justify-center items-center border border-primary p-2 shadow-lg rounded"
  >
    <label class="switch">
      <input type="checkbox" v-model="theme" />
      <span class="slider"></span>
    </label>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "ThemeBar",
  data() {
    return {
      theme: false
    };
  },
  mounted() {
    this.$watch("theme", this.emitTheme);
  },
  methods: {
    emitTheme() {
      this.$emit("themeChange", this.theme);
    }
  }
};
</script>

<style scoped>
.switch {
  position: relative;
  display: inline-block;
  width: 4em;
  height: 1em;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  -webkit-transition: 0.4s;
  transition: 0.4s;
  @apply bg-primary;
}

.slider:before {
  position: absolute;
  content: "";
  height: 0.7em;
  width: 1.5em;
  left: 0.25em;
  bottom: 0.15em;
  @apply bg-default;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked + .slider {
  @apply bg-primary;
}

input:focus + .slider {
  box-shadow: 0 0 1px #ac556b;
}

input:checked + .slider:before {
  -webkit-transform: translateX(2em);
  -ms-transform: translateX(2em);
  transform: translateX(2em);
}
</style>
