<template>
  <div class="text-primary">
    <div class="relative h-48">
      <img
        src="@/assets/images/sites/the_canney_valley.png"
        alt="The home page of The Canney Valley."
        class="absolute h-full w-full inset-0 object-cover object-right"
      />
      <ul
        class="opaque absolute bottom-0 w-full flex items-center justify-center m-0 p-1"
      >
        <li
          v-for="(item, index) in tech"
          :key="index"
          class="bg-state-success m-1 text-utility-100 rounded"
        >
          <div>
            <p class="m-0 px-1">{{ item }}</p>
          </div>
        </li>
      </ul>
    </div>
    <div class="feature-grid">
      <div class="proj-description p-4">
        <div class="flex items-end mb-4">
          <h3 class="w-3/4">The Canney Valley</h3>
          <a v-if="link" :href="link" class="btn">
            <button class="w-full">Visit site</button>
          </a>
          <div v-else class="btn">Not publically available</div>
        </div>
        <p>
          The Canney Valley is where I publish technical tutorials and share my
          thoughts on life.
        </p>
        <p>
          It's built with Gridsome, which is a static site generator that uses
          GraphQL and Vue.js.
        </p>
      </div>
      <div class="proj-features">
        <ul class="m-0">
          <transition-group name="fade" tag="div">
            <li
              v-for="feature in features"
              :key="feature.id"
              class="w-full flex my-6"
            >
              <div class="w-1/3 items-center rounded-l">
                <div
                  class="feature w-full flex px-2 font-bold cursor-pointer items-center border-b-2 border-tertiary hover:bg-accent hover:text-utility-100 rounded-b"
                  @click="feature.expand = !feature.expand"
                >
                  <Toggle :expand="feature.expand" />
                  <p class="m-0">{{ feature.name }}</p>
                </div>
                <transition name="fade">
                  <div v-if="feature.expand" class="p-4">
                    <p>{{ feature.description }}</p>
                  </div>
                </transition>
              </div>
              <FeatureViewer :feature="feature" class="w-2/3 rounded-r" />
            </li>
          </transition-group>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import FeatureViewer from "@/components/FeatureViewer.vue";
import Toggle from "@/components/ui/Toggle.vue";

export default {
  name: "theCanneyValley",
  components: {
    FeatureViewer,
    Toggle
  },
  data() {
    return {
      id: "12",
      component: "TheCanneyValley",
      name: "The Canney Valley",
      tech: [
        "Vue.js",
        "Gridsome",
        "GraphQL",
        "Forestry.io CMS",
        "Tailwind CSS"
      ],
      link: "https://the-canney-valley.kyleblankrollins.com/",
      description:
        "Roof party put a bird on it incididunt sed umami craft beer cred.",
      colors: {
        bg: "bg-secondary",
        bgDark: "bg-default",
        accent: "bg-primary"
      },
      features: [
        {
          id: "131",
          name: "Gridsome GraphQL layer",
          expand: false,
          description:
            "The GraphQL data layer in Gridsome makes all sorts of interesting things possible. For example, creating lists of posts that share a tag or a series. And none of it requires a server - it's all done during the build process.",
          image: require("@/assets/images/sites/graphQL.png"),
          alt: "A list of blog posts created by the GraphQL data layer.",
          code: ""
        },
        {
          id: "132",
          name: "Dynamic navigation",
          expand: false,
          description:
            "The navigation throughout The Canney Valley updates based on the most recent posts.",
          image: require("@/assets/images/sites/dynamic_nav.png"),
          alt: "The Recent Posts navigation updates based on new posts' dates.",
          code: ""
        },
        {
          id: "133",
          name: "Responsive design",
          expand: false,
          description:
            "The Canney Valley is mobile-friendly and can be viewed comfortably at nearly all screen sizes.",
          image: require("@/assets/images/sites/tcv_responsive.png"),
          alt: "The Canney Valley as seen in a mobile layout.",
          code: ""
        }
      ]
    };
  }
};
</script>

<style scoped>
.feature-grid {
  display: grid;
  grid-template-areas:
    "lmargin  description  rmargin"
    "lmargin features features";
  grid-template-columns: 1fr minmax(min-content, 900px) 1fr;
}

.proj-features {
  grid-area: features;
}

.proj-description {
  grid-area: description;
}

.opaque {
  background: rgba(42, 55, 65, 0.75);
}
</style>
