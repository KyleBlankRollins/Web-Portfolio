<template>
  <div class="px-4">
    <transition name="fade">
      <div v-if="feature.expand">
        <img
          :src="feature.image"
          :alt="feature.alt"
          class="rounded shadow-lg"
        />
      </div>
    </transition>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "featureViewer",
  props: {
    feature: Object
  }
};
</script>
