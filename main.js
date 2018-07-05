//Custom global functions as mixins
var colStats = {
    created: function() {
        this.setColStats();
        this.compare();
    },
    mounted: function () {
        console.log("colStats - Mounted:" + colSpeedHigher);
        console.log("colStats - Mounted:" + this.speedHigher);
    },
    data: function () {
        return {
            speedHigher: colSpeedHigher, //// REVIEW: speedHigher doesn't seem to be updating, leading to incorrect display of v-if divs.
            armorHigher: colArmorHigher,
            damageHigher: colDamageHigher,
            rofHigher: colRofHigher,
            hullHigher: colHullHigher,
        }
    },
    methods: {
        setColStats:
            function(component) {
                colSpeed = this.speed;
                colArmor = this.armor;
                colDamage = this.damage;
                colRof = this.rof;
                colHull = this.hull;
            },
        compare:
            function(component) {
                console.log("colStats - Coalition:" + colSpeed);
                console.log("colStats - Gaalsien:" + galSpeed);

                if (colSpeed > galSpeed) {
                    colSpeedHigher = "true";
                } else if (colSpeed < galSpeed) {
                    colSpeedHigher = "false";
                } else if (colSpeed === galSpeed) {
                    colSpeedHigher = null;
                }

                if (colArmor > galArmor) {
                    colArmorHigher = "true";
                } else if (colArmor < galArmor) {
                    colArmorHigher = "false";
                } else if (colArmor === galArmor) {
                    colArmorHigher = null;
                }

                if (colDamage > galDamage) {
                    colDamageHigher = "true";
                } else if (colDamage < galDamage) {
                    colDamageHigher = "false";
                } else if (colDamage === galDamage) {
                    colDamageHigher = null;
                }

                // if (colRof > galRof) { //// TODO: figure out how to compare text.
                //     colRofHigher = "true";
                // } else if (colRof < galRof) {
                //     colRofHigher = "false";
                // } else if (colRof === galRof) {
                //     colRofHigher = null;
                // }

                if (colHull > galHull) {
                    colHullHigher = "true";
                } else if (colHull < galHull) {
                    colHullHigher = "false";
                } else if (colHull === galHull) {
                    colHullHigher = null;
                }

                console.log("colStats - Created:" + colSpeedHigher);
            }
    }
}

var galStats = {
    created: function() {
        this.setGalStats(),
        this.compare();
    },
    mounted: function () {
        console.log("galStats - Mounted:" + galSpeedHigher);
        console.log("galStats - Mounted:" + this.speedHigher);
    },
    data: function () {
        return {
            speedHigher: galSpeedHigher,
            armorHigher: galArmorHigher,
            damageHigher: galDamageHigher,
            rofHigher: galRofHigher,
            hullHigher: galHullHigher,
        }
    },
    methods: {
        setGalStats:
            function(component) {
                galSpeed = this.speed;
                galArmor = this.armor;
                galDamage = this.damage;
                galRof = this.rof;
                galHull = this.hull;
            },
        compare:
            function(component) {
                console.log("galStats - Coalition:" + colSpeed);
                console.log("galStats - Gaalsien:" + galSpeed);

                if (galSpeed > colSpeed) {
                    galSpeedHigher = "true";
                } else if (galSpeed < colSpeed) {
                    galSpeedHigher = "false";
                } else if (galSpeed === colSpeed) {
                    galSpeedHigher = null;
                }

                if (galArmor > colArmor) {
                    galArmorHigher = "true";
                } else if (galArmor < colArmor) {
                    galArmorHigher = "false";
                } else if (galArmor === colArmor) {
                    galArmorHigher = null;
                }

                if (galDamage > colDamage) {
                    galDamageHigher = "true";
                } else if (galDamage < colDamage) {
                    galDamageHigher = "false";
                } else if (galDamage === colDamage) {
                    galDamageHigher = null;
                }

                // if (galRof > colRof) { //// TODO: figure out how to compare text.
                //     galRofHigher = "true";
                // } else if (galRof < colRof) {
                //     galRofHigher = "false";
                // } else if (galRof === colRof) {
                //     galRofHigher = null;
                // }

                if (galHull > colHull) {
                    galHullHigher = "true";
                } else if (galHull < colHull) {
                    galHullHigher = "false";
                } else if (galHull === colHull) {
                    galHullHigher = null;
                }

                console.log("galStats - Gaalsien:" + galSpeedHigher);
            }
    }
}

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
        mixins: [ colStats ]
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
        mixins: [ colStats ]
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
        mixins: [ galStats ]
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
        mixins: [ colStats ]
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
        mixins: [ colStats ]
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
        mixins: [ colStats ]
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
        mixins: [ colStats ]
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
        mixins: [ colStats ]
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
        mixins: [ colStats ]
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
        mixins: [ colStats ]
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
        mixins: [ colStats ]
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
        mixins: [ colStats ]
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
        mixins: [ colStats ]
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
        mixins: [ colStats ]
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
        mixins: [ galStats ]
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
        mixins: [ galStats ]
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
        mixins: [ galStats ]
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
        mixins: [ galStats ]
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
        mixins: [ galStats ]
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
        mixins: [ galStats ]
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
        mixins: [ galStats ]
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
        mixins: [ galStats ]
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
        mixins: [ galStats ]
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
        mixins: [ galStats ]
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
        mixins: [ galStats ]
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
        mixins: [ galStats ]
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
        mixins: [ galStats ]
    });


//Gaalsien unit menu
Vue.component('gaalsien-menu',{
    template: '#gaalsien-menu-template',
});

//Gaalsien unit view
Vue.component('gaalsien-units',{
    template: '#gaalsien-unit-template',
});

//Coalition unit view
Vue.component('coalition-units',{
    template: '#coalition-unit-template',
});

//Coalition unit menu
Vue.component('coalition-menu',{
    template: '#coalition-menu-template',
});

var gaalsien = new Vue ({
    el: '#gaalsien',
    data: {
        currentUnit: "Sandskimmer",
        showMenu: false, //// NOTE: Controls whether the drop-down menu is visible. Altered by @click effects in the HTML.
        showTemplate: false, //// NOTE: Hides or shows the template for this view. It should never be visible, as the <component> tags in the HTML handle presenting the unit view.
        componentsArray: [ //// NOTE: This array populates the navigation menu. On click, it loads the relevant component.
            'AssaultRailgun',
            'AssaultShip',
            'Baserunner',
            'Carrier',
            'HeavyRailgun',
            'HonorguardCruiser',
            'Interceptor',
            'MissileShip',
            'PrecisionBomber',
            'ProductionCruiser',
            'Salvager',
            'Sandskimmer',
            'SiegeCruiser',
        ],
    },
    components: { //// NOTE: These are local components related to this view.
        'AssaultRailgun': galAssRailgun,
        'AssaultShip': galAssShip,
        'Baserunner': galBaserunner,
        'Carrier': galCarrier,
        'HeavyRailgun': galHvyRailgun,
        'HonorguardCruiser': galHonCruiser,
        'Interceptor': galInterceptor,
        'MissileShip': galMisShip,
        'PrecisionBomber': galPreBomber,
        'ProductionCruiser': galProCruiser,
        'Salvager': galSalvager,
        'Sandskimmer': galSandskimmer,
        'SiegeCruiser': galSieCruiser,
    },
    methods: {
        swapUnit: function(component) {
            if (this.currentUnit === component) {
                this.currentUnit = null;
            } else {
                this.currentUnit = component;
            }
        },
    },
});

var coalition = new Vue ({
    el: '#coalition',
    data: {
        currentUnit: "LAV",
        showMenu: false, //// NOTE: Controls whether the drop-down menu is visible. Altered by @click effects in the HTML.
        showTemplate: false, //// NOTE: Hides or shows the template for this view. It should never be visible, as the <component> tags in the HTML handle presenting the unit view.
        componentsArray: [ //// NOTE: This array populates the navigation menu. On click, it loads the relevant component.
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
    },
    methods: {
        swapUnit: function(component) {
            if (this.currentUnit === component) {
                this.currentUnit = null;
            } else {
                this.currentUnit = component;
            }
        },
    },
});

//Global variables that rely on DOM structure being in place - therefore must be referenced after view has been initialized.
var colSpeed = document.getElementById("col-stat-speed").innerHTML;
var galSpeed = document.getElementById("gal-stat-speed").innerHTML;
var colArmor = document.getElementById("col-stat-armor").innerHTML;
var galArmor = document.getElementById("gal-stat-armor").innerHTML;
var colDamage = document.getElementById("col-stat-damage").innerHTML;
var galDamage = document.getElementById("gal-stat-damage").innerHTML;
var colRof = document.getElementById("col-stat-rof").innerHTML;
var galRof = document.getElementById("gal-stat-rof").innerHTML;
var colHull = document.getElementById("col-stat-hull").innerHTML;
var galHull = document.getElementById("gal-stat-hull").innerHTML;

var galSpeedHigher = null;
var galArmorHigher = null;
var galDamageHigher = null;
var galRofHigher = null;
var galHullHigher = null;
var colSpeedHigher = null;
var colArmorHigher = null;
var colDamageHigher = null;
var colRofHigher = null;
var colHullHigher = null;
