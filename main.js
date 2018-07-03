new Vue ({
    el: '#app',
    data: {
        colUnit: 'LAV',
        galUnit: 'Sandskimmer',
        galMenuShow: false,
        colMenuShow: false,
        colComponents: [
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
        galComponents: [
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
    components: {
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
        swapGalUnit: function(component) {
            console.log(this.galUnit + "  before");
            if (this.galUnit === component) {
                this.galUnit = null;
                console.log(this.galUnit + "  if galUnit===current component");
            } else {
                this.galUnit = component;
                console.log(this.galUnit + "  if !galUnit===current component");
            }
        },
        swapColUnit: function(component) {
            console.log(this.colUnit + "  before");
            if (this.colUnit === component) {
                this.colUnit = null;
                console.log(this.colUnit + "  if colUnit===current component");
            } else {
                this.colUnit = component;
                console.log(this.colUnit + "  if !colUnit===current component");
            }
        },
    }
});

//Create components
//Menus
Vue.component('gaalsien-menu',{
    template: '#gaalsien-menu-template',
});

Vue.component('coalition-menu',{
    template: '#coalition-menu-template',
});

//Gaalsien unit view
Vue.component('gaalsien-units',{
    template: '#gaalsien-unit-template',
});

//Coalition unit view
Vue.component('coalition-units',{
    template: '#coalition-unit-template',
});

//Coalition components

var colAAV = Vue.component('col-aav',{
    template: '#coalition-unit-template',
    data: function () {
        return {
            title: "AAV",
            desc: "This is a heavily armored attack vehicle.",
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
});

var colBaserunner = Vue.component('col-baserunner',{
    template: '#coalition-unit-template',
});

var colBatCruiser = Vue.component('col-battle-cruiser',{
    template: '#coalition-unit-template',
});

var colCarrier = Vue.component('col-carrier',{
    template: '#coalition-unit-template',
});

var colGunship = Vue.component('col-gunship',{
    template: '#coalition-unit-template',
});

var colLAV = Vue.component('col-lav',{
    template: '#coalition-unit-template',
});

var colMisBattery = Vue.component('missile-battery',{
    template: '#coalition-unit-template',
});

var colRailgun = Vue.component('col-railgun',{
    template: '#coalition-unit-template',
});

var colSalvager = Vue.component('col-salvager',{
    template: '#coalition-unit-template',
});

var colStrFighter = Vue.component('col-strike-fighter',{
    template: '#coalition-unit-template',
});

var colSupCruiser = Vue.component('col-support-cruiser',{
    template: '#coalition-unit-template',
});

var colTacBomber = Vue.component('col-tactical-bomber',{
    template: '#coalition-unit-template',
});


//Gaalsien components
var galAssRailgun = Vue.component('gal-assault-railgun',{
    template: '#gaalsien-unit-template',
    data: function () {
        return {
            title: "Gaalsien Assault Railgun",
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

var galAssShip = Vue.component('gal-artillery-cruiser',{
    template: '#gaalsien-unit-template',
});

var galBaserunner = Vue.component('gal-baserunner',{
    template: '#gaalsien-unit-template',
});

var galCarrier = Vue.component('gal-carrier',{
    template: '#gaalsien-unit-template',
});

var galHvyRailgun = Vue.component('gal-assault-cruiser',{
    template: '#gaalsien-unit-template',
});

var galHonCruiser = Vue.component('gal-battle-cruiser',{
    template: '#gaalsien-unit-template',
});

var galInterceptor = Vue.component('gal-gunship',{
    template: '#gaalsien-unit-template',
});

var galMisShip = Vue.component('gal-lav',{
    template: '#gaalsien-unit-template',
});

var galPreBomber = Vue.component('gal-missile-battery',{
    template: '#gaalsien-unit-template',
});

var galProCruiser = Vue.component('gal-railgun',{
    template: '#gaalsien-unit-template',
});

var galSalvager = Vue.component('gal-salvager',{
    template: '#gaalsien-unit-template',
});

var galSandskimmer = Vue.component('gal-strike-fighter',{
    template: '#gaalsien-unit-template',
});

var galSieCruiser = Vue.component('gal-support-cruiser',{
    template: '#gaalsien-unit-template',
});
