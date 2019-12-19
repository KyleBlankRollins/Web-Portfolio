<template>
  <div class="w-full flex items-center rounded">
    <div class="relative w-1/4 rounded">
      <img :src="doc.image" :alt="doc.alt" class="rounded shadow-xl" />
    </div>
    <div class="w-3/4 mx-4 border-l border-primary rounded-l">
      <div class="m-2">
        <div class="flex items-center">
          <h3 class="w-3/4 mb-6" v-html="doc.title"></h3>

          <div class="w-1/4 flex justify-end">
            <a
              :href="doc.link"
              class="w-24 h-8 flex items-center justify-center border border-primary hover:bg-accent px-2 rounded shadow-lg"
            >
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
