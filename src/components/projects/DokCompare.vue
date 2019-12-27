<template>
  <div class="text-primary">
    <div class="relative h-48">
      <img
        src="@/assets/images/sites/dok-compare.png"
        alt="Home page for the DoK Compare website."
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
            <p class="m-0 px-1 text-xs md:text-base">{{ item }}</p>
          </div>
        </li>
      </ul>
    </div>
    <div class="max-w-text-plus">
      <div class="p-2 md:p-4">
        <div class="md:flex md:items-center mb-4">
          <h3 class="md:w-3/4 mb-4">DoK Compare</h3>
          <div v-if="link" class="md:w-1/4 flex justify-end">
            <a :href="link" class="btn">
              <button class="w-full">Visit</button>
            </a>
          </div>
          <div v-else class="md:w-1/4 flex justify-end">
            <div class="btn">Not public</div>
          </div>
        </div>
        <p>
          DoK Compare is based on the realt-time strategy game Homeworld:
          Deserts of Kharak. It allows users to view unit statistics
          side-by-side.
        </p>
        <p>
          The statistics comparison update dynamically as new units are
          selected.
        </p>
      </div>
      <div>
        <ul class="m-0">
          <transition-group name="fade" tag="div">
            <li
              v-for="feature in features"
              :key="feature.id"
              class="w-full md:flex my-6"
            >
              <div class="md:w-1/3 items-center rounded-l">
                <div
                  class="feature w-full flex px-2 font-bold cursor-pointer items-center border-b-2 border-tertiary hover:bg-accent hover:text-utility-100"
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

              <FeatureViewer :feature="feature" class="md:w-2/3 rounded-r" />
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
  name: "dokCompare",
  components: {
    FeatureViewer,
    Toggle
  },
  data() {
    return {
      name: "Dok Compare",
      tech: ["Vue.js", "Vuex", "Tailwind CSS"],
      link: "https://dok-compare.kyleblankrollins.com/#/",
      colors: {
        bg: "bg-primary",
        bgDark: "bg-secondary",
        accent: "bg-default"
      },
      features: [
        {
          id: "111",
          name: "Unit statitics",
          expand: false,
          description:
            "Every unit in Homeworld: Deserts of Kharak has a stats sheet. DoK Compare makes it easy to visualize those stats and see how different units stack up against each other.",
          image: require("@/assets/images/sites/stats.png"),
          alt:
            "A Battle Cruiser unit with its associated stats displayed in a table.",
          code: ""
        },
        {
          id: "112",
          name: "Dynamic value calculations",
          expand: false,
          description:
            "DoK Compare automatically calculates the difference in stat values, then indicates whether each units' stats are higher, lower, or equal.",
          image: require("@/assets/images/sites/comparison.png"),
          alt:
            "Two statistics tables side-by-side that show which stats are higher or lower.",
          code: ""
        },
        {
          id: "113",
          name: "Responsive design",
          expand: false,
          description:
            "While small screens aren't ideal for comparing datasets, DoK Compare can shrink to a single-column view that maintains a usable format.",
          image: require("@/assets/images/sites/responsive.png"),
          alt:
            "An Honorguard Cruiser that has been dynamically resized to fit the display width.",
          code: ""
        }
      ]
    };
  }
};
</script>

<style scoped>
.opaque {
  background: rgba(42, 55, 65, 0.75);
}
</style>
