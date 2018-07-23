var pageHeader = Vue.component('page-header',{
    template: '#main-head',
});

var about = Vue.component('about',{
    template: '<div class="section    about" id="about"> <div class="about-title"><h3> {{ title }} </h3></div><div class="text-block    about-me-text"><p>I am a technical writer with experience in electronics reviews, marketing copy, technical documentation, and website/UI microcopy.</p><p>As a co-organizer for the <a href="https://www.meetup.com/Write-the-Docs-SLC/" target="_blank">Write the Docs SLC meetup</a>, I get to meet and learn from amazing people on a regular basis.</p><p class="note"><b>Note:</b> I built this site from scratch. If you have suggestions or notice a bug, submit an issue or pull request <a href="https://github.com/KyleBlankRollins/Web-Portfolio" target="_blank">on GitHub</a>.</p></div><div class="profile-pic" id="profile-pic"><img src="Images/kyle_02.jpg" alt="Kyle Rollins profile photo."></div></div>',
    data: function() {
        return {
            title: "About",
        }
    },
});

var samples = Vue.component('samples',{ // TODO: Get sample child components working. This sort of worked, but ran into scope issues: https://vuejs.org/v2/guide/components.html#Dynamic-Components
    template: '<div class="section" id="samples"> <div class="samples-title"><h3> {{ title }} </h3></div>',
    data: function() {
        return {
            title: "Samples",
        }
    },
});

var learningExperiences = Vue.component('learning-experiences',{
    template: '<div class="section" id="learning-experiences"> <div> <h3> {{ title }} </h3> </div> <div class="experiment-box-container"><div class="experiment-box"><a href="https://dok-compare.kyleblankrollins.com/"><img class="experiment-image" src="Images/DoK_compare.png" alt="DoK Compare image"/><div class="experiment-overlay"><div class="experiment-title">DoK Compare</div></a></div></div></div>', // TODO: Break this kup into data elements.
    data: function() {
        return {
            title: "Learning experiences",
        }
    },
});

var work = Vue.component('work',{
    template: '<div class="section" id="work"> <h3> {{ title }} </h3> </div>',
    data: function() {
        return {
            title: "Work",
        }
    },
});

var contact = Vue.component('contact',{
    template: '<div class="section" id="contact"> <h3> {{ title }} </h3> </div>',
    data: function() {
        return {
            title: "Contact",
        }
    },
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
    components: {
        'pageHeader': pageHeader,
        'about': about,
        'samples': samples,
        'learningExperiences': learningExperiences,
        'work': work,
        'contact': contact,
    },
});
