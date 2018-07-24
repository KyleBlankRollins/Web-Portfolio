// Vue.component('about',{
//     template: '#about-template',
//     data: function() {
//         return {
//             title: "About",
//         }
//     },
// });
//
// Vue.component('samples',{ // TODO: Get sample child components working. This sort of worked, but ran into scope issues: https://vuejs.org/v2/guide/components.html#Dynamic-Components
//     template: '<section class="samples"><div class="samples-title"><h3> {{ title }} </h3></div></section>',
//     data: function() {
//         return {
//             title: "Samples",
//         }
//     },
// });
//
// Vue.component('learning-experiences',{
//     template: '#learning-experiences-template',
//     data: function() {
//         return {
//             title: "Learning experiences",
//             image: "DoK_compare.png",
//             experiments: [
//                 {id: 1, title: "DoK Compare", desc: "This web app compares unit stats from game Homeworld: Deserts of Kharak."}
//             ]
//         }
//     },
// });
//
// Vue.component('work-philosophy',{
//     template: '#work-phil-template',
//     data: function() {
//         return {
//             title: "Work philosophy",
//         }
//     },
// });
//
// Vue.component('work-history',{
//     template: '<section class="work-history"> <div class="work-history-title"><h3> {{ title }} </h3></div></section>',
//     data: function() {
//         return {
//             title: "Work history",
//         }
//     },
// });
//
// Vue.component('contact',{
//     template: '<section class="contact"><div class="contact-title"> <h3> {{ title }} </h3> </div></section>',
//     data: function() {
//         return {
//             title: "Contact",
//         }
//     },
// });

Vue.component('tabs', {
    template: `
        <div class="tab-row-container">
            <div>
              <ul class="tab-row">
                <li v-for="tab in tabs" :class="{ 'is-active': tab.isActive }">
                    <a :href="tab.href" @click="selectTab(tab)">{{ tab.name }}</a>
                </li>
              </ul>
            </div>

            <div class="tabs-details">
                <slot></slot>
            </div>
        </div>
    `,
    data() {
        return {tabs: [] };
    },
    created() {
        this.tabs = this.$children;
    },
    methods: {
        selectTab(selectedTab) {
            this.tabs.forEach(tab => {
                tab.isActive = (tab.name == selectedTab.name);
            });
        }
    }
});

Vue.component('tab', {
    template: `
        <div v-show="isActive">
            <slot></slot>
        </div>`,
    props: {
        name: { required: true },
        selected: { default: false}
    },
    data() {
        return {
            isActive: false
        };
    },
    computed: {
        href() {
            return '#' + this.name.toLowerCase().replace(/ /g, '-');
        }
    },
    mounted() {
        this.isActive = this.selected;
    }
});

var vm = new Vue({
    el: "#app",
    created: console.log("[][] App created."),
    data: {
        showMenu: false,
        siteSections: [
            { id: 1, title: "About", link: '#about' },
            { id: 2, title: "Samples", link: '#samples' },
            { id: 3, title: "Learning experiences", link: '#learning-experiences' },
            { id: 4, title: "Work", link: '#work' },
            { id: 5, title: "Contact", link: '#contact' },
        ],
        socialMedia: [
            { id: 1, title: "Twitter", link: 'https://twitter.com/KyleBRollins' },
            { id: 2, title: "LinkedIn", link: 'https://www.linkedin.com/in/kyle-blank-rollins/' },
            { id: 3, title: "GitHub", link: 'https://github.com/KyleBlankRollins' },
        ],
    },
});
