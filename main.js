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
    });

    var colStrFighter = Vue.component('col-strike-fighter',{
        template: '#coalition-unit-template',
        data: function () {
            return {
                title: "Strike Figther",
                desc: "Fast air superiority unit.",
                image: 'strikeFighter_coalition.jpg', //// REVIEW: Broken image
                speed: 435,
                armor: 1,
                damage: 120,
                rof: 'Low',
                hull: 650,
                strong: 'Ground',
                weak: 'Anti-air, Interceptors, Strikecraft',
            }
        },
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
    });

    var colTacBomber = Vue.component('col-tactical-bomber',{
        template: '#coalition-unit-template',
        data: function () {
            return {
                title: "Tactical Bomber",
                desc: "Drops big bombs that make big explosions.",
                image: 'tacticalBomber_coalition.jpg',  //// REVIEW: Broken image
                speed: 370,
                armor: 15,
                damage: 2500,
                rof: 'Low',
                hull: 1050,
                strong: 'Ground',
                weak: 'Anti-air, Interceptors, Strikecraft',
            }
        },
    });

//Gaalsien components //// NOTE: These individual unit components point to the proper template and contain all of the units' data. The template controls how that data is presented.

    //Gaalsien unit components
    var galAssRailgun = Vue.component('gal-assault-railgun',{
        template: '#gaalsien-unit-template',
        data: function () {
            return {
                title: "ssault Railgun",
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

new Vue ({
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
            console.log(this.currentUnit + "  before");
            if (this.currentUnit === component) {
                this.currentUnit = null;
                console.log(this.currentUnit + "  if galUnit===current component");
            } else {
                this.currentUnit = component;
                console.log(this.currentUnit + "  if !galUnit===current component");
            }
        },
    }
});

new Vue ({
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
            console.log(this.currentUnit + "  before");
            if (this.currentUnit === component) {
                this.currentUnit = null;
                console.log(this.currentUnit + "  if galUnit===current component");
            } else {
                this.currentUnit = component;
                console.log(this.currentUnit + "  if !galUnit===current component");
            }
        },
    }
});
