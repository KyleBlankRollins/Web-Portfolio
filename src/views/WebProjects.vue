<template>
  <section class="web-projects bg-default mt-6">
    <div class="web-intro text-primary p-4">
      <div>
        <h2>Web projects</h2>
        <p>As a hobbyist web developer, I'm always looking for interesting things to do and learn. You'll find a number of my recent projects on this page.</p>
      </div>
      <nav>
        <ul class="flex flex-wrap justify-center">
          <li
            v-for="project in projects"
            :key="project.id"
            class="relative flex w-2/3 h-24 my-2 cursor-pointer border-b-4 border-primary opacity-50 hover:opacity-75 shadow-lg rounded"
            :class="{'active-project': selectedComponent === project.component}"
            @click="setSelectedComp(project.component)"
          >
            <div class="w-full bg-tertiary rounded relative">
              <img
                class="absolute h-full w-full inset-0 object-cover object-right rounded"
                :src="project.image"
                :alt="project.alt"
              />
            </div>
            <div
              class="opaque absolute w-full flex bottom-0 p-2 items-center justify-center"
            >
              <h3 class="m-0">{{ project.name }}</h3>
            </div>
          </li>
        </ul>
      </nav>
    </div>
    <div class="web-items">
      <ProjectSelector :selected-component="selectedComponent" />
    </div>
  </section>
</template>

<script>
// @ is an alias to /src
import ProjectSelector from "@/components/ProjectSelector.vue";

export default {
  name: "WebProjects",
  components: {
    ProjectSelector
  },
  data() {
    return {
      selectedComponent: "DefaultProject",
      projects: [
        {
          id: "10",
          component: "DocDashboard",
          name: "Doc Dashboard v2.0",
          image: require("../assets/images/sites/overview_dark.png"),
          alt: "Overview report for Doc Dashboard."
        },
        {
          id: "11",
          component: "DokCompare",
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
          component: "TheCanneyValley",
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
              alt:
                "The Recent Posts navigation updates based on new posts' dates.",
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
    setSelectedComp(name) {
      this.selectedComponent = name;
    }
  }
};
</script>

<style scoped>
.web-projects {
  display: grid;
  grid-template-areas:
    "lmargin  content  rmargin"
    "items    items    items";
  grid-template-columns: 1fr minmax(min-content, 900px) 1fr;
}

.web-intro {
  grid-area: content;
}

.web-items {
  grid-area: items;
}

.opaque {
  background: rgba(208, 167, 126, 0.9);
}

.active-project {
  @apply border-accent;
  @apply opacity-100;
}
</style>
