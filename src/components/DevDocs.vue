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
  name: "devDocs",
  components: {
    SampleViewer
  },
  data() {
    return {
      docs: [
        {
          id: 0,
          title: "3M&#x2122; APCGP </br> What's New in This Release",
          description:
            "This document is a high-level overview of changes in software features and data structures. It serves as a central repository for all release-related information, linking to other documents that are often more detailed.",
          contribution:
            "I inherited the document, but worked with the development team to make substantial changes over time.",
          pubFrequency: "12 per year",
          image: require("../assets/images/mf-WN-v2019.1.3.png"),
          alt:
            "APCGP What's New in this Release cover image of healthcare professionals.",
          link: "/public/samples/grp072_apcgp_mf_rel_v2019.1.3.pdf"
        },
        {
          id: 1,
          title: "TRICARE OPPS Pricer </br> Software Manual",
          description:
            "This manual contains download, installation, interface, and reimbursement information for using the TRICARE Outpatient Prospective Payment System (OPPS) Pricer Software.",
          contribution:
            "I inherited the document, but worked with the development team to make substantial changes over time.",
          pubFrequency: "5 per year",
          image: require("../assets/images/opps-pricer-manual-v20.3.0.png"),
          alt:
            "TRICARE OPPS Pricer Software Manual cover image of healthcare professionals.",
          link: "/public/samples/pbl018_tri_opps_pricer_stdalone_v20.3.0.pdf"
        }
      ]
    };
  }
};
</script>
