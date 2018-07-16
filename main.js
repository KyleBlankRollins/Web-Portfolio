//Global variables seem to be working. Now I need to add a couple of col components and get the comparison function working.


//Global variables
colSpeed = null;
colArmor = null;
colDamage = null;
colRof = null;
colHull = null;
galSpeed = null;
galArmor = null;
galDamage = null;
galRof = null;
galHull = null;
galSpeedHigher = true;
galArmorHigher = null;
galDamageHigher = null;
galRofHigher = null;
galHullHigher = true;
colSpeedHigher = false;
colArmorHigher = null;
colDamageHigher = null;
colRofHigher = null;
colHullHigher = false;

//Mixins
var updateGlobalData = {
    updated: function() {
        this.syncGalData();
        this.compareStats();
    },
    methods: {
        syncGalData: function() {
            galSpeed = this.speed;
            galArmor = this.armor;
            galDamage = this.damage;
            galRof = this.rof;
            galHull = this.hull;
            console.log("Gal data updated from syncGalData")
        },
        compareStats: function() {
            if (colSpeed > galSpeed) {
                colSpeedHigher = "true";
                galSpeedHigher = "false";
            } else if (colSpeed < galSpeed) {
                colSpeedHigher = "false";
                galSpeedHigher = "true";
            } else if (colSpeed === galSpeed) {
                colSpeedHigher = null;
                galSpeedHigher = null;
            }
        },
    }
}

var galSandskimmer = Vue.component('gal-sandskimmer',{
    template: '#gaalsien-unit-template',
    data: function () {
        return {
            galSpeedHigher: galSpeedHigher,
            galArmorHigher: galArmorHigher,
            galDamageHigher: galDamageHigher,
            galRofHigher: galRofHigher,
            galHullHigher: galHullHigher,
            title: "Sandskimmer",
            desc: "Light attack vehicle.",
            image: 'sandskimmer_gaalsien.jpg',
            speed: 130,
            armor: 0,
            damage: 15,
            rof: 'Medium',
            hull: 650,
            strong: 'Strikecraft, Railguns',
            weak: 'AAVs, Cruisers',
        }
    },
    mixins: [ updateGlobalData ]
});

var galSieCruiser = Vue.component('gal-siege-cruiser',{
    template: '#gaalsien-unit-template',
    data: function () {
        return {
            galSpeedHigher: galSpeedHigher,
            galArmorHigher: galArmorHigher,
            galDamageHigher: galDamageHigher,
            galRofHigher: galRofHigher,
            galHullHigher: galHullHigher,
            title: "Siege Cruiser",
            desc: "Lobs missiles at unsuspecting targets.",
            image: 'siegeCruiser_gaalsien.jpg',
            speed: 55,
            armor: 3,
            damage: 100,
            rof: 'Low',
            hull: 2500,
            strong: 'Ground',
            weak: 'Strikecraft, Railguns',
        }
    },
    mixins: [ updateGlobalData ]
});

//Main app
var vm = new Vue ({
    el: '#app',
    data: {
        currentGalUnit: "Sandskimmer",
        showGalMenu: false,
        showGalTemplate: false,
        galSpeedHigher: true,
        galArmorHigher: null,
        galDamageHigher: null,
        galRofHigher: null,
        galHullHigher: true,
        galComponentsArray: [ //// NOTE: This array populates the navigation menu. On click, it loads the relevant component.
            'Sandskimmer',
            'SiegeCruiser',
        ],
    },
    components: {
        'Sandskimmer': galSandskimmer,
        'SiegeCruiser': galSieCruiser,
    },
    methods: {
        swapGalUnit: function(component) {
            if (this.currentGalUnit === component) {
                this.currentGalUnit = null;
            } else {
                this.currentGalUnit = component;
            }
        },
    },
});
