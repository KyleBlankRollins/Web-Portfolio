<template>
<button :class="{}" class="px-4 py-2" @click="toggleExpand(!expand)">
  <div :class="{'flip-h': !expand}">
    <svg
      class="w-6 fill-current"
      viewBox="0 0 246 151"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      xml:space="preserve"
      xmlns:serif="http://www.serif.com/"
    >
      <g>
        <path
          d="M120.53,0l-122.53,70.743l0.001,79.864l122.53,-70.742l-0.001,-79.865Z"
        />
        <path
          d="M124.531,0.066l122.568,70.677l0.042,79.864l-122.568,-70.677l-0.042,-79.864Z"
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