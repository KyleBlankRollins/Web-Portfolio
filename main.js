//Custom global functions as mixins
var parentData = {
    updated: function() {
        this.syncData();
    },
    data: function() {
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
            colSpeedHigher: false,
            colArmorHigher: null,
            colDamageHigher: null,
            colRofHigher: null,
            colHullHigher: false,
            galSpeedHigher: true,
            galArmorHigher: null,
            galDamageHigher: null,
            galRofHigher: null,
            galHullHigher: true,
        }
    },
    methods: {
        syncData: function() {
            this.colSpeed = this.$parent.unitData.colSpeed;
            this.colArmor = this.$parent.unitData.colArmor;
            this.colDamage = this.$parent.unitData.colDamage;
            this.colRof = this.$parent.unitData.colRof;
            this.colHull = this.$parent.unitData.colHull;
            this.galSpeed = this.$parent.unitData.galSpeed;
            this.galArmor = this.$parent.unitData.galArmor;
            this.galDamage = this.$parent.unitData.galDamage;
            this.galRof = this.$parent.unitData.galRof;
            this.galHull = this.$parent.unitData.galHull;
            this.colSpeedHigher = this.$parent.displayData.colSpeedHigher;
            this.colArmorHigher = this.$parent.displayData.colArmorHigher;
            this.colDamageHigher = this.$parent.displayData.colDamageHigher;
            this.colRofHigher = this.$parent.displayData.colRofHigher;
            this.colHullHigher = this.$parent.displayData.colHullHigher;
            this.galSpeedHigher = this.$parent.displayData.galSpeedHigher;
            this.galArmorHigher = this.$parent.displayData.galArmorHigher;
            this.galDamageHigher = this.$parent.displayData.galDamageHigher;
            this.galRofHigher = this.$parent.displayData.galRofHigher;
            this.galHullHigher = this.$parent.displayData.galHullHigher;

            console.log("syncData ran");
            console.log(this.colSpeed);
        },
    }
}
var updateStats = {
    mounted: function() {
        this.compare();
    },
    methods: {
        compare: function(component) {
            if (this.colSpeed > this.galSpeed) {
                this.colSpeedHigher = "true";
                this.galSpeedHigher = "false";
            } else if (this.colSpeed < this.galSpeed) {
                this.colSpeedHigher = "false";
                this.galSpeedHigher = "true";
            } else if (this.colSpeed === this.galSpeed) {
                this.colSpeedHigher = null;
                this.galSpeedHigher = null;
            }

            if (this.colArmor > this.galArmor) {
                this.colArmorHigher = "true";
                this.galArmorHigher = "false";
            } else if (this.colArmor < this.galArmor) {
                this.colArmorHigher = "false";
                this.galArmorHigher = "true";
            } else if (this.colArmor === this.galArmor) {
                this.colArmorHigher = null;
                this.galArmorHigher = null;
            }

            if (this.colDamage > this.galDamage) {
                this.colDamageHigher = "true";
                this.galDamageHigher = "false";
            } else if (this.colDamage < this.galDamage) {
                this.colDamageHigher = "false";
                this.galDamageHigher = "true";
            } else if (this.colDamage === this.galDamage) {
                this.colDamageHigher = null;
                this.galDamageHigher = null;
            }

            // if (colRof > galRof) { //// TODO: figure out how to compare text.
            //     colRofHigher = "true";
            // } else if (colRof < galRof) {
            //     colRofHigher = "false";
            // } else if (colRof === galRof) {
            //     colRofHigher = null;
            // }

            if (this.colHull > this.galHull) {
                this.colHullHigher = "true";
                this.galHullHigher = "false";
            } else if (this.colHull < this.galHull) {
                this.colHullHigher = "false";
                this.galHullHigher = "true";
            } else if (this.colHull === this.unitData.galHull) {
                this.colHullHigher = null;
                this.galHullHigher = null;
            }

            console.log("Compare ran ");
            console.log("Compare: " + this.displayData.colSpeedHigher, this.displayData.galSpeedHigher);
            console.log("Compare: " + this.displayData.colArmorHigher, this.displayData.galArmorHigher);
            console.log("Compare: " + this.displayData.colDamageHigher, this.displayData.galDamageHigher);
            console.log("Compare: " + this.displayData.colHullHigher, this.displayData.galHullHigher);
        },
    }
}

// var initialStats = {
//     created: function() {
//         this.initialStats();
//     },
//     data: function() {
//         return {
//
//         }
//     },
//     methods: {
//         initialStats:
//             function(component) {
//                 this.colSpeedHigher = null;
//                 this.colArmorHigher = null;
//                 this.colDamageHigher = null;
//                 this.colRofHigher = null;
//                 this.colHullHigher = null;
//                 this.galSpeedHigher = null;
//                 this.galArmorHigher = null;
//                 this.galDamageHigher = null;
//                 this.galRofHigher = null;
//                 this.galHullHigher = null;
//                 console.log("initialStats ran");
//                 console.log("Coalition: " + this.colSpeedHigher);
//                 console.log("Coalition: " + this.colArmorHigher);
//                 console.log("Coalition: " + this.colDamageHigher);
//                 console.log("Coalition: " + this.colRofHigher);
//                 console.log("Coalition: " + this.colHullHigher);
//                 console.log("Gaalsien: " + this.galSpeedHigher);
//                 console.log("Gaalsien: " + this.galArmorHigher);
//                 console.log("Gaalsien: " + this.galDamageHigher);
//                 console.log("Gaalsien: " + this.galRofHigher);
//                 console.log("Gaalsien: " + this.galHullHigher);
//             },
//     }
// }

// var updateStats = {
//     mounted: function() {
//         this.compare();
//         this.setStats();
//         this.compare();
//     },
//     methods: {
//     }
// }

//Create components
//Coalition components //// NOTE: These individual unit components point to the proper template and contain all of the units' data. The template controls how that data is presented.

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
        mixins: [ parentData, updateStats ]
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
        mixins: [ parentData, updateStats ]
    });

    var colAssCruiser = Vue.component('col-assault-cruiser',{
        template: '#coalition-unit-template',
        data: function () {
            return {
                title: "Assault Cruiser",
                desc: "Assaults big stuff.",
                image: 'assaultCruiser_coalition.jpg',
                speed: 65,
                armor: 15,
                damage: 70,
                rof: 'High',
                hull: 2700,
                strong: 'Ground',
                weak: 'Aircraft, Railguns',
            }
        },
        mixins: [ parentData, updateStats ]
    });

    var colBaserunner = Vue.component('col-baserunner',{
        template: '#coalition-unit-template',
        data: function () {
            return {
                title: "Baserunner",
                desc: "Builds stuff.",
                image: 'baserunner_coalition.jpg',
                speed: 65,
                armor: 2,
                damage: 5,
                rof: 'Medium',
                hull: 3350,
                strong: 'N/A',
                weak: 'Everything',
            }
        },
        mixins: [ parentData, updateStats ]
    });

    var colBatCruiser = Vue.component('col-battle-cruiser',{
        template: '#coalition-unit-template',
        data: function () {
            return {
                title: "Battlecruiser",
                desc: "Big ship. Big guns.",
                image: 'battleCruiser_coalition.jpg',
                speed: 50,
                armor: 25,
                damage: 300,
                rof: 'Low',
                hull: 6500,
                strong: 'Ground',
                weak: 'Railguns, Aircraft, Strikecraft',
            }
        },
        mixins: [ parentData, updateStats ]
    });

    var colCarrier = Vue.component('col-carrier',{
        template: '#coalition-unit-template',
        data: function () {
            return {
                title: "Carrier",
                desc: "Carries things. Lots of things.",
                image: 'carrier_coalition.jpg',
                speed: 60,
                armor: 25,
                damage: 10,
                rof: 'Very low',
                hull: 15000,
                strong: 'N/A',
                weak: 'Railguns, Cruisers',
            }
        },
        mixins: [ parentData, updateStats ]
    });

    var colGunship = Vue.component('col-gunship',{
        template: '#coalition-unit-template',
        data: function () {
            return {
                title: "Gunship",
                desc: "Flying ship with a big gun.",
                image: 'gunship_coalition.jpg',
                speed: 375,
                armor: 10,
                damage: 15,
                rof: 'Very high',
                hull: 1050,
                strong: 'Ground',
                weak: 'Anti-air, Interceptors, Strikecraft',
            }
        },
        mixins: [ parentData, updateStats ]
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
        mixins: [ parentData, updateStats ]
    });

    var colMisBattery = Vue.component('missile-battery',{
        template: '#coalition-unit-template',
        data: function () {
            return {
                title: "Missile Battery",
                desc: "Shoots missiles at air units.",
                image: 'missileBattery_coalition.jpg',
                speed: 50,
                armor: 5,
                damage: 250,
                rof: 'Low',
                hull: 1800,
                strong: 'Aircraft',
                weak: 'Ground units',
            }
        },
        mixins: [ parentData, updateStats ]
    });

    var colRailgun = Vue.component('col-railgun',{
        template: '#coalition-unit-template',
        data: function () {
            return {
                title: "Railgun",
                desc: "Long-range, heavy-weapon platform.",
                image: 'railgun_coalition.jpg',
                speed: 66,
                armor: 3,
                damage: 225,
                rof: 'Medium',
                hull: 675,
                strong: 'Armored, Railguns',
                weak: 'Railguns, Aircraft, Cruisers',
            }
        },
        mixins: [ parentData, updateStats ]
    });

    var colSalvager = Vue.component('col-salvager',{
        template: '#coalition-unit-template',
        data: function () {
            return {
                title: "Salvager",
                desc: "Uses its tools to salvage stuff.",
                image: 'salvager_coalition.jpg',
                speed: 75,
                armor: 5,
                damage: 0,
                rof: 'N/A',
                hull: 900,
                strong: 'N/A',
                weak: 'Everything',
            }
        },
        mixins: [ parentData, updateStats ]
    });

    var colStrFighter = Vue.component('col-strike-fighter',{
        template: '#coalition-unit-template',
        data: function () {
            return {
                title: "Strike Figther",
                desc: "Fast air superiority unit.",
                image: 'strikeFighter_coalition.jpg',
                speed: 435,
                armor: 1,
                damage: 120,
                rof: 'Low',
                hull: 650,
                strong: 'Ground',
                weak: 'Anti-air, Interceptors, Strikecraft',
            }
        },
        mixins: [ parentData, updateStats ]
    });

    var colSupCruiser = Vue.component('col-support-cruiser',{
        template: '#coalition-unit-template',
        data: function () {
            return {
                title: "Support Cruiser",
                desc: "Large support unit.",
                image: 'supportCruiser_coalition.jpg',
                speed: 70,
                armor: 2,
                damage: 1,
                rof: 'Low',
                hull: 4100,
                strong: 'N/A',
                weak: 'Everything',
            }
        },
        mixins: [ parentData, updateStats ]
    });

    var colTacBomber = Vue.component('col-tactical-bomber',{
        template: '#coalition-unit-template',
        data: function () {
            return {
                title: "Tactical Bomber",
                desc: "Drops big bombs that make big explosions.",
                image: 'tacticalBomber_coalition.jpg',
                speed: 370,
                armor: 15,
                damage: 2500,
                rof: 'Low',
                hull: 1050,
                strong: 'Ground',
                weak: 'Anti-air, Interceptors, Strikecraft',
            }
        },
        mixins: [ parentData, updateStats ]
    });

//Gaalsien components //// NOTE: These individual unit components point to the proper template and contain all of the units' data. The template controls how that data is presented.

    //Gaalsien unit components
    var galAssRailgun = Vue.component('gal-assault-railgun',{
        template: '#gaalsien-unit-template',
        data: function () {
            return {
                title: "Assault Railgun",
                desc: "Long-range, heavy attack.",
                image: 'assaultRailgun_gaalsien.jpg',
                speed: 100,
                armor: 6,
                damage: 50,
                rof: 'High',
                hull: 550,
                strong: 'Armored, Railguns',
                weak: 'Railguns, Aircraft, Cruisers',
            }
        },
        mixins: [ parentData, updateStats ]
    });

    var galAssShip = Vue.component('gal-assault-ship',{
        template: '#gaalsien-unit-template',
        data: function () {
            return {
                title: "Assault Ship",
                desc: "this is an assault ship",
                image: 'assaultShip_gaalsien.jpg',
                speed: 70,
                armor: 6,
                damage: 24,
                rof: 'Medium',
                hull: 1400,
                strong: 'Strikecraft',
                weak: 'Railguns, Cruisers',
            }
        },
        mixins: [ parentData, updateStats ]
    });

    var galBaserunner = Vue.component('gal-baserunner',{
        template: '#gaalsien-unit-template',
        data: function () {
            return {
                title: "Baserunner",
                desc: "It runs bases. Like in baseball.",
                image: 'baserunner_gaalsien.jpg',
                speed: 70,
                armor: 2,
                damage: 5,
                rof: 'Low',
                hull: 3350,
                strong: 'N/A',
                weak: 'Everything',
            }
        },
        mixins: [ parentData, updateStats ]
    });

    var galCarrier = Vue.component('gal-carrier',{
        template: '#gaalsien-unit-template',
        data: function () {
            return {
                title: "Carrier",
                desc: "Carries stuff. Like other ships.",
                image: 'carrier_gaalsien.jpg',
                speed: 10,
                armor: 40,
                damage: 10,
                rof: 'Very low',
                hull: 12500,
                strong: 'N/A',
                weak: 'Railguns, Cruisers',
            }
        },
        mixins: [ parentData, updateStats ]
    });

    var galHvyRailgun = Vue.component('gal-heavy-railgun',{
        template: '#gaalsien-unit-template',
        data: function () {
            return {
                title: "Heavy Railgun",
                desc: "Long-range, heavy-weapon platform.",
                image: 'heavyRailgun_gaalsien.jpg',
                speed: 62,
                armor: 3,
                damage: 225,
                rof: 'Medium',
                hull: 620,
                strong: 'Armored, Railguns',
                weak: 'Railguns, Aircraft, Cruisers',
            }
        },
        mixins: [ parentData, updateStats ]
    });

    var galHonCruiser = Vue.component('gal-honorguard-cruiser',{
        template: '#gaalsien-unit-template',
        data: function () {
            return {
                title: "Honorguard Cruiser",
                desc: "Heavy assault cruiser.",
                image: 'honorguardCruiser_gaalsien.jpg',
                speed: 60,
                armor: 6,
                damage: 400,
                rof: 'Medium',
                hull: 3600,
                strong: 'Ground',
                weak: 'Aircraft, Railguns',
            }
        },
        mixins: [ parentData, updateStats ]
    });

    var galInterceptor = Vue.component('gal-interceptor',{
        template: '#gaalsien-unit-template',
        data: function () {
            return {
                title: "Interceptor",
                desc: "Air superiority unit.",
                image: 'interceptor_gaalsien.jpg',
                speed: 435,
                armor: 1,
                damage: 150,
                rof: 'Medium',
                hull: 475,
                strong: 'Ground',
                weak: 'Anti-air, Interceptors, Strikecraft',
            }
        },
        mixins: [ parentData, updateStats ]
    });

    var galMisShip = Vue.component('gal-missile-ship',{
        template: '#gaalsien-unit-template',
        data: function () {
            return {
                title: "Missile Ship",
                desc: "Launches missiles at air units.",
                image: 'missileShip_gaalsien.jpg',
                speed: 55,
                armor: 5,
                damage: 250,
                rof: 'Low',
                hull: 1800,
                strong: 'Ground',
                weak: 'Anti-air, Interceptors, Strikecraft',
            }
        },
        mixins: [ parentData, updateStats ]
    });

    var galPreBomber = Vue.component('gal-precision-bomber',{
        template: '#gaalsien-unit-template',
        data: function () {
            return {
                title: "Precision Bomber",
                desc: "Drops big bombs that make big explosions.",
                image: 'precisionBomber_gaalsien.jpg',
                speed: 550,
                armor: 15,
                damage: 1000,
                rof: 'Low',
                hull: 1250,
                strong: 'Ground',
                weak: 'Anti-air, Interceptors, Strikecraft',
            }
        },
        mixins: [ parentData, updateStats ]
    });

    var galProCruiser = Vue.component('gal-production-cruiser',{
        template: '#gaalsien-unit-template',
        data: function () {
            return {
                title: "Production Cruiser",
                desc: "Produces smaller units.",
                image: 'productionCruiser_gaalsien.jpg',
                speed: 70,
                armor: 5,
                damage: 20,
                rof: 'Low',
                hull: 4100,
                strong: 'N/A',
                weak: 'Everything',
            }
        },
        mixins: [ parentData, updateStats ]
    });

    var galSalvager = Vue.component('gal-salvager',{
        template: '#gaalsien-unit-template',
        data: function () {
            return {
                title: "Salvager",
                desc: "Uses its tools to salvage stuff.",
                image: 'salvager_gaalsien.jpg',
                speed: 75,
                armor: 2,
                damage: 0,
                rof: 'N/A',
                hull: 900,
                strong: 'N/A',
                weak: 'Everything',
            }
        },
        mixins: [ parentData, updateStats ]
    });

    var galSandskimmer = Vue.component('gal-sandskimmer',{
        template: '#gaalsien-unit-template',
        data: function () {
            return {
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
        mixins: [ parentData, updateStats ]
    });

    var galSieCruiser = Vue.component('gal-siege-cruiser',{
        template: '#gaalsien-unit-template',
        data: function () {
            return {
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
        mixins: [ parentData, updateStats ]
    });

//Gaalsien unit menu
var gaalsienMenu = Vue.component('gaalsien-menu',{
    template: '#gaalsien-menu-template',
});

//Coalition unit menu
var coalitionMenu = Vue.component('coalition-menu',{
    template: '#coalition-menu-template',
});

new Vue ({
    el: '#app',
    mounted: function() {
        this.setStats();
    },
    updated: function() {
        this.setStats();
    },
    data: {
        currentGalUnit: "Sandskimmer",
        currentColUnit: "LAV",
        displayData: {
            colSpeedHigher: false,
            colArmorHigher: null,
            colDamageHigher: null,
            colRofHigher: null,
            colHullHigher: false,
            galSpeedHigher: true,
            galArmorHigher: null,
            galDamageHigher: null,
            galRofHigher: null,
            galHullHigher: true,
            showColMenu: false, //// NOTE: Controls whether the drop-down menu is visible. Altered by @click effects in the HTML.
            showGalMenu: false,
            showColTemplate: false,
            showGalTemplate: false, //// NOTE: Hides or shows the template for this view. It should never be visible, as the <component> tags in the HTML handle presenting the unit view.
        },
        unitData: {
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
        },
        colComponentsArray: [ //// NOTE: This array populates the navigation menu. On click, it loads the relevant component.
            'AAV',
            'ArtilleryCruiser',
            'AssaultCruiser',
            'Baserunner',
            'BattleCruiser',
            'Carrier',
            'Gunship',
            'LAV',
            'MissileBattery',
            'Railgun',
            'Salvager',
            'StrikeFighter',
            'SupportCruiser',
            'TacticalBomber',
        ],
        galComponentsArray: [ //// NOTE: This array populates the navigation menu. On click, it loads the relevant component.
            'AssaultRailgun',
            'AssaultShip',
            'galBaserunner',
            'galCarrier',
            'HeavyRailgun',
            'HonorguardCruiser',
            'Interceptor',
            'MissileShip',
            'PrecisionBomber',
            'ProductionCruiser',
            'galSalvager',
            'Sandskimmer',
            'SiegeCruiser',
        ],
    },
    components: { //// NOTE: These are local components related to this view.
        'AAV': colAAV,
        'ArtilleryCruiser': colArtCruiser,
        'AssaultCruiser': colAssCruiser,
        'Baserunner': colBaserunner,
        'BattleCruiser': colBatCruiser,
        'Carrier': colCarrier,
        'Gunship': colGunship,
        'LAV': colLAV,
        'MissileBattery': colMisBattery,
        'Railgun': colRailgun,
        'Salvager': colSalvager,
        'StrikeFighter': colStrFighter,
        'SupportCruiser': colSupCruiser,
        'TacticalBomber': colTacBomber,
        'Menu': coalitionMenu,
        'AssaultRailgun': galAssRailgun,
        'AssaultShip': galAssShip,
        'galBaserunner': galBaserunner, // REVIEW: ways to avoid awkward naming here
        'galCarrier': galCarrier,
        'HeavyRailgun': galHvyRailgun,
        'HonorguardCruiser': galHonCruiser,
        'Interceptor': galInterceptor,
        'MissileShip': galMisShip,
        'PrecisionBomber': galPreBomber,
        'ProductionCruiser': galProCruiser,
        'galSalvager': galSalvager,
        'Sandskimmer': galSandskimmer,
        'SiegeCruiser': galSieCruiser,
        'Menu': gaalsienMenu,
    },
    methods: {
        swapColUnit: function(component) {
            if (this.currentColUnit === component) {
                this.currentColUnit = null;
            } else {
                this.currentColUnit = component;
            }
        },
        swapGalUnit: function(component) {
            if (this.currentGalUnit === component) {
                this.currentGalUnit = null;
            } else {
                this.currentGalUnit = component;
            }
        },
        setStats: function(component) {
            this.unitData.colSpeed = this.$refs.currentColUnit.speed;
            this.unitData.colArmor = this.$refs.currentColUnit.armor;
            this.unitData.colDamage = this.$refs.currentColUnit.damage;
            this.unitData.colRof = this.$refs.currentColUnit.rof;
            this.unitData.colHull = this.$refs.currentColUnit.hull;
            this.unitData.galSpeed = this.$refs.currentGalUnit.speed;
            this.unitData.galArmor = this.$refs.currentGalUnit.armor;
            this.unitData.galDamage = this.$refs.currentGalUnit.damage;
            this.unitData.galRof = this.$refs.currentGalUnit.rof;
            this.unitData.galHull = this.$refs.currentGalUnit.hull;
            console.log("setStats ran");
            console.log("col " + this.unitData.colSpeed);
            console.log("col " + this.unitData.colArmor);
            console.log("col " + this.unitData.colDamage);
            console.log("col " + this.unitData.colRof);
            console.log("col " + this.unitData.colHull);
            console.log("gal " + this.unitData.galSpeed);
            console.log("gal " + this.unitData.galArmor);
            console.log("gal " + this.unitData.galDamage);
            console.log("gal " + this.unitData.galRof);
            console.log("gal " + this.unitData.galHull);
        },
    },
});
