<template>
  <div class="home">
    <CoalitionUnitViewer />
    <GaalsienUnitViewer />
  </div>
</template>

<script>
// @ is an alias to /src
import CoalitionUnitViewer from "@/components/CoalitionUnitViewer.vue";
import GaalsienUnitViewer from "@/components/GaalsienUnitViewer.vue";

export default {
  name: "home",
  components: {
    CoalitionUnitViewer,
    GaalsienUnitViewer
  }
};
</script>
