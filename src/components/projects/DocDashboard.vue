<template>
  <div class="text-primary">
    <div class="relative h-48">
      <img
        src="@/assets/images/sites/overview_dark.png"
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
            <p class="m-0 px-1">{{ item }}</p>
          </div>
        </li>
      </ul>
    </div>
    <div class="feature-grid">
      <div class="proj-description p-4">
        <div class="flex items-end mb-4">
          <h3 class="w-3/4">Doc Dashboard v2.0</h3>
          <a v-if="link" :href="link" class="btn">
            <button class="w-full">Visit site</button>
          </a>
          <div v-else class="btn">Not public</div>
        </div>
        <p>
          Doc Dashboard v2.0 is a complete re-build of the first version. I
          completely re-worked the data structures to be innately flexible and
          exandable.
        </p>
        <p>
          The original version only collated and analyzed Google Analytics data
          for 3M Health Information Systems' online help. v2.0 serves as more of
          a hub, adding information from PDF documents and support content.
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
  name: "docDashboard",
  components: {
    FeatureViewer,
    Toggle
  },
  data() {
    return {
      name: "Doc Dashboard v2.0",
      tech: [
        "Vue.js",
        "Vuex",
        "Vue Router",
        "Google Analytics Reporting API v4",
        "Plotly.js",
        "Tailwind CSS"
      ],
      link: "",
      colors: {
        bg: "bg-secondary",
        bgDark: "bg-default",
        accent: "bg-primary"
      },
      features: [
        {
          id: "101",
          expand: false,
          name: "Metrics and internal sharing",
          description:
            "In comparison to Google Analytics itself, Doc Dashboard is quite easy to use. More importantly, it's extremely easy to share within the company. Just copy a report's URL and send it interested stakeholders.",
          image: require("@/assets/images/sites/reports.gif"),
          alt: "Short gif of the report feature.",
          code: ""
        },
        {
          id: "103",
          expand: false,
          name: "Analytics reports",
          description:
            "Doc Dashboard has many reports that focus on specific data - and actions users can take based on that data. Each report processes the Google Analytics data independently to ensure it's reliable and usable.",
          image: require("@/assets/images/sites/source_light.png"),
          alt: "The source report, shown with the light theme active.",
          code: ""
        },
        {
          id: "102",
          expand: false,
          name: "Plotly.js charts",
          description:
            "Several types of charts visually present the report data. These charts are most often intentionally simple. The goal is to show concrete, actionable information.",
          image: require("@/assets/images/sites/charts.gif"),
          alt: "Short gif of the charts feature.",
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
