<template>
  <button class="p-2" @click="toggleExpand(!expand)">
    <div class="toggle-plus" :class="{ rotate: expand }">
      <svg
        class="fill-current"
        width="20"
        height="20"
        viewBox="0 0 40 40"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        xml:space="preserve"
        xmlns:serif="http://www.serif.com/"
        style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"
      >
        <g>
          <path
            d="M22.75,1.375c0,-0.759 -0.616,-1.375 -1.375,-1.375l-2.75,0c-0.759,0 -1.375,0.616 -1.375,1.375l0,37.25c0,0.759 0.616,1.375 1.375,1.375l2.75,0c0.759,0 1.375,-0.616 1.375,-1.375l0,-37.25Z"
          />
          <path
            d="M1.375,17.25c-0.759,0 -1.375,0.616 -1.375,1.375l0,2.75c0,0.759 0.616,1.375 1.375,1.375l37.25,0c0.759,0 1.375,-0.616 1.375,-1.375l0,-2.75c0,-0.759 -0.616,-1.375 -1.375,-1.375l-37.25,0Z"
          />
        </g>
      </svg>
    </div>
  </button>
</template>

<script>
// @ is an alias to /src

export default {
  name: "Toggle",
  props: {
    expand: Boolean
  },
  methods: {
    toggleExpand(value) {
      this.$emit("toggled", value);
    }
  }
};
</script>
