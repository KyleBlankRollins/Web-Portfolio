var vm = new Vue({
    el: "#app",
    data: {
        showMenu: false,
        siteSections: [
            { id: 1, title: "About" },
            { id: 2, title: "Samples" },
            { id: 3, title: "Learning experiences" },
            { id: 4, title: "Work" },
            { id: 5, title: "Contact" },
        ],
        socialMedia: [
            { id: 1, title: "Twitter", link: 'https://twitter.com/KyleBRollins' },
            { id: 2, title: "LinkedIn", link: 'https://www.linkedin.com/in/kyle-blank-rollins/' },
            { id: 3, title: "GitHub", link: 'https://github.com/KyleBlankRollins' },
        ],
    },
    created: console.log("[][] App created."),
});
