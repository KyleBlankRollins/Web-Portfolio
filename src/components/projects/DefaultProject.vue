<template>
  <div class="feature-grid h-48 text-primary">
    <div class="proj-description">
      <h3>Select a project above</h3>
      <p>
        Each project page contains information about its goals, how I built it,
        and lessons learned.
      </p>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "defaultProject"
};
</script>

<style scoped>
.feature-grid {
  display: grid;
  grid-template-areas: "lmargin  description  rmargin";
  grid-template-columns: 1fr minmax(min-content, 900px) 1fr;
}

.proj-description {
  grid-area: description;
}
</style>
