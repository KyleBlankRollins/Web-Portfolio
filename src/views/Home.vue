<template>
  <div class="flex">
    <CoalitionUnitViewer class="w-5/12" />
    <span class="w-2/12"></span>
    <GaalsienUnitViewer class="w-5/12" />
  </div>
</template>

<script>
// @ is an alias to /src
import CoalitionUnitViewer from "@/components/CoalitionUnitViewer.vue";
import GaalsienUnitViewer from "@/components/GaalsienUnitViewer.vue";

export default {
  name: "Home",
  components: {
    CoalitionUnitViewer,
    GaalsienUnitViewer
  }
};
</script>
