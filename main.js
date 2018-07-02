//Create components
//Menus
Vue.component('gaalsien-menu',{
    data: {
      items: [
           'AssaultRailgun', 'AssaultShip', 'Baserunner', 'Carrier', 'HeavyRailgun', 'HonorguardCruiser', 'Interceptor', 'MissileShip', 'PrecisionBomber', 'ProductionCruiser', 'Salvager', 'Sandskimmer', 'SiegeCruiser',
       ],
       show: false,
   },
});

Vue.component('coalition-menu',{
    data: {
      items: [
           'AAV', 'ArtilleryCruiser', 'AssaultCruiser', 'Baserunner', 'BattleCruiser',  'Carrier', 'Gunship', 'LAV', 'MissileBattery', 'Railgun', 'Salvager', 'StrikeFighter', 'SupportCruiser', 'TacticalBomber',
       ],
       show: false,
   },
});

//Coalition components
var colAAV = Vue.component('aav',{
    template: '#coalition-unit-template',
    data: function () {
        return {
            title: "Coalition AAV",
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

var colArtCruiser = Vue.component('artillery-cruiser',{
    template: '#coalition-unit-template',
});

var colAssCruiser = Vue.component('assault-cruiser',{
    template: '#coalition-unit-template',
});

var colBaserunner = Vue.component('baserunner',{
    template: '#coalition-unit-template',
});

var colBatCruiser = Vue.component('battle-cruiser',{
    template: '#coalition-unit-template',
});

var colCarrier = Vue.component('carrier',{
    template: '#coalition-unit-template',
});

var colGunship = Vue.component('gunship',{
    template: '#coalition-unit-template',
});

var colLAV = Vue.component('lav',{
    template: '#coalition-unit-template',
});

var colMisBattery = Vue.component('missile-battery',{
    template: '#coalition-unit-template',
});

var colRailgun = Vue.component('railgun',{
    template: '#coalition-unit-template',
});

var colSalvager = Vue.component('salvager',{
    template: '#coalition-unit-template',
});

var colStrFighter = Vue.component('strike-fighter',{
    template: '#coalition-unit-template',
});

var colSupCruiser = Vue.component('support-cruiser',{
    template: '#coalition-unit-template',
});

var colTacBomber = Vue.component('tactical-bomber',{
    template: '#coalition-unit-template',
});


//Gaalsien components
var galAssRailgun = Vue.component('aav',{
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

var galAssShip = Vue.component('artillery-cruiser',{
    template: '#gaalsien-unit-template',
});

var galBaserunner = Vue.component('baserunner',{
    template: '#gaalsien-unit-template',
});

var galCarrier = Vue.component('carrier',{
    template: '#gaalsien-unit-template',
});

var galHvyRailgun = Vue.component('assault-cruiser',{
    template: '#gaalsien-unit-template',
});

var galHonCruiser = Vue.component('battle-cruiser',{
    template: '#gaalsien-unit-template',
});

var galInterceptor = Vue.component('gunship',{
    template: '#gaalsien-unit-template',
});

var galMisShip = Vue.component('lav',{
    template: '#gaalsien-unit-template',
});

var galPreBomber = Vue.component('missile-battery',{
    template: '#gaalsien-unit-template',
});

var galProCruiser = Vue.component('railgun',{
    template: '#gaalsien-unit-template',
});

var galSalvager = Vue.component('salvager',{
    template: '#gaalsien-unit-template',
});

var galSandskimmer = Vue.component('strike-fighter',{
    template: '#gaalsien-unit-template',
});

var galSieCruiser = Vue.component('support-cruiser',{
    template: '#gaalsien-unit-template',
});

//Gaalsien unit view
Vue.component('gaalsien',{
    data: {
        view: "Sandskimmer",
    },
    components: {
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
        swapComponent: function(component) {
            if (this.view === component) {
                this.view = null;
            } else {
                this.view = component;
            }
        }
    }
});

//Coalition unit view
Vue.component('coalition',{
    data: {
        view: "AAV",
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
    },
    methods: {
        swapComponent: function(component) {
            if (this.view === component) {
                this.view = null;
            } else {
                this.view = component;
            }
        }
    }
});

new Vue ({
    el: '#app',
});


// images: [
//     { url: 'images/coalitionUnits/AAV_coalition.jpg', alt: 'coalition AAV' },
//     { url: 'images/coalitionUnits/artilleryCruiser_coalition.jpg', alt: 'coalition artillery cruiser' },
//     { url: 'images/coalitionUnits/assaultCruiser_coalition.jpg', alt: 'coalition assault cruiser' },
//     { url: 'images/coalitionUnits/baserunner_coalition.jpg', alt: 'coalition baserunner' },
//     { url: 'images/coalitionUnits/battleCruiser_coalition.jpg', alt: 'coalition battleCruiser' },
//     { url: 'images/coalitionUnits/bomber_coalition.jpg', alt: 'coalition tactical bomber'  },
//     { url: 'images/coalitionUnits/carrier_coalition.jpg', alt: 'coalition carrier'  },
//     { url: 'images/coalitionUnits/gunship_coalition.jpg', alt: 'coalition gunship'  },
//     { url: 'images/coalitionUnits/interceptor_coalition.jpg', alt: 'coalition interceptor'  },
//     { url: 'images/coalitionUnits/LAV_coalition.jpg', alt: 'coalition LAV'  },
//     { url: 'images/coalitionUnits/missileBattery_coalition.jpg', alt: 'coalition missile battery'  },
//     { url: 'images/coalitionUnits/railgun_coalition.jpg', alt: 'coalition railgun'  },
//     { url: 'images/coalitionUnits/salvager_coalition.jpg', alt: 'coalition salvager'  },
//     { url: 'images/coalitionUnits/supportCruiser_coalition.jpg', alt: 'coalition support cruiser'  }
// ],
// show: false,
