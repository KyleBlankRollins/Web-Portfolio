//Mixins
var updateGlobalData = {
    created: function() {
        console.log("Child created" );
        if (this.galFlag) {
            this.syncGalData();
        } else {
            this.syncColData();
        }
    },
    mounted: function() {
        console.log('Child mounted - galHull: ' + galUnitStats.galHull + '. colHull: ' + colUnitStats.colHull);
        if (this.galFlag) {
            this.syncGalData();
        } else {
            this.syncColData();
        }
    },
    methods: {
        syncColData: function() {
            colUnitStats.colSpeed = this.speed;
            colUnitStats.colArmor = this.armor;
            colUnitStats.colDamage = this.damage;
            colUnitStats.colRof = this.rof;
            colUnitStats.colHull = this.hull;
            colUnitStats.colStrong = this.strong;
            colUnitStats.colWeak = this.weak;
            console.log("Col data updated from child syncGlobalData")
        },
        syncGalData: function() {
            galUnitStats.galSpeed = this.speed;
            galUnitStats.galArmor = this.armor;
            galUnitStats.galDamage = this.damage;
            galUnitStats.galRof = this.rof;
            galUnitStats.galHull = this.hull;
            galUnitStats.galStrong = this.strong;
            galUnitStats.galWeak = this.weak;
            console.log("Gal data updated from child syncGlobalData")
        },
    }
}

//Unit stats component
var galUnitStats = Vue.component('unit-stats',{
    template: '#gaalsien-unit-stats',
    data: function () {
        return {
            galSpeed: 130,
            galArmor: 0,
            galDamage: 15,
            galRof: "Medium",
            galHull: 650,
            galStrong: 'Strikecraft, Railguns',
            galWeak: 'AAVs, Cruisers',
            galSpeedHigher: true,
            galArmorHigher: null,
            galDamageHigher: null,
            galRofHigher: null,
            galHullHigher: true,
        }
    },
});

var colUnitStats = Vue.component('unit-stats',{
    template: '#coalition-unit-stats',
    data: function () {
        return {
            colSpeed: 110,
            colArmor: 0,
            colDamage: 15,
            colRof: "Medium",
            colHull: 500,
            colStrong: 'Strikecraft, Railguns',
            colWeak: 'AAVs, Cruisers',
            colSpeedHigher: false,
            colArmorHigher: null,
            colDamageHigher: null,
            colRofHigher: null,
            colHullHigher: false,
        }
    },
});

//Gaalsien unit components
var galSandskimmer = Vue.component('gal-sandskimmer',{
    template: '#gaalsien-unit-template',
    data: function () {
        return {
            galFlag: true,
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
            galFlag: true,
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

//Coalition unit components
var colAAV = Vue.component('col-aav',{
    template: '#coalition-unit-template',
    data: function () {
        return {
            galFlag: false,
            title: "AAV",
            desc: "Armored assault vehicle.",
            image: 'AAV_coalition.jpg',
            speed: 80,
            armor: 8,
            damage: 11,
            rof: 'Very high',
            hull: 1400,
            strong: 'Strikecraft',
            weak: 'Railguns, Cruisers',
        }
    },
    mixins: [ updateGlobalData ]
});

var colArtCruiser = Vue.component('col-artillery-cruiser',{
    template: '#coalition-unit-template',
    data: function () {
        return {
            galFlag: false,
            title: "Artillery Cruiser",
            desc: "Smashes things with missles.",
            image: 'artilleryCruiser_coalition.jpg',
            speed: 50,
            armor: 5,
            damage: 100,
            rof: 'Low',
            hull: 2500,
            strong: 'Ground',
            weak: 'Strikecraft, Railguns',
        }
    },
    mixins: [ updateGlobalData ]
});

var colLAV = Vue.component('col-lav',{
    template: '#coalition-unit-template',
    data: function () {
        return {
            galFlag: false,
            title: "LAV",
            desc: "Light attack vehicle.",
            image: 'LAV_coalition.jpg',
            speed: 110,
            armor: 0,
            damage: 15,
            rof: 'Medium',
            hull: 500,
            strong: 'Strikecraft, Railguns',
            weak: 'AAVs, Cruisers',
        }
    },
    mixins: [ updateGlobalData ]
});

//Main app
var vm = new Vue ({
    el: '#app',
    created: console.log("App created."),
    mounted: function() {
        console.log("App mounted.")
        this.compareStats()
    },
    beforeUpdate: function() {
        console.log("App beforeUpdate.")
    },
    updated: function() {
        console.log("App updated.")
    },
    data: {
        currentGalUnit: "Sandskimmer",
        currentColUnit: "LAV",
        galUnitStats: "galUnitStats",
        colUnitStats: "colUnitStats",
        showGalMenu: false,
        showGalTemplate: false,
        showColMenu: false,
        showColTemplate: false,
        showUnitStats: false,
        galComponentsArray: [ //// NOTE: This array populates the navigation menu. On click, it loads the relevant component.
            'Sandskimmer',
            'SiegeCruiser',
        ],
        colComponentsArray: [ //// NOTE: This array populates the navigation menu. On click, it loads the relevant component.
            'AAV',
            'ArtCruiser',
            'LAV',
        ],
    },
    components: {
        'galUnitStats': galUnitStats,
        'colUnitStats': colUnitStats,
        'Sandskimmer': galSandskimmer,
        'SiegeCruiser': galSieCruiser,
        'AAV': colAAV,
        'ArtCruiser': colArtCruiser,
        'LAV': colLAV,
    },
    methods: {
        swapGalUnit: function(component) {
            if (this.currentGalUnit === component) {
                this.currentGalUnit = null;
            } else {
                this.currentGalUnit = component;
            }
        },
        swapColUnit: function(component) {
            if (this.currentColUnit === component) {
                this.currentColUnit = null;
            } else {
                this.currentColUnit = component;
            }
        },
        compareStats: function() {
            if (colUnitStats.colSpeed > galUnitStats.galSpeed) {
                colUnitStats.colSpeedHigher = true;
                galUnitStats.galSpeedHigher = false;
            } else if (colUnitStats.colSpeed < galUnitStats.galSpeed) {
                colUnitStats.colSpeedHigher = false;
                galUnitStats.galSpeedHigher = true;
            } else if (colUnitStats.colSpeed == galUnitStats.galSpeed) {
                colUnitStats.colSpeedHigher = null;
                galUnitStats.galSpeedHigher = null;
            };

            if (colUnitStats.colArmor > galUnitStats.galArmor) {
                colUnitStats.colArmorHigher = true;
                galUnitStats.galArmorHigher = false;
            } else if (colUnitStats.colArmor < galUnitStats.galArmor) {
                colUnitStats.colArmorHigher = false;
                galUnitStats.galArmorHigher = true;
            } else if (colUnitStats.colArmor == galUnitStats.galArmor) {
                colUnitStats.colArmorHigher = null;
                galUnitStats.galArmorHigher = null;
            };

            if (colUnitStats.colDamage > galUnitStats.galDamage) {
                colUnitStats.colDamageHigher = true;
                galUnitStats.galDamageHigher = false;
            } else if (colUnitStats.colDamage < galUnitStats.galDamage) {
                colUnitStats.colDamageHigher = false;
                galUnitStats.galDamageHigher = true;
            } else if (colUnitStats.colDamage == galUnitStats.galDamage) {
                colUnitStats.colDamageHigher = null;
                galUnitStats.galDamageHigher = null;
            };

            //Enable after figuring out how to compare text values.
            // if (colRof > galRof) {
            //     colRofHigher = true;
            //     galRofHigher = false;
            // } else if (colRof < galRof) {
            //     colRofHigher = false;
            //     galRofHigher = true;
            // } else if (colRof === galRof) {
            //     colRofHigher = null;
            //     galRofHigher = null;
            // }

            if (colUnitStats.colHull > galUnitStats.galHull) {
                colUnitStats.colHullHigher = true;
                galUnitStats.galHullHigher = false;
                console.log("colHull is higher");
            } else if (colUnitStats.colHull < galUnitStats.galHull) {
                colUnitStats.colHullHigher = false;
                galUnitStats.galHullHigher = true;
                console.log("galHull is higher");
            } else if (colUnitStats.colHull == galUnitStats.galHull) {
                colUnitStats.colHullHigher = null;
                galUnitStats.galHullHigher = null;
                console.log("hulls are equal");
            };
            console.log('Comparison ran - galHull: ' + galUnitStats.galHull + '. colHull: ' + colUnitStats.colHull);
            console.log('Comparison ran - galHullHigher: ' + galUnitStats.galHullHigher + '. colHullHigher: ' + colUnitStats.colHullHigher);
        }
    },
});
