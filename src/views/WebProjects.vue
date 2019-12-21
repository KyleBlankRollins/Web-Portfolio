<template>
  <section class="web-projects h-full bg-default mt-6">
    <div class="web-intro text-primary p-4">
      <h2>Web projects</h2>
      <p>As a hobbyist web developer, I'm always looking for interesting things to do and learn. You'll find a number of my recent projects on this page.</p>
    </div>
    <div class="web-items">
      <div
        v-for="project in projects"
        :key="project.id"
        :class="project.colors.bg"
        class="flex items-center justify-center my-6 overflow-x-hidden"
      >
        <div v-if="project.state.alternate">
          <div class="flex">
            <div class="w-1/3 p-6">
              <p>{{ project.description }}</p>
              <button :class="project.colors.accent" class="btn">Visit</button>
            </div>
            <div class="w-2/3 skew pb-2 flex flex-col items-center" :class="project.colors.bgDark">
              <div class="skew-reset">
                <h3>{{ project.name }}</h3>
                <div class="w-11/12">
                  <img :src="project.image" :alt="project.alt" class="rounded" />
                </div>
                <div class="w-11/12 flex flex-col justify-center items-center">
                  <h4>See more</h4>
                  <Toggle
                    :expand="project.state.expand"
                    :class="project.colors.accent"
                    @toggled="handleToggle($event, project.id)"
                  />
                </div>
              </div>
            </div>
          </div>

          <transition name="slide">
            <div v-if="project.state.expand" class="mx-8 my-6">
              <ul class="m-0">
                <li v-for="feature in project.features" :key="feature.id" class="flex">
                  <div class="w-1/3">
                    <h4>{{ feature.name }}</h4>
                    <img :src="feature.image" :alt="feature.alt" class="rounded" />
                  </div>
                  <div class="w-2/3">
                    <p>{{ feature.description }}</p>
                  </div>
                </li>
              </ul>
            </div>
          </transition>
        </div>

        <div v-else>
          <div class="flex">
            <div class="w-2/3 reverse-skew pb-2" :class="project.colors.bgDark">
              <div class="reverse-skew-reset flex flex-col items-center">
                <h3>{{ project.name }}</h3>
                <div class="w-11/12">
                  <img :src="project.image" :alt="project.alt" class="rounded" />
                </div>
                <div class="w-11/12 flex flex-col justify-center items-center">
                  <h4>See more</h4>
                  <Toggle
                    :expand="project.state.expand"
                    :class="project.colors.accent"
                    @toggled="handleToggle($event, project.id)"
                  />
                </div>
              </div>
            </div>
            <div class="w-1/3 p-6">
              <p>{{ project.description }}</p>
              <button :class="project.colors.accent" class="btn">Visit</button>
            </div>
          </div>

          <transition name="slide">
            <div v-if="project.state.expand" class="mx-8 my-6">
              <ul class="m-0">
                <li v-for="feature in project.features" :key="feature.id" class="flex">
                  <div class="w-1/3">
                    <h4>{{ feature.name }}</h4>
                    <img :src="feature.image" :alt="feature.alt" class="rounded" />
                  </div>
                  <div class="w-2/3">
                    <p>{{ feature.description }}</p>
                  </div>
                </li>
              </ul>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
// @ is an alias to /src
import Toggle from "@/components/ui/toggle.vue";

export default {
  name: "WebProjects",
  components: {
    Toggle
  },
  data() {
    return {
      projects: [
        {
          id: "10",
          name: "Doc Dashboard v2.0",
          tech: [
            "Vue.js",
            "Vuex",
            "Vue Router",
            "Google Analytics Reporting API v4",
            "Plotly.js",
            "Tailwind CSS"
          ],
          link: "Not public",
          image: require("../assets/images/sites/overview_dark.png"),
          alt: "Overview report for Doc Dashboard",
          description: [
            "Doc Dashboard v2.0 is a complete re-build of the first version. I completely re-worked the data structures to be innately flexible and exandable.",
            "The original version only collated and analyzed Google Analytics data for 3M Health Information Systems' online help. v2.0 serves as more of a hub, adding information from PDF documents and support content."
          ],
          colors: {
            bg: "bg-secondary",
            bgDark: "bg-default",
            accent: "bg-primary"
          },
          state: {
            alternate: false,
            expand: false
          },
          features: [
            {
              id: "101",
              name: "Metrics and internal sharing",
              description:
                "In comparison to Google Analytics itself, Doc Dashboard is quite easy to use. More importantly, it's extremely easy to share within the company. Just copy a report's URL and send it interested stakeholders.",
              image: require("../assets/images/sites/reports.gif"),
              alt: "Short gif of the report feature.",
              code: ""
            },
            {
              id: "103",
              name: "Analytics reports",
              description:
                "Doc Dashboard has many reports that focus on specific data - and actions users can take based on that data. Each report processes the Google Analytics data independently to ensure it's reliable and usable.",
              image: require("../assets/images/sites/source_light.png"),
              alt: "The source report, shown with the light theme active.",
              code: ""
            },
            {
              id: "102",
              name: "Plotly.js charts",
              description:
                "Several types of charts visually present the report data. These charts are most often intentionally simple. The goal is to show concrete, actionable information.",
              image: require("../assets/images/sites/charts.gif"),
              alt: "Short gif of the charts feature.",
              code: ""
            }
          ]
        },
        {
          id: "11",
          name: "Dok Compare",
          tech: ["Vue.js", "Vuex", "Tailwind CSS"],
          link: "https://dok-compare.kyleblankrollins.com/#/",
          image: require("../assets/images/sites/dok-compare.png"),
          alt: "Home page for the DoK Compare website.",
          description: [
            "DoK Compare is based on the realt-time strategy game Homeworld: Deserts of Kharak. It allows users to view unit statistics side-by-side.",
            "The statistics comparison update dynamically as new units are selected."
          ],
          colors: {
            bg: "bg-primary",
            bgDark: "bg-secondary",
            accent: "bg-default"
          },
          state: {
            alternate: true,
            expand: false
          },
          features: [
            {
              id: "111",
              name: "Unit statitics",
              description:
                "Every unit in Homeworld: Deserts of Kharak has a stats sheet. DoK Compare makes it easy to visualize those stats and see how different units stack up against each other.",
              image: require("../assets/images/sites/stats.png"),
              alt:
                "A Battle Cruiser unit with its associated stats displayed in a table.",
              code: ""
            },
            {
              id: "112",
              name: "Dynamic value calculations",
              description:
                "Carles literally normcore, Williamsburg Echo Park fingerstache photo booth twee keffiyeh chambray whatever.",
              image: require("../assets/images/sites/comparison.png"),
              alt:
                "Two statistics tables side-by-side that show which stats are higher or lower.",
              code: ""
            },
            {
              id: "113",
              name: "Responsive design",
              description:
                "Carles literally normcore, Williamsburg Echo Park fingerstache photo booth twee keffiyeh chambray whatever.",
              image: require("../assets/images/sites/responsive.png"),
              alt:
                "An Honorguard Cruiser that has been dynamically resized to fit the display width.",
              code: ""
            }
          ]
        },
        {
          id: "12",
          name: "The Canny Valley",
          tech: [
            "Vue.js",
            "Gridsome",
            "GraphQL",
            "Forestry.io CMS",
            "Tailwind CSS"
          ],
          link: "https://the-canney-valley.kyleblankrollins.com/",
          image: require("../assets/images/sites/the_canney_valley.png"),
          alt: "The home page of The Canney Valley.",
          description:
            "Roof party put a bird on it incididunt sed umami craft beer cred.",
          colors: {
            bg: "bg-secondary",
            bgDark: "bg-default",
            accent: "bg-primary"
          },
          state: {
            alternate: false,
            expand: false
          },
          features: [
            {
              id: "131",
              name: "Gridsome GraphQL layer",
              description:
                "The GraphQL data layer in Gridsome makes all sorts of interesting things possible. For example, creating lists of posts that share a tag or a series. And none of it requires a server - it's all done during the build process.",
              image: require("../assets/images/sites/graphQL.png"),
              alt: "A list of blog posts created by the GraphQL data layer.",
              code: ""
            },
            {
              id: "132",
              name: "Dynamic navigation",
              description:
                "The navigation throughout The Canney Valley updates based on the most recent posts.",
              image: require("../assets/images/sites/dynamic_nav.png"),
              alt: "The Recent Posts navigation updates based on new posts' dates.",
              code: ""
            },
            {
              id: "133",
              name: "Responsive design",
              description:
                "The Canney Valley is mobile-friendly and can be viewed comfortably at nearly all screen sizes.",
              image: require("../assets/images/sites/tcv_responsive.png"),
              alt: "The Canney Valley as seen in a mobile layout.",
              code: ""
            }
          ]
        }
      ]
    };
  },
  methods: {
    handleToggle(value, id) {
      let clickedProject = this.projects.filter(project => project.id === id);

      clickedProject[0].state.expand = value;
    }
  }
};
</script>

<style scoped>
.web-projects {
  display: grid;
  grid-template-areas:
    "lmargin content rmargin"
    "items   items   items";
  grid-template-columns: 1fr minmax(min-content, 900px) 1fr;
}

.web-intro {
  grid-area: content;
}

.web-items {
  grid-area: items;
}
</style>
