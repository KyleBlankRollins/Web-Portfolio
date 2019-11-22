<template>
  <section class="web-projects">
    <div class="web-intro">
      <h2>Web projects page</h2>
      <p>Laboris selfies occaecat umami, forage Tumblr American Apparel. Retro Terry Richardson culpa id swag polaroid Intelligentsia American Apparel eu, esse non post-ironic fugiat master cleanse. Direct trade gluten-free blog, fanny pack cray labore skateboard before they sold out adipisicing non magna id Helvetica freegan.</p>
    </div>
    <div class="web-items">
      <ul class="w-full">
        <li
          v-for="project in projects"
          :key="project.id"
          :class="project.colors.bg"
          class="flex items-center justify-center my-6 overflow-x-hidden"
        >
          <div v-if="project.alternate" class="w-11/12 flex">
            <div class="w-1/3 p-6">
              <p>{{ project.description }}</p>
              <button :class="project.colors.accent" class="px-4 py-2 rounded">Visit</button>
            </div>
            <div class="w-2/3 skew" :class="project.colors.bgDark">
              <div class="skew-reset flex flex-col items-center">
                <h3>{{ project.name }}</h3>
                <div class="w-11/12">
                  <img :src="project.image" :alt="project.alt" class="rounded" />
                </div>
              </div>
            </div>
          </div>
          <div v-else class="w-11/12 flex">
            <div class="w-2/3 reverse-skew" :class="project.colors.bgDark">
              <div class="reverse-skew-reset flex flex-col items-center">
                <h3>{{ project.name }}</h3>
                <div class="w-11/12">
                  <img :src="project.image" :alt="project.alt" class="rounded" />
                </div>
              </div>
            </div>
            <div class="w-1/3 p-6">
              <p>{{ project.description }}</p>
              <button :class="project.colors.accent" class="px-4 py-2 rounded">Visit</button>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
// @ is an alias to /src

export default {
  name: "WebProjects",
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
          alternate: false
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
          alternate: true
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
          alternate: false
        }
      ]
    };
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
