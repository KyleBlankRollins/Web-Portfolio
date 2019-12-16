<template>
  <section class="samples h-full bg-default mt-6">
    <div class="sample-intro p-4">
      <section class="bg-primary-soft text-primary rounded">
        <div class="px-4 py-2">
          <h2>Samples page</h2>
          <p>Laboris selfies occaecat umami, forage Tumblr American Apparel. Retro Terry Richardson culpa id swag polaroid Intelligentsia American Apparel eu, esse non post-ironic fugiat master cleanse. Direct trade gluten-free blog, fanny pack cray labore skateboard before they sold out adipisicing non magna id Helvetica freegan.</p>
        </div>
      </section>
    </div>
    <div class="sample-items">
      <nav>
        <ul class="flex">
          <li
            class="flex-1 flex items-center bg-primary text-default hover:bg-primary-soft hover:text-primary cursor-pointer"
            @click="setSelectedComp('UserDocs')"
          >
            <h4>User docs</h4>
          </li>
          <li
            class="flex-1 flex items-center bg-secondary text-default hover:bg-primary-soft hover:text-primary cursor-pointer"
            @click="setSelectedComp('DevDocs')"
          >
            <h4>Dev docs</h4>
          </li>
          <li
            class="flex-1 flex items-center bg-tertiary text-default hover:bg-primary-soft hover:text-primary cursor-pointer"
            @click="setSelectedComp('BlogDocs')"
          >
            <h4>Blog docs</h4>
          </li>
        </ul>
      </nav>

      <sampleSelector :selected-component="selectedComponent" />

      <!-- <ul class="flex justify-center my-6">
        <li v-for="sample in samples" :key="sample.id" class="w-1/3 mx-4 max-w-xs rounded">
          <div class="border border-primary hidden md:block md:relative  shadow-lg rounded-t">
            <img :src="sample.image" :alt="sample.alt" class="object-cover object-center rounded-t" />
          </div>
          <div class="border border-primary bg-primary shadow-lg rounded-b">
            <h3 class="mx-2 leading-tight">{{ sample.name }}</h3>
            <p class="p-2">{{ sample.description }}</p>
            <a :href="sample.link">
              <button class="btn">View sample</button>
            </a>
          </div>
        </li>
      </ul>-->
    </div>
  </section>
</template>

<script>
// @ is an alias to /src
import sampleSelector from "@/components/SampleSelector.vue";

export default {
  name: "samples",
  components: {
    sampleSelector
  },
  data() {
    return {
      selectedComponent: "UserDocs",
      samples: [
        {
          id: "00",
          name: "Chi Tester User Guide",
          type: "PDF",
          link: "../assets/samples/Chi_Tester_User_Guide.pdf",
          image: require("../assets/images/Chi_Tester_User_Guide.svg"),
          alt: "alt text",
          description:
            "Carles literally normcore, Williamsburg Echo Park fingerstache photo booth twee keffiyeh chambray whatever."
        },
        {
          id: "01",
          name: "Gimo Games Style Guide",
          type: "PDF",
          link: "../assets/samples/Gimo_Games_Style_Guide.pdf",
          image: require("../assets/images/Gimo_Games_Style_Guide.svg"),
          alt: "alt text",
          description:
            "Scenester High Life Banksy, proident master cleanse tousled squid sriracha ad chillwave post-ironic retro."
        },
        {
          id: "02",
          name: "Shepherd Union Building Manager Handbook",
          type: "PDF",
          link:
            "../assets/samples/Shepherd_Union_Building_Manager_Handbook.pdf",
          image: require("../assets/images/Shepherd_Union_Building_Manager_Handbook.svg"),
          alt: "alt text",
          description:
            "Roof party put a bird on it incididunt sed umami craft beer cred."
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
.samples {
  display: grid;
  grid-template-areas:
    "lmargin content rmargin"
    "items   items   items";
  grid-template-columns: 1fr minmax(min-content, 900px) 1fr;
}

.sample-intro {
  grid-area: content;
}

.sample-items {
  grid-area: items;
}
</style>
