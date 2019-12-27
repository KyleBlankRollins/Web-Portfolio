<template>
  <div class="w-full md:flex md:items-center rounded">
    <div class="relative md:w-1/4 rounded">
      <img :src="doc.image" :alt="doc.alt" class="rounded shadow-xl" />
      <!-- Only appears when viewport is sm or smaller. -->
      <div class="md:hidden w-full absolute bg-accent bottom-0 rounded-b">
        <a :href="doc.link">
          <button class="w-full">View</button>
        </a>
      </div>
    </div>

    <!-- Only appears when viewport is md or larger. -->
    <div
      class="hidden md:block md:w-3/4 mx-4 border-l border-primary rounded-l"
    >
      <div class="m-2">
        <div class="flex items-center">
          <h3 class="w-3/4 mb-6" v-html="doc.title"></h3>

          <div class="w-1/4 flex justify-end">
            <a :href="doc.link" class="btn">
              <button class="w-full">View doc</button>
            </a>
          </div>
        </div>
        <p>{{ doc.description }}</p>
        <p>{{ doc.contribution }}</p>
        <div class="flex items-baseline">
          <p>Publication frequency:</p>
          <p>{{ doc.pubFrequency }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "sampleViewer",
  props: {
    doc: Object
  }
};
</script>

<style scoped>
.opaque {
  background: rgba(42, 55, 65, 0.75);
}
</style>
