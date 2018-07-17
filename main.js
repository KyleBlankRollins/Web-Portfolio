//07/17: Looks like we have two sets of data for Gaalsien vs. Coalition. They're not updating properly, which leads to incorrect comparisons. May need to move back to global vairables.

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
        this.compareStats();
        console.log('Child mounted - galHull: ' + this.galHull + '. colHull: ' + this.colHull);
        console.log('Child mounted - galHullHigher: ' + this.galHullHigher + '. colHullHigher: ' + this.colHullHigher);
    },
    data: function(){
        return {
            colSpeed: 110,
            colArmor: 0,
            colDamage: 15,
            colRof: "Medium",
            colHull: 500,
            galSpeed: 130,
            galArmor: 0,
            galDamage: 15,
            galRof: "Medium",
            galHull: 650,
            galSpeedHigher: true,
            galArmorHigher: null,
            galDamageHigher: null,
            galRofHigher: null,
            galHullHigher: true,
            colSpeedHigher: false,
            colArmorHigher: null,
            colDamageHigher: null,
            colRofHigher: null,
            colHullHigher: false,
        }
    },
    methods: {
        syncColData: function() {
            this.colSpeed = this.speed;
            this.colArmor = this.armor;
            this.colDamage = this.damage;
            this.colRof = this.rof;
            this.colHull = this.hull;
            console.log("Col data updated from child syncGlobalData")
        },
        syncGalData: function() {
            this.galSpeed = this.speed;
            this.galArmor = this.armor;
            this.galDamage = this.damage;
            this.galRof = this.rof;
            this.galHull = this.hull;
            console.log("Gal data updated from child syncGlobalData")
        },
        compareStats: function() {
            if (this.colSpeed > this.galSpeed) {
                this.colSpeedHigher = true;
                this.galSpeedHigher = false;
            } else if (this.colSpeed < this.galSpeed) {
                this.colSpeedHigher = false;
                this.galSpeedHigher = true;
            } else if (this.colSpeed == this.galSpeed) {
                this.colSpeedHigher = null;
                this.galSpeedHigher = null;
            };

            if (this.colArmor > this.galArmor) {
                this.colArmorHigher = true;
                this.galArmorHigher = false;
            } else if (this.colArmor < this.galArmor) {
                this.colArmorHigher = false;
                this.galArmorHigher = true;
            } else if (this.colArmor == this.galArmor) {
                this.colArmorHigher = null;
                this.galArmorHigher = null;
            };

            if (this.colDamage > this.galDamage) {
                this.colDamageHigher = true;
                this.galDamageHigher = false;
            } else if (this.colDamage < this.galDamage) {
                this.colDamageHigher = false;
                this.galDamageHigher = true;
            } else if (this.colDamage == this.galDamage) {
                this.colDamageHigher = null;
                this.galDamageHigher = null;
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

            if (this.colHull > this.galHull) {
                this.colHullHigher = true;
                this.galHullHigher = false;
                console.log("colHull is higher");
            } else if (this.colHull < this.galHull) {
                this.colHullHigher = false;
                this.galHullHigher = true;
                console.log("galHull is higher");
            } else if (this.colHull == this.galHull) {
                this.colHullHigher = null;
                this.galHullHigher = null;
                console.log("hulls are equal");
            };
            console.log('Comparison ran - galHull: ' + this.galHull + '. colHull: ' + this.colHull);
            console.log('Comparison ran - galHullHigher: ' + this.galHullHigher + '. colHullHigher: ' + this.colHullHigher);
        }
    }
}

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
    },
    beforeUpdate: function() {
        console.log("App beforeUpdate.")
    },
    updated: function() {
        console.log("App updated.")
        // this.setHighers();
    },
    data: {
        // highers: {
        //     galSpeedHigher: true,
        //     galArmorHigher: null,
        //     galDamageHigher: null,
        //     galRofHigher: null,
        //     galHullHigher: true,
        //     colSpeedHigher: false,
        //     colArmorHigher: null,
        //     colDamageHigher: null,
        //     colRofHigher: null,
        //     colHullHigher: false,
        // },
        currentGalUnit: "Sandskimmer",
        currentColUnit: "LAV",
        showGalMenu: false,
        showGalTemplate: false,
        showColMenu: false,
        showColTemplate: false,
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
        'Sandskimmer': galSandskimmer,
        'SiegeCruiser': galSieCruiser,
        'AAV': colAAV,
        'ArtCruiser': colArtCruiser,
        'LAV': colLAV,
    },
    methods: {
        swapGalUnit: function(component) {
            if (this.currentGalUnit === component) {
                this.$refs.currentGalUnit = null;
                this.currentGalUnit = null;
            } else {
                this.$refs.currentGalUnit = component;
                this.currentGalUnit = component;
            }
        },
        swapColUnit: function(component) {
            if (this.currentColUnit === component) {
                this.$refs.currentColUnit = null;
                this.currentColUnit = null;
            } else {
                this.$refs.currentColUnit = component;
                this.currentColUnit = component;
            }
        },
        // setHighers: function() {
        //     galSpeedHigher = this.$refs.currentGalUnit.galSpeedHigher;
        //     galArmorHigher = this.$refs.currentGalUnit.galArmorHigher;
        //     galDamageHigher = this.$refs.currentGalUnit.galDamageHigher;
        //     galRofHigher = this.$refs.currentGalUnit.galRofHigher;
        //     galHullHigher = this.$refs.currentGalUnit.galHullHigher;
        //     colSpeedHigher = this.$refs.currentColUnit.colSpeedHigher;
        //     colArmorHigher = this.$refs.currentColUnit.colArmorHigher;
        //     colDamageHigher = this.$refs.currentColUnit.colDamageHigher;
        //     colRofHigher = this.$refs.currentColUnit.colRofHigher;
        //     colHullHigher = this.$refs.currentColUnit.colHullHigher;
        //     console.log("setHighers ran on App update")
        // },
    },
});
