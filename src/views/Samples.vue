<template>
  <section class="samples bg-default mt-6">
    <div class="sample-intro text-primary p-4">
      <h2>Writing samples</h2>
      <p>
        Most of my writing is covered under NDAs and not publically shareable.
        However, you can find several documents below.
      </p>
      <p>
        If you're curious about these documents or my other work, contact me
        through
        <a href="https://www.linkedin.com/in/kyle-blank-rollins/" class="link"
          >LinkedIn</a
        >
        or <a href="https://twitter.com/KyleBRollins" class="link">Twitter</a>.
      </p>
    </div>
    <div class="sample-items mx-2">
      <nav>
        <ul class="flex m-0">
          <li
            class="flex-1 flex items-center justify-center cursor-pointer text-primary border-b border-primary bg-utility-400 hover:bg-tertiary text-utility-100 rounded-t"
            :class="{ 'active-docs': selectedComponent === 'UserDocs' }"
            @click="setSelectedComp('UserDocs')"
          >
            <h4>User docs</h4>
          </li>
          <li
            class="flex-1 flex items-center justify-center cursor-pointer text-primary border-b border-primary bg-utility-400 hover:bg-tertiary text-utility-100 rounded-t"
            :class="{ 'active-docs': selectedComponent === 'DevDocs' }"
            @click="setSelectedComp('DevDocs')"
          >
            <h4>Dev docs</h4>
          </li>
          <li
            class="flex-1 flex items-center justify-center cursor-pointer text-primary border-b border-primary bg-utility-400 hover:bg-tertiary text-utility-100 rounded-t"
            :class="{ 'active-docs': selectedComponent === 'BlogDocs' }"
            @click="setSelectedComp('BlogDocs')"
          >
            <h4>Blog posts</h4>
          </li>
        </ul>
      </nav>

      <sampleSelector
        :selected-component="selectedComponent"
        class="border-l border-r border-b border-primary rounded-b"
      />
    </div>
  </section>
</template>

<script>
// @ is an alias to /src
import sampleSelector from "@/components/SampleSelector.vue";

export default {
  name: "samples",
  components: {
    sampleSelector
  },
  data() {
    return {
      selectedComponent: "UserDocs"
    };
  },
  methods: {
    setSelectedComp(name) {
      this.selectedComponent = name;
    }
  }
};
</script>

<style scoped>
.samples {
  display: grid;
  grid-template-areas:
    "lmargin content rmargin"
    "items   items   items";
  grid-template-columns: 1fr minmax(min-content, 900px) 1fr;
}

.sample-intro {
  grid-area: content;
}

.sample-items {
  grid-area: items;
}

.active-docs {
  @apply rounded-t;
  @apply border-t;
  @apply border-r;
  @apply border-l;
  @apply border-primary;
  @apply border-b-0;
  @apply bg-default;
  @apply text-primary;
  @apply text-xl;
}
</style>
