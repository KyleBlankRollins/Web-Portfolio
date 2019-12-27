<template>
  <section class="mt-6">
    <div class="max-w-text text-primary px-2 md:px-6 pb-6">
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
    <div>
      <!-- Only appears when viewport is sm or smaller. -->
      <nav class="w-full bg-default text-primary sticky top-0 shadow-lg z-50">
        <ul class="md:hidden flex m-0">
          <li
            class="flex-1 flex items-center justify-center cursor-pointer border-b border-default"
            :class="{ 'active-docs': selectedComponent === 'UserDocs' }"
            @click="setSelectedComp('UserDocs')"
          >
            <p class="m-0">User</p>
          </li>
          <li
            class="flex-1 flex items-center justify-center cursor-pointer border-b border-default"
            :class="{ 'active-docs': selectedComponent === 'DevDocs' }"
            @click="setSelectedComp('DevDocs')"
          >
            <p class="m-0">Dev</p>
          </li>
          <li
            class="flex-1 flex items-center justify-center cursor-pointer border-b border-default"
            :class="{ 'active-docs': selectedComponent === 'BlogDocs' }"
            @click="setSelectedComp('BlogDocs')"
          >
            <p class="m-0">Blog</p>
          </li>
        </ul>
      </nav>

      <!-- Only appears when viewport is md or larger. -->
      <nav class="w-full bg-default text-primary sticky top-0 shadow-lg z-50">
        <ul class="hidden md:block md:h-16 md:flex md:m-0">
          <li
            class="flex-1 flex items-center justify-center opacity-50 hover:bg-tertiary hover:opacity-75 cursor-pointer border-b border-default rounded-t"
            :class="{ 'active-docs': selectedComponent === 'UserDocs' }"
            @click="setSelectedComp('UserDocs')"
          >
            <h4>User docs</h4>
          </li>
          <li
            class="flex-1 flex items-center justify-center opacity-50 hover:bg-tertiary hover:opacity-75 cursor-pointer border-b border-default rounded-t"
            :class="{ 'active-docs': selectedComponent === 'DevDocs' }"
            @click="setSelectedComp('DevDocs')"
          >
            <h4>Dev docs</h4>
          </li>
          <li
            class="flex-1 flex items-center justify-center opacity-50 hover:bg-tertiary hover:opacity-75 cursor-pointer border-b border-default rounded-t"
            :class="{ 'active-docs': selectedComponent === 'BlogDocs' }"
            @click="setSelectedComp('BlogDocs')"
          >
            <h4>Blog posts</h4>
          </li>
        </ul>
      </nav>

      <sampleSelector :selected-component="selectedComponent" />
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
.active-docs {
  @apply border-accent;
  @apply border-b-2;
  @apply opacity-100;
}
</style>
