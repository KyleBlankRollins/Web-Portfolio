<template>
  <section class="samples">
    <div class="sample-intro">
      <h2>Samples page</h2>
      <p>Laboris selfies occaecat umami, forage Tumblr American Apparel. Retro Terry Richardson culpa id swag polaroid Intelligentsia American Apparel eu, esse non post-ironic fugiat master cleanse. Direct trade gluten-free blog, fanny pack cray labore skateboard before they sold out adipisicing non magna id Helvetica freegan.</p>
    </div>
    <div class="sample-items">
      <ul class="flex justify-center my-6">
        <li v-for="sample in samples" :key="sample.id" class="mx-4 max-w-xs">
          <div class="border shadow-lg">
            <img :src="sample.image" :alt="sample.alt" />
          </div>
          <div class="border shadow-lg">
            <h3 class="mx-2 leading-tight"> {{ sample.name }} </h3>
            <p class="p-2">{{ sample.description }}</p>
            <a :href="sample.link">
              <button class="w-full p-2 border">View sample</button>
            </a>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
// @ is an alias to /src

export default {
  name: "samples",
  data() {
    return {
      samples: [
        {
          id: "00",
          name: "Chi Tester User Guide",
          type: "PDF",
          link: "../assets/samples/Chi_Tester_User_Guide.pdf",
          image: require("../assets/images/Chi_Tester_User_Guide.svg"),
          alt: "alt text",
          description: "Carles literally normcore, Williamsburg Echo Park fingerstache photo booth twee keffiyeh chambray whatever."
        },
        {
          id: "01",
          name: "Gimo Games Style Guide",
          type: "PDF",
          link: "../assets/samples/Gimo_Games_Style_Guide.pdf",
          image: require("../assets/images/Gimo_Games_Style_Guide.svg"),
          alt: "alt text",
          description: "Scenester High Life Banksy, proident master cleanse tousled squid sriracha ad chillwave post-ironic retro."
        },
        {
          id: "02",
          name: "Shepherd Union Building Manager Handbook",
          type: "PDF",
          link: "../assets/samples/Shepherd_Union_Building_Manager_Handbook.pdf",
          image: require("../assets/images/Shepherd_Union_Building_Manager_Handbook.svg"),
          alt: "alt text",
          description: "Roof party put a bird on it incididunt sed umami craft beer cred."
        }
      ]
    };
  }
};
</script>

<style scoped>
  .samples {
    display: grid;
    grid-template-areas: 
    "lmargin content rmargin"
    "items   items   items"
    ;
    grid-template-columns: 0.2fr 1fr 0.2fr;
  }

  .sample-intro {
    grid-area: content;
  }

  .sample-items {
    grid-area: items;
  }

</style>
