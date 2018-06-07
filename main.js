//Create components
//Coalition components
var colAAV = Vue.component('aav',{
    template: '#aav',
});

var colArtCruiser = Vue.component('artillery-cruiser',{
    template: '#artillery-cruiser',
});

var colAssCruiser = Vue.component('assault-cruiser',{
    template: '#assault-cruiser',
});

var colBaserunner = Vue.component('baserunner',{
    template: '#baserunner',
});

var colBatCruiser = Vue.component('battle-cruiser',{
    template: '#battle-cruiser',
});

var colCarrier = Vue.component('carrier',{
    template: '#carrier',
});

var colGunship = Vue.component('gunship',{
    template: '#gunship',
});

var colLAV = Vue.component('lav',{
    template: '#lav',
});

var colMisBattery = Vue.component('missile-battery',{
    template: '#missile-battery',
});

var colRailgun = Vue.component('railgun',{
    template: '#railgun',
});

var colSalvager = Vue.component('salvager',{
    template: '#salvager',
});

var colStrFighter = Vue.component('strike-fighter',{
    template: '#strike-fighter',
});

var colSupCruiser = Vue.component('support-cruiser',{
    template: '#support-cruiser',
});

var colTacBomber = Vue.component('tactical-bomber',{
    template: '#tactical-bomber',
});



//Gaalsien components
var galAssRailgun = Vue.component('aav',{
    template: '#assault-railgun-gaalsien',
});

var galAssShip = Vue.component('artillery-cruiser',{
    template: '#assault-ship-gaalsien',
});

var galBaserunner = Vue.component('baserunner',{
    template: '#baserunner-gaalsien',
});

var galCarrier = Vue.component('carrier',{
    template: '#carrier-gaalsien',
});

var galHvyRailgun = Vue.component('assault-cruiser',{
    template: '#heavy-railgun-gaalsien',
});

var galHonCruiser = Vue.component('battle-cruiser',{
    template: '#honorguard-cruiser-gaalsien',
});

var galInterceptor = Vue.component('gunship',{
    template: '#interceptor-gaalsien',
});

var galMisShip = Vue.component('lav',{
    template: '#missile-ship-gaalsien',
});

var galPreBomber = Vue.component('missile-battery',{
    template: '#precision-bomber-gaalsien',
});

var galProCruiser = Vue.component('railgun',{
    template: '#production-cruiser-gaalsien',
});

var galSalvager = Vue.component('salvager',{
    template: '#salvager-gaalsien',
});

var galSandskimmer = Vue.component('strike-fighter',{
    template: '#sandskimmer-gaalsien',
});

var galSieCruiser = Vue.component('support-cruiser',{
    template: '#siege-cruiser-gaalsien',
});

// Create new Vue instance for gaalsien-dropdown.

var unitView= new Vue({
    el: '#gaalsien',
    data: {
        view: "Sandskimmer",
        componentsArray: [
            'AssaultRailgun', 'AssaultShip', 'Baserunner', 'Carrier', 'HeavyRailgun', 'HonorguardCruiser', 'Interceptor', 'MissileShip', 'PrecisionBomber', 'ProductionCruiser', 'Salvager', 'Sandskimmer', 'SiegeCruiser',
        ],
        show: false,
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

var unitView= new Vue({
    el: '#coalition',
    data: {
        view: "AAV",
        componentsArray: [
            'AAV', 'ArtilleryCruiser', 'AssaultCruiser', 'Baserunner', 'BattleCruiser',  'Carrier', 'Gunship', 'LAV', 'MissileBattery', 'Railgun', 'Salvager', 'StrikeFighter', 'SupportCruiser', 'TacticalBomber',
        ],
        show: false,
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
