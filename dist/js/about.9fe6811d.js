(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["about"],{"004e":function(e,t,s){"use strict";s.r(t);var a=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("section",{staticClass:"mt-6"},[e._m(0),s("div",[s("nav",{staticClass:"w-full bg-default text-primary sticky top-0 shadow-lg z-50"},[s("ul",{staticClass:"md:hidden flex m-0"},[s("li",{staticClass:"flex-1 flex items-center justify-center cursor-pointer border-b border-default",class:{"active-docs":"UserDocs"===e.selectedComponent},on:{click:function(t){return e.setSelectedComp("UserDocs")}}},[s("p",{staticClass:"m-0"},[e._v("User")])]),s("li",{staticClass:"flex-1 flex items-center justify-center cursor-pointer border-b border-default",class:{"active-docs":"DevDocs"===e.selectedComponent},on:{click:function(t){return e.setSelectedComp("DevDocs")}}},[s("p",{staticClass:"m-0"},[e._v("Dev")])]),s("li",{staticClass:"flex-1 flex items-center justify-center cursor-pointer border-b border-default",class:{"active-docs":"BlogDocs"===e.selectedComponent},on:{click:function(t){return e.setSelectedComp("BlogDocs")}}},[s("p",{staticClass:"m-0"},[e._v("Blog")])])])]),s("nav",{staticClass:"w-full bg-default text-primary sticky top-0 shadow-lg z-50"},[s("ul",{staticClass:"hidden md:block md:h-16 md:flex md:m-0"},[s("li",{staticClass:"flex-1 flex items-center justify-center opacity-50 hover:bg-tertiary hover:opacity-75 cursor-pointer border-b border-default rounded-t",class:{"active-docs":"UserDocs"===e.selectedComponent},on:{click:function(t){return e.setSelectedComp("UserDocs")}}},[s("h4",[e._v("User docs")])]),s("li",{staticClass:"flex-1 flex items-center justify-center opacity-50 hover:bg-tertiary hover:opacity-75 cursor-pointer border-b border-default rounded-t",class:{"active-docs":"DevDocs"===e.selectedComponent},on:{click:function(t){return e.setSelectedComp("DevDocs")}}},[s("h4",[e._v("Dev docs")])]),s("li",{staticClass:"flex-1 flex items-center justify-center opacity-50 hover:bg-tertiary hover:opacity-75 cursor-pointer border-b border-default rounded-t",class:{"active-docs":"BlogDocs"===e.selectedComponent},on:{click:function(t){return e.setSelectedComp("BlogDocs")}}},[s("h4",[e._v("Blog posts")])])])]),s("sampleSelector",{attrs:{"selected-component":e.selectedComponent}})],1)])},i=[function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"max-w-text text-primary px-2 md:px-6 pb-6"},[s("h2",[e._v("Writing samples")]),s("p",[e._v(" Most of my writing is covered under NDAs and not publically shareable. However, you can find several documents below. ")]),s("p",[e._v(" If you're curious about these documents or my other work, contact me through "),s("a",{staticClass:"link",attrs:{href:"https://www.linkedin.com/in/kyle-blank-rollins/"}},[e._v("LinkedIn")]),e._v(" or "),s("a",{staticClass:"link",attrs:{href:"https://twitter.com/KyleBRollins"}},[e._v("Twitter")]),e._v(". ")])])}],n=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"p-2 md:p-4"},[s("transition",{attrs:{name:"slide-left",mode:"out-in"}},[s(e.currentComponent,{tag:"component"})],1)],1)},o=[],r=function(){var e=this,t=e.$createElement;e._self._c;return e._m(0)},l=[function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",[s("h2",[e._v("Error. Something went wrong.")])])}],c={name:"failState"},d=c,u=s("2877"),m=Object(u["a"])(d,r,l,!1,null,null,null),p=m.exports,f=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"text-primary"},[s("ul",e._l(e.docs,(function(t){return s("li",{key:t.id,staticClass:"w-full my-5"},[s("SampleViewer",{staticClass:"w-3/4",attrs:{doc:e.docs[t.id]}})],1)})),0)])},h=[],v=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"w-full max-w-text-plus md:flex md:items-center rounded"},[s("div",{staticClass:"relative md:w-1/4 rounded"},[s("img",{staticClass:"rounded shadow-xl",attrs:{src:e.doc.image,alt:e.doc.alt}}),s("div",{staticClass:"md:hidden w-full absolute bg-accent bottom-0 rounded-b"},[s("a",{attrs:{href:e.doc.link}},[s("button",{staticClass:"w-full"},[e._v("View")])])])]),s("div",{staticClass:"hidden md:block md:w-3/4 mx-4 border-l border-primary rounded-l"},[s("div",{staticClass:"m-2"},[s("div",{staticClass:"flex items-center"},[s("h3",{staticClass:"w-3/4 mb-6",domProps:{innerHTML:e._s(e.doc.title)}}),s("div",{staticClass:"w-1/4 flex justify-end"},[s("a",{staticClass:"btn",attrs:{href:e.doc.link}},[s("button",{staticClass:"w-full"},[e._v("View doc")])])])]),s("p",[e._v(e._s(e.doc.description))]),s("p",[e._v(e._s(e.doc.contribution))]),s("div",{staticClass:"flex items-baseline"},[s("p",[e._v("Publication frequency:")]),s("p",[e._v(e._s(e.doc.pubFrequency))])])])])])},b=[],y={name:"sampleViewer",props:{doc:Object}},g=y,C=(s("6c46"),Object(u["a"])(g,v,b,!1,null,"50f40428",null)),w=C.exports,x={name:"userDocs",components:{SampleViewer:w},data:function(){return{docs:[{id:0,title:"3M&#x2122; ChartScript.com </br> What's New in This Release",description:"This document is a high-level overview of changes in software that serves a variety of audiences: transcriptionists, system administrators, and primary care providers.",contribution:"I completely overhauled the structure of the document after inheriting it. The primary goal was to improve scannability and separate audience concerns.",pubFrequency:"Variable, usually 2 or 3 per year",image:s("a7b8"),alt:"ChartScript.com What's New in this Release cover image of healthcare professionals.",link:"/public/samples/dcn300_cscom_rel_october_2018.pdf"},{id:1,title:"3M&#x2122; Enhanced Ambulatory Patient Grouping Systems </br> Methodology Overview",description:"This is a publically-available document that describes the Ehanced Ambulatory Patient Groups methodology. There's a brief history and a breakdown of the current methodology.",contribution:"I inherited this document, making structural changes and updating content as needed.",pubFrequency:"4 per year",image:s("8dfc"),alt:"EAPG Methodology Overview cover image of healthcare professionals.",link:"/public/samples/dcn300_cscom_rel_october_2018.pdf"},{id:2,title:"3M&#x2122; ChartScript.com Provider Client </br> What's New in This Release",description:"This document showcases changes in software for primary care providers. It highlights workflows and how provider workflows intersect with transcriptionists and QA staff.",contribution:"I created this document to inform primary care providers of changes in the Provider Client software.",pubFrequency:"Variable, usually 2 or 3 times per year",image:s("dcc3"),alt:"Provider Client What's New in this Release cover image of healthcare professionals.",link:"/public/samples/provider_client_rel_may_2019.pdf"}]}}},_=x,k=Object(u["a"])(_,f,h,!1,null,null,null),D=k.exports,j=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"text-primary"},[s("ul",e._l(e.docs,(function(t){return s("li",{key:t.id,staticClass:"w-full my-5"},[s("SampleViewer",{staticClass:"w-3/4",attrs:{doc:e.docs[t.id]}})],1)})),0)])},S=[],T={name:"devDocs",components:{SampleViewer:w},data:function(){return{docs:[{id:0,title:"3M&#x2122; APCGP </br> What's New in This Release",description:"This document is a high-level overview of changes in software features and data structures. It serves as a central repository for all release-related information, linking to other documents that are often more detailed.",contribution:"I inherited the document, but worked with the development team to make substantial changes over time.",pubFrequency:"12 per year",image:s("a523"),alt:"APCGP What's New in this Release cover image of healthcare professionals.",link:"/public/samples/grp072_apcgp_mf_rel_v2019.1.3.pdf"},{id:1,title:"TRICARE OPPS Pricer </br> Software Manual",description:"This manual contains download, installation, interface, and reimbursement information for using the TRICARE Outpatient Prospective Payment System (OPPS) Pricer Software.",contribution:"I inherited the document, but worked with the development team to make substantial changes over time.",pubFrequency:"5 per year",image:s("f481"),alt:"TRICARE OPPS Pricer Software Manual cover image of healthcare professionals.",link:"/public/samples/pbl018_tri_opps_pricer_stdalone_v20.3.0.pdf"}]}}},V=T,P=Object(u["a"])(V,j,S,!1,null,null,null),E=P.exports,O=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"text-primary"},[s("ul",{staticClass:"md:hidden"},e._l(e.docs,(function(t){return s("li",{key:t.id,staticClass:"w-full mb-5"},[s("div",{staticClass:"w-full"},[s("div",{staticClass:"m-2 border-b border-primary"},[s("h3",{staticClass:"mb-6"},[e._v(e._s(t.title))]),s("p",[e._v(e._s(t.description))]),s("a",{staticClass:"btn mb-6",attrs:{href:t.link}},[s("button",{staticClass:"w-full"},[e._v("Read more")])])])])])})),0),s("ul",{staticClass:"hidden md:block"},e._l(e.docs,(function(t){return s("li",{key:t.id,staticClass:"w-full my-5"},[s("div",{staticClass:"w-full flex justify-center rounded"},[s("div",{staticClass:"w-3/4 mx-4 border-l border-primary rounded-l"},[s("div",{staticClass:"m-2"},[s("div",{staticClass:"flex items-center"},[s("h3",{staticClass:"w-3/4 mb-6"},[e._v(e._s(t.title))]),s("div",{staticClass:"w-1/4 flex justify-end"},[s("a",{staticClass:"btn",attrs:{href:t.link}},[s("button",{staticClass:"w-full"},[e._v("Read more")])])])]),s("p",[e._v(e._s(t.description))])])])])])})),0)])},A=[],M={name:"blogDocs",data:function(){return{docs:[{id:0,title:"Technical Writer to Scrum Master: Skills",description:"For technical writers looking to change their career trajectories, Scrum Master roles can be a great fit. Many technical writing skills directly overlap with the Scrum Master skillset or are excellent supplemental skills...",link:"https://the-canney-valley.kyleblankrollins.com/posts/technical-writer-to-scrum-master-skills"},{id:1,title:"Creating a web development environment with VirtualBox",description:"Web devlopment can get messy. With so many modules and tools, it's easy to bloat your operating system with applications and files that might conflict with each other. That's why you should use virtual machines...",link:"https://the-canney-valley.kyleblankrollins.com/posts/creating-a-web-development-environment-with-virtualbox"},{id:2,title:"Installing VirtualBox Guest Additions for your VM",description:"Once you have a VirtualBox VM with Ubuntu installed, it's time to add VirtualBox's Guest Additions functionality. This gives you a bunch of useful features like better input integration and a shared clipboard for copy and pasting from your host machine into your virtual machine...",link:"https://the-canney-valley.kyleblankrollins.com/posts/installing-virtualbox-guest-additions-for-your-vm"}]}}},I=M,R=Object(u["a"])(I,O,A,!1,null,null,null),G=R.exports,$={name:"sampleSelector",props:{selectedComponent:String},components:{UserDocs:D,DevDocs:E,BlogDocs:G,FailState:p},computed:{currentComponent:function(){return this.selectedComponent?"UserDocs"===this.selectedComponent?D:"DevDocs"===this.selectedComponent?E:"BlogDocs"===this.selectedComponent?G:p:p}}},F=$,B=Object(u["a"])(F,n,o,!1,null,null,null),W=B.exports,q={name:"samples",components:{sampleSelector:W},data:function(){return{selectedComponent:"UserDocs"}},methods:{setSelectedComp:function(e){this.selectedComponent=e}}},N=q,U=(s("cbd0"),Object(u["a"])(N,a,i,!1,null,"ba306c72",null));t["default"]=U.exports},1338:function(e,t,s){e.exports=s.p+"img/charts.476240c7.gif"},"152e":function(e,t,s){e.exports=s.p+"img/comparison.fe4706f4.png"},1796:function(e,t,s){e.exports=s.p+"img/overview_dark.3796d240.png"},"209d":function(e,t,s){e.exports=s.p+"img/tcv_responsive.7bda9e7e.png"},"26c3":function(e,t,s){"use strict";var a=s("55a2"),i=s.n(a);i.a},3238:function(e,t,s){e.exports=s.p+"img/stats.26ed08c2.png"},"36b4":function(e,t,s){},"3d2b":function(e,t,s){},"492b":function(e,t,s){"use strict";var a=s("f671"),i=s.n(a);i.a},5469:function(e,t,s){},"55a2":function(e,t,s){},"610a":function(e,t,s){e.exports=s.p+"img/responsive.5bcb8ba0.png"},"6c46":function(e,t,s){"use strict";var a=s("3d2b"),i=s.n(a);i.a},"84b0":function(e,t,s){"use strict";s.r(t);var a=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("section",{staticClass:"mt-6"},[e._m(0),s("nav",{staticClass:"w-full bg-default text-primary sticky top-0 shadow-lg z-50"},[s("ul",{staticClass:"md:h-16 md:flex md:justify-center m-0"},e._l(e.projects,(function(t){return s("li",{key:t.id,staticClass:"flex w-full cursor-pointer border-b border-default opacity-50 hover:bg-tertiary hover:opacity-75 rounded-t",class:{"active-project":e.selectedComponent===t.component},on:{click:function(s){return e.setSelectedComp(t.component)}}},[s("div",{staticClass:"w-full flex bottom-0 items-center justify-center"},[s("p",{staticClass:"m-0"},[e._v(e._s(t.name))])])])})),0)]),s("div",{staticClass:"pt-4 my-5"},[s("ProjectSelector",{attrs:{"selected-component":e.selectedComponent}})],1)])},i=[function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"max-w-text text-primary px-2 md:px-6"},[s("h2",[e._v("Web projects")]),s("p",[e._v(" As a hobbyist web developer, I'm always looking for interesting things to do and learn. You'll find a number of my recent projects on this page. ")])])}],n=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",[s("transition",{attrs:{name:"slide-left",mode:"out-in"}},[s(e.currentComponent,{tag:"component"})],1)],1)},o=[],r=function(){var e=this,t=e.$createElement;e._self._c;return e._m(0)},l=[function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"h-48 text-primary"},[s("div",[s("h3",[e._v("Select a project above")]),s("p",[e._v(" Each project page contains information about its goals, how I built it, and lessons learned. ")])])])}],c={name:"defaultProject"},d=c,u=s("2877"),m=Object(u["a"])(d,r,l,!1,null,null,null),p=m.exports,f=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"text-primary"},[a("div",{staticClass:"relative h-48"},[a("img",{staticClass:"absolute h-full w-full inset-0 object-cover object-right",attrs:{src:s("1796"),alt:"Home page for the DoK Compare website."}}),a("ul",{staticClass:"opaque absolute bottom-0 w-full flex items-center justify-center m-0 p-1"},e._l(e.tech,(function(t,s){return a("li",{key:s,staticClass:"bg-state-success m-1 text-utility-100 rounded"},[a("div",[a("p",{staticClass:"m-0 px-1 text-xs md:text-base"},[e._v(e._s(t))])])])})),0)]),a("div",{staticClass:"max-w-text-plus"},[a("div",{staticClass:"p-2 md:p-4"},[a("div",{staticClass:"md:flex md:items-center mb-4"},[a("h3",{staticClass:"md:w-3/4 mb-4"},[e._v("Doc Dashboard v2.0")]),e.link?a("a",{staticClass:"btn",attrs:{href:e.link}},[a("button",{staticClass:"md:w-1/4 flex justify-end"},[e._v("Visit")])]):a("div",{staticClass:"md:w-1/4 flex justify-end"},[a("div",{staticClass:"btn"},[e._v("Not public")])])]),a("p",[e._v(" Doc Dashboard v2.0 is a complete re-build of the first version. I completely re-worked the data structures to be innately flexible and exandable. ")]),a("p",[e._v(" The original version only collated and analyzed Google Analytics data for 3M Health Information Systems' online help. v2.0 serves as more of a hub, adding information from PDF documents and support content. ")])]),a("div",[a("ul",{staticClass:"m-0"},[a("transition-group",{attrs:{name:"fade",tag:"div"}},e._l(e.features,(function(t){return a("li",{key:t.id,staticClass:"w-full md:flex my-6"},[a("div",{staticClass:"md:w-1/3 items-center rounded-l"},[a("div",{staticClass:"feature w-full flex px-2 font-bold cursor-pointer items-center border-b-2 border-tertiary hover:bg-accent hover:text-utility-100",on:{click:function(e){t.expand=!t.expand}}},[a("Toggle",{attrs:{expand:t.expand}}),a("p",{staticClass:"m-0"},[e._v(e._s(t.name))])],1),a("transition",{attrs:{name:"fade"}},[t.expand?a("div",{staticClass:"p-4"},[a("p",[e._v(e._s(t.description))])]):e._e()])],1),a("FeatureViewer",{staticClass:"md:w-2/3 rounded-r",attrs:{feature:t}})],1)})),0)],1)])])])},h=[],v=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"px-4"},[s("transition",{attrs:{name:"fade"}},[e.feature.expand?s("div",[s("img",{staticClass:"rounded shadow-lg",attrs:{src:e.feature.image,alt:e.feature.alt}})]):e._e()])],1)},b=[],y={name:"featureViewer",props:{feature:Object}},g=y,C=Object(u["a"])(g,v,b,!1,null,null,null),w=C.exports,x=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("button",{staticClass:"p-2",on:{click:function(t){return e.toggleExpand(!e.expand)}}},[s("div",{staticClass:"toggle-plus",class:{rotate:e.expand}},[s("svg",{staticClass:"fill-current",staticStyle:{"fill-rule":"evenodd","clip-rule":"evenodd","stroke-linejoin":"round","stroke-miterlimit":"2"},attrs:{width:"20",height:"20",viewBox:"0 0 40 40",version:"1.1",xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink","xml:space":"preserve","xmlns:serif":"http://www.serif.com/"}},[s("g",[s("path",{attrs:{d:"M22.75,1.375c0,-0.759 -0.616,-1.375 -1.375,-1.375l-2.75,0c-0.759,0 -1.375,0.616 -1.375,1.375l0,37.25c0,0.759 0.616,1.375 1.375,1.375l2.75,0c0.759,0 1.375,-0.616 1.375,-1.375l0,-37.25Z"}}),s("path",{attrs:{d:"M1.375,17.25c-0.759,0 -1.375,0.616 -1.375,1.375l0,2.75c0,0.759 0.616,1.375 1.375,1.375l37.25,0c0.759,0 1.375,-0.616 1.375,-1.375l0,-2.75c0,-0.759 -0.616,-1.375 -1.375,-1.375l-37.25,0Z"}})])])])])},_=[],k={name:"Toggle",props:{expand:Boolean},methods:{toggleExpand:function(e){this.$emit("toggled",e)}}},D=k,j=Object(u["a"])(D,x,_,!1,null,null,null),S=j.exports,T={name:"docDashboard",components:{FeatureViewer:w,Toggle:S},data:function(){return{name:"Doc Dashboard v2.0",tech:["Vue.js","Vuex","Vue Router","Google Analytics Reporting API v4","Plotly.js","Tailwind CSS"],link:"",colors:{bg:"bg-secondary",bgDark:"bg-default",accent:"bg-primary"},features:[{id:"101",expand:!1,name:"Metrics and internal sharing",description:"In comparison to Google Analytics itself, Doc Dashboard is quite easy to use. More importantly, it's extremely easy to share within the company. Just copy a report's URL and send it interested stakeholders.",image:s("be7d"),alt:"Short gif of the report feature.",code:""},{id:"103",expand:!1,name:"Analytics reports",description:"Doc Dashboard has many reports that focus on specific data - and actions users can take based on that data. Each report processes the Google Analytics data independently to ensure it's reliable and usable.",image:s("ffd9"),alt:"The source report, shown with the light theme active.",code:""},{id:"102",expand:!1,name:"Plotly.js charts",description:"Several types of charts visually present the report data. These charts are most often intentionally simple. The goal is to show concrete, actionable information.",image:s("1338"),alt:"Short gif of the charts feature.",code:""}]}}},V=T,P=(s("fff3"),Object(u["a"])(V,f,h,!1,null,"0626b157",null)),E=P.exports,O=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"text-primary"},[a("div",{staticClass:"relative h-48"},[a("img",{staticClass:"absolute h-full w-full inset-0 object-cover object-right",attrs:{src:s("d802"),alt:"Home page for the DoK Compare website."}}),a("ul",{staticClass:"opaque absolute bottom-0 w-full flex items-center justify-center m-0 p-1"},e._l(e.tech,(function(t,s){return a("li",{key:s,staticClass:"bg-state-success m-1 text-utility-100 rounded"},[a("div",[a("p",{staticClass:"m-0 px-1 text-xs md:text-base"},[e._v(e._s(t))])])])})),0)]),a("div",{staticClass:"max-w-text-plus"},[a("div",{staticClass:"p-2 md:p-4"},[a("div",{staticClass:"md:flex md:items-center mb-4"},[a("h3",{staticClass:"md:w-3/4 mb-4"},[e._v("DoK Compare")]),e.link?a("div",{staticClass:"md:w-1/4 flex justify-end"},[a("a",{staticClass:"btn",attrs:{href:e.link}},[a("button",{staticClass:"w-full"},[e._v("Visit")])])]):a("div",{staticClass:"md:w-1/4 flex justify-end"},[a("div",{staticClass:"btn"},[e._v("Not public")])])]),a("p",[e._v(" DoK Compare is based on the realt-time strategy game Homeworld: Deserts of Kharak. It allows users to view unit statistics side-by-side. ")]),a("p",[e._v(" The statistics comparison update dynamically as new units are selected. ")])]),a("div",[a("ul",{staticClass:"m-0"},[a("transition-group",{attrs:{name:"fade",tag:"div"}},e._l(e.features,(function(t){return a("li",{key:t.id,staticClass:"w-full md:flex my-6"},[a("div",{staticClass:"md:w-1/3 items-center rounded-l"},[a("div",{staticClass:"feature w-full flex px-2 font-bold cursor-pointer items-center border-b-2 border-tertiary hover:bg-accent hover:text-utility-100",on:{click:function(e){t.expand=!t.expand}}},[a("Toggle",{attrs:{expand:t.expand}}),a("p",{staticClass:"m-0"},[e._v(e._s(t.name))])],1),a("transition",{attrs:{name:"fade"}},[t.expand?a("div",{staticClass:"p-4"},[a("p",[e._v(e._s(t.description))])]):e._e()])],1),a("FeatureViewer",{staticClass:"md:w-2/3 rounded-r",attrs:{feature:t}})],1)})),0)],1)])])])},A=[],M={name:"dokCompare",components:{FeatureViewer:w,Toggle:S},data:function(){return{name:"Dok Compare",tech:["Vue.js","Vuex","Tailwind CSS"],link:"https://dok-compare.kyleblankrollins.com/#/",colors:{bg:"bg-primary",bgDark:"bg-secondary",accent:"bg-default"},features:[{id:"111",name:"Unit statitics",expand:!1,description:"Every unit in Homeworld: Deserts of Kharak has a stats sheet. DoK Compare makes it easy to visualize those stats and see how different units stack up against each other.",image:s("3238"),alt:"A Battle Cruiser unit with its associated stats displayed in a table.",code:""},{id:"112",name:"Dynamic value calculations",expand:!1,description:"DoK Compare automatically calculates the difference in stat values, then indicates whether each units' stats are higher, lower, or equal.",image:s("152e"),alt:"Two statistics tables side-by-side that show which stats are higher or lower.",code:""},{id:"113",name:"Responsive design",expand:!1,description:"While small screens aren't ideal for comparing datasets, DoK Compare can shrink to a single-column view that maintains a usable format.",image:s("610a"),alt:"An Honorguard Cruiser that has been dynamically resized to fit the display width.",code:""}]}}},I=M,R=(s("26c3"),Object(u["a"])(I,O,A,!1,null,"28e47d82",null)),G=R.exports,$=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"text-primary"},[a("div",{staticClass:"relative h-48"},[a("img",{staticClass:"absolute h-full w-full inset-0 object-cover object-right",attrs:{src:s("c373"),alt:"The home page of The Canney Valley."}}),a("ul",{staticClass:"opaque absolute bottom-0 w-full flex items-center justify-center m-0 p-1"},e._l(e.tech,(function(t,s){return a("li",{key:s,staticClass:"bg-state-success m-1 text-utility-100 rounded"},[a("div",[a("p",{staticClass:"m-0 px-1 text-xs md:text-base"},[e._v(e._s(t))])])])})),0)]),a("div",{staticClass:"max-w-text-plus"},[a("div",{staticClass:"p-2 md:p-4"},[a("div",{staticClass:"md:flex md:items-center mb-4"},[a("h3",{staticClass:"md:w-3/4 mb-4"},[e._v("The Canney Valley")]),e.link?a("div",{staticClass:"md:w-1/4 flex justify-end"},[a("a",{staticClass:"btn",attrs:{href:e.link}},[a("button",{staticClass:"w-full"},[e._v("Visit")])])]):a("div",{staticClass:"md:w-1/4 flex justify-end"},[a("div",{staticClass:"btn"},[e._v("Not public")])])]),a("p",[e._v(" The Canney Valley is where I publish technical tutorials and share my thoughts on life. ")]),a("p",[e._v(" It's built with Gridsome, which is a static site generator that uses GraphQL and Vue.js. ")])]),a("div",[a("ul",{staticClass:"m-0"},[a("transition-group",{attrs:{name:"fade",tag:"div"}},e._l(e.features,(function(t){return a("li",{key:t.id,staticClass:"w-full md:flex my-6"},[a("div",{staticClass:"md:w-1/3 items-center rounded-l"},[a("div",{staticClass:"feature w-full flex px-2 font-bold cursor-pointer items-center border-b-2 border-tertiary hover:bg-accent hover:text-utility-100",on:{click:function(e){t.expand=!t.expand}}},[a("Toggle",{attrs:{expand:t.expand}}),a("p",{staticClass:"m-0"},[e._v(e._s(t.name))])],1),a("transition",{attrs:{name:"fade"}},[t.expand?a("div",{staticClass:"p-4"},[a("p",[e._v(e._s(t.description))])]):e._e()])],1),a("FeatureViewer",{staticClass:"md:w-2/3 rounded-r",attrs:{feature:t}})],1)})),0)],1)])])])},F=[],B={name:"theCanneyValley",components:{FeatureViewer:w,Toggle:S},data:function(){return{id:"12",component:"TheCanneyValley",name:"The Canney Valley",tech:["Vue.js","Gridsome","GraphQL","Forestry.io CMS","Tailwind CSS"],link:"https://the-canney-valley.kyleblankrollins.com/",description:"Roof party put a bird on it incididunt sed umami craft beer cred.",colors:{bg:"bg-secondary",bgDark:"bg-default",accent:"bg-primary"},features:[{id:"131",name:"Gridsome GraphQL layer",expand:!1,description:"The GraphQL data layer in Gridsome makes all sorts of interesting things possible. For example, creating lists of posts that share a tag or a series. And none of it requires a server - it's all done during the build process.",image:s("e23a"),alt:"A list of blog posts created by the GraphQL data layer.",code:""},{id:"132",name:"Dynamic navigation",expand:!1,description:"The navigation throughout The Canney Valley updates based on the most recent posts.",image:s("d3b4"),alt:"The Recent Posts navigation updates based on new posts' dates.",code:""},{id:"133",name:"Responsive design",expand:!1,description:"The Canney Valley is mobile-friendly and can be viewed comfortably at nearly all screen sizes.",image:s("209d"),alt:"The Canney Valley as seen in a mobile layout.",code:""}]}}},W=B,q=(s("492b"),Object(u["a"])(W,$,F,!1,null,"850b243c",null)),N=q.exports,U={name:"projectSelector",props:{selectedComponent:String},components:{DefaultProject:p,DocDashboard:E,DokCompare:G,TheCanneyValley:N},computed:{currentComponent:function(){return this.selectedComponent?"DocDashboard"===this.selectedComponent?E:"DokCompare"===this.selectedComponent?G:"TheCanneyValley"===this.selectedComponent?N:p:p}}},K=U,H=Object(u["a"])(K,n,o,!1,null,null,null),L=H.exports,z={name:"WebProjects",components:{ProjectSelector:L},data:function(){return{selectedComponent:"DocDashboard",projects:[{id:"10",component:"DocDashboard",name:"Doc Dashboard v2.0",image:s("1796"),alt:"Overview report for Doc Dashboard."},{id:"11",component:"DokCompare",name:"Dok Compare",image:s("d802"),alt:"Home page for the DoK Compare website."},{id:"12",component:"TheCanneyValley",name:"The Canney Valley",image:s("c373"),alt:"The home page of The Canney Valley."}]}},methods:{setSelectedComp:function(e){this.selectedComponent=e}}},Q=z,J=(s("dc1d"),Object(u["a"])(Q,a,i,!1,null,"021e54ea",null));t["default"]=J.exports},"8dfc":function(e,t,s){e.exports=s.p+"img/EAPG-meth-overview-jan-2020.dfe3c506.png"},a523:function(e,t,s){e.exports=s.p+"img/mf-WN-v2019.1.3.22594664.png"},a7b8:function(e,t,s){e.exports=s.p+"img/CScom-WN-Oct-2018.63d03986.png"},b62f:function(e,t,s){},be7d:function(e,t,s){e.exports=s.p+"img/reports.083cfe7b.gif"},c373:function(e,t,s){e.exports=s.p+"img/the_canney_valley.2d890923.png"},cbd0:function(e,t,s){"use strict";var a=s("5469"),i=s.n(a);i.a},d3b4:function(e,t,s){e.exports=s.p+"img/dynamic_nav.05494014.png"},d802:function(e,t,s){e.exports=s.p+"img/dok-compare.d5425814.png"},dc1d:function(e,t,s){"use strict";var a=s("b62f"),i=s.n(a);i.a},dcc3:function(e,t,s){e.exports=s.p+"img/Provider-Client-WN-May-2019.3b8baa7e.png"},e23a:function(e,t,s){e.exports=s.p+"img/graphQL.7aa325e7.png"},f481:function(e,t,s){e.exports=s.p+"img/opps-pricer-manual-v20.3.0.5130a34b.png"},f671:function(e,t,s){},ffd9:function(e,t,s){e.exports=s.p+"img/source_light.36d2855e.png"},fff3:function(e,t,s){"use strict";var a=s("36b4"),i=s.n(a);i.a}}]);
//# sourceMappingURL=about.9fe6811d.js.map