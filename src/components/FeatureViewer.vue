<template>
  <div>
    <div>
      <img :src="feature.image" :alt="feature.alt"/>
    </div>
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