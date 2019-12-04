<template>
  <div class="skew flex flex-col bg-primary justify-center items-center py-2 px-6">
    <p class="skew-reset m-0">Toggle theme</p>
    <label class="switch my-2">
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
  @apply bg-default;
}

.slider:before {
  position: absolute;
  content: "";
  height: .7em;
  width: 1.5em;
  left: .25em;
  bottom: .15em;
  @apply bg-inverse-soft;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked + .slider {
  @apply bg-secondary;
}

input:focus + .slider {
  box-shadow: 0 0 1px #AC556B;
}

input:checked + .slider:before {
  -webkit-transform: translateX(2em);
  -ms-transform: translateX(2em);
  transform: translateX(2em);
}
</style>