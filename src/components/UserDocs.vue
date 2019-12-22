<template>
  <div class="text-primary">
    <ul>
      <li v-for="doc in docs" :key="doc.id" class="w-full my-5">
        <SampleViewer :doc="docs[doc.id]" class="w-3/4" />
      </li>
    </ul>
  </div>
</template>

<script>
// @ is an alias to /src
import SampleViewer from "@/components/SampleViewer.vue";

export default {
  name: "userDocs",
  components: {
    SampleViewer
  },
  data() {
    return {
      docs: [
        {
          id: 0,
          title: "3M&#x2122; ChartScript.com </br> What's New in This Release",
          description: "This document is a high-level overview of changes in software that serves a variety of audiences: transcriptionists, system administrators, and primary care providers.",
          contribution: "I completely overhauled the structure of the document after inheriting it. The primary goal was to improve scannability and separate audience concerns.",
          pubFrequency: "Variable, usually 2 or 3 per year",
          image: require("../assets/images/CScom-WN-Oct-2018.png"),
          alt: "ChartScript.com What's New in this Release cover image of healthcare professionals.",
          link: "../assets/samples/dcn300_cscom_rel_october_2018.pdf"
        },
        {
          id: 1,
          title: "3M&#x2122; Enhanced Ambulatory Patient Grouping Systems </br> Methodology Overview",
          description: "This is a publically-available document that describes the Ehanced Ambulatory Patient Groups methodology. There's a brief history and a breakdown of the current methodology.",
          contribution: "I inherited this document, making structural changes and updating content as needed.",
          pubFrequency: "4 per year",
          image: require("../assets/images/EAPG-meth-overview-jan-2020.png"),
          alt: "EAPG Methodology Overview cover image of healthcare professionals.",
          link: "../assets/samples/dcn300_cscom_rel_october_2018.pdf"
        },
        {
          id: 2,
          title: "3M&#x2122; ChartScript.com Provider Client </br> What's New in This Release",
          description: "This document showcases changes in software for primary care providers. It highlights workflows and how provider workflows intersect with transcriptionists and QA staff.",
          contribution: "I created this document to inform primary care providers of changes in the Provider Client software.",
          pubFrequency: "Variable, usually 2 or 3 times per year",
          image: require("../assets/images/Provider-Client-WN-May-2019.png"),
          alt: "Provider Client What's New in this Release cover image of healthcare professionals.",
          link: "../assets/samples/provider_client_rel_may_2019.pdf"
        }
      ]
    };
  }
};
</script>
