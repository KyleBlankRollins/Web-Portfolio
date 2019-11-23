<template>
  <section class="web-projects">
    <div class="web-intro">
      <h2>Web projects page</h2>
      <p>Laboris selfies occaecat umami, forage Tumblr American Apparel. Retro Terry Richardson culpa id swag polaroid Intelligentsia American Apparel eu, esse non post-ironic fugiat master cleanse. Direct trade gluten-free blog, fanny pack cray labore skateboard before they sold out adipisicing non magna id Helvetica freegan.</p>
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
              <button :class="project.colors.accent" class="px-4 py-2 rounded">Visit</button>
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
                <h4> {{ feature.name }} </h4>
              </div>
              <div class="w-2/3">
                <p> {{ feature.description }} </p>
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
              <button :class="project.colors.accent" class="px-4 py-2 rounded">Visit</button>
            </div>
          </div>

          <transition name="slide">
            <div v-if="project.state.expand" class="mx-8 my-6">
              <ul class="m-0">
                <li v-for="feature in project.features" :key="feature.id" class="flex">
                  <div class="w-1/3">
                <h4> {{ feature.name }} </h4>
              </div>
              <div class="w-2/3">
                <p> {{ feature.description }} </p>
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
          name: "Doc Dashboard",
          tech: "---",
          link: "Not public",
          image: require("../assets/images/dd.png"),
          alt: "alt text",
          description:
            "Carles literally normcore, Williamsburg Echo Park fingerstache photo booth twee keffiyeh chambray whatever.",
          colors: {
            bg: "bg-orange-200",
            bgDark: "bg-orange-600",
            accent: "bg-red-600"
          },
          state: {
            alternate: false,
            expand: false
          },
          features: [
            {
              id: "101",
              name: "Google Analytics Reporting API",
              description:
                "Carles literally normcore, Williamsburg Echo Park fingerstache photo booth twee keffiyeh chambray whatever.",
              image: "",
              code: ""
            },
            {
              id: "103",
              name: "Analytics reports",
              description:
                "Carles literally normcore, Williamsburg Echo Park fingerstache photo booth twee keffiyeh chambray whatever.",
              image: "",
              code: ""
            },
            {
              id: "102",
              name: "Plotly.js charts",
              description:
                "Carles literally normcore, Williamsburg Echo Park fingerstache photo booth twee keffiyeh chambray whatever.",
              image: "",
              code: ""
            }
          ]
        },
        {
          id: "11",
          name: "Dok Compare",
          tech: "---",
          link: "DC/link/to/site.com",
          image: require("../assets/images/dok-compare.png"),
          alt: "alt text",
          description:
            "Scenester High Life Banksy, proident master cleanse tousled squid sriracha ad chillwave post-ironic retro.",
          colors: {
            bg: "bg-teal-200",
            bgDark: "bg-teal-600",
            accent: "bg-green-600"
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
                "Carles literally normcore, Williamsburg Echo Park fingerstache photo booth twee keffiyeh chambray whatever.",
              image: "",
              code: ""
            },
            {
              id: "113",
              name: "Dynamic value calculations",
              description:
                "Carles literally normcore, Williamsburg Echo Park fingerstache photo booth twee keffiyeh chambray whatever.",
              image: "",
              code: ""
            }
          ]
        },
        {
          id: "12",
          name: "The Canny Valley",
          tech: "---",
          link: "DC/link/to/site.com",
          image: require("../assets/images/the-canney-valley.png"),
          alt: "alt text",
          description:
            "Roof party put a bird on it incididunt sed umami craft beer cred.",
          colors: {
            bg: "bg-indigo-200",
            bgDark: "bg-indigo-600",
            accent: "bg-blue-600"
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
                "Carles literally normcore, Williamsburg Echo Park fingerstache photo booth twee keffiyeh chambray whatever.",
              image: "",
              code: ""
            },
            {
              id: "133",
              name: "Dynamic navigation",
              description:
                "Carles literally normcore, Williamsburg Echo Park fingerstache photo booth twee keffiyeh chambray whatever.",
              image: "",
              code: ""
            },
            {
              id: "132",
              name: "Responsive design",
              description:
                "Carles literally normcore, Williamsburg Echo Park fingerstache photo booth twee keffiyeh chambray whatever.",
              image: "",
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
  grid-template-columns: 0.2fr 1fr 0.2fr;
}

.web-intro {
  grid-area: content;
}

.web-items {
  grid-area: items;
}
</style>
