// const store = new Vuex.Store({
//     state: {
//         showGalMenu: false,
//         showColMenu: false,
//
//         galUnits: [
//             { id: 'gal1', title: 'Assault Railgun', desc: 'Long-range, medium attack.', speed: 100, armor: 6, damage: 50, rof: 'High', hull: 550, strong: 'Armored, Railguns', weak: 'Railguns, Aircraft, Cruisers', image: 'assaultRailgun_gaalsien.jpg', current: false, speedHigher: null, armorHigher: null, damageHigher: null, rofHigher: null, hullHigher: null },
//
//             { id: 'gal2', title: 'Assault Ship', desc: 'This is an assault ship.', speed: 70, armor: 6, damage: 24, rof: 'Medium', hull: 1400, strong: 'Strikecraft', weak: 'Railguns, Cruisers', image: 'assaultShip_gaalsien.jpg', current: false, speedHigher: null, armorHigher: null, damageHigher: null, rofHigher: null, hullHigher: null },
//
//             { id: 'gal3', title: 'Baserunner', desc: 'It runs bases. Like in baseball.', speed: 70, armor: 2, damage: 5, rof: 'Low', hull: 3350, strong: 'N/A', weak: 'Everything', image: 'baserunner_gaalsien.jpg', current: false,  speedHigher: null, armorHigher: null, damageHigher: null, rofHigher: null, hullHigher: null },
//
//             { id: 'gal4', title: 'Carrier', desc: 'Carries stuff. Like other ships.', speed: 10, armor: 40, damage: 10, rof: 'Very low', hull: 12500, strong: 'N/A', weak: 'Railguns, Cruisers', image: 'carrier_gaalsien.jpg', current: false, speedHigher: null, armorHigher: null, damageHigher: null, rofHigher: null, hullHigher: null },
//
//             { id: 'gal5', title: 'Heavy Railgun', desc: 'Long-range, heavy-weapon platform.', speed: 62, armor: 3, damage: 225, rof: 'Medium', hull: 620, strong: 'Armored, Railguns', weak: 'Railguns, Aircraft, Cruisers', image: 'heavyRailgun_gaalsien.jpg', current: false, speedHigher: null, armorHigher: null, damageHigher: null, rofHigher: null, hullHigher: null },
//
//             { id: 'gal6', title: 'Honorguard Cruiser', desc: 'Heavy assault cruiser.', speed: 60, armor: 6, damage: 400, rof: 'Medium', hull: 3600, strong: 'Ground units', weak: 'Aircraft, railguns', image: 'honorguardCruiser_gaalsien.jpg', current: false, speedHigher: null, armorHigher: null, damageHigher: null, rofHigher: null, hullHigher: null },
//
//             { id: 'gal7', title: 'Interceptor', desc: 'Air superiority unit.', speed: 435, armor: 1, damage: 150, rof: 'Medium', hull: 475, strong: 'Ground', weak: 'Anti-air, Interceptors, Strikecraft', image: 'interceptor_gaalsien.jpg', current: false, speedHigher: null, armorHigher: null, damageHigher: null, rofHigher: null, hullHigher: null },
//
//             { id: 'gal8', title: 'Missile Ship', desc: 'Launches missiles at air units.', speed: 55, armor: 5, damage: 250, rof: 'Low', hull: 1800, strong: 'Aircraft', weak: 'Ground units', image: 'missileShip_gaalsien.jpg', current: false, speedHigher: null, armorHigher: null, damageHigher: null, rofHigher: null, hullHigher: null },
//
//             { id: 'gal9', title: 'Precision Bomber', desc: 'Drops big bombs that make big explosions.', speed: 550, armor: 15, damage: 1000, rof: 'Low', hull: 1250, strong: 'Ground', weak: 'Anti-air, Interceptors, Strikecraft', image: 'precisionBomber_gaalsien.jpg', current: false, speedHigher: null, armorHigher: null, damageHigher: null, rofHigher: null, hullHigher: null },
//
//             { id: 'gal10', title: 'Production Cruiser', desc: 'Produces smaller units.', speed: 70, armor: 5, damage: 20, rof: 'Low', hull: 4100, strong: 'N/A', weak: 'Everything', image: 'productionCruiser_gaalsien.jpg', current: false, speedHigher: null, armorHigher: null, damageHigher: null, rofHigher: null, hullHigher: null },
//
//             { id: 'gal11', title: 'Salvager', desc: 'Uses its tools to salvage stuff.', speed: 75, armor: 2, damage: 0, rof: 'N/A', hull: 900, strong: 'N/A', weak: 'Everything', image: 'salvager_gaalsien.jpg', current: false, speedHigher: null, armorHigher: null, damageHigher: null, rofHigher: null, hullHigher: null },
//
//             { id: 'gal12', title: 'Sandskimmer', desc: 'Light attack vehicle.', speed: 130, armor: 0, damage: 15, rof: 'Medium', hull: 650, strong: 'Strikecraft, Railguns', weak: 'AAVs, Cruisers', image: 'sandskimmer_gaalsien.jpg', current: true, speedHigher: true, armorHigher: null, damageHigher: null, rofHigher: null, hullHigher: true },
//
//             { id: 'gal13', title: 'Siege Cruiser', desc: 'Lobs missiles at unsuspecting targets.', speed: 55, armor: 3, damage: 100, rof: 'Low', hull: 2500, strong: 'Ground', weak: 'Strikecraft, Railguns', image: 'siegeCruiser_gaalsien.jpg', current: false, speedHigher: null, armorHigher: null, damageHigher: null, rofHigher: null, hullHigher: null },
//         ],
//         colUnits: [
//             { id: 'col1', title: 'AAV', desc: 'Armored assault vehicle.', speed: 80, armor: 8, damage: 11, rof: 'Very high', hull: 1400, strong: 'Strikecraft', weak: 'Railguns, Cruisers', image: 'AAV_coalition.jpg', current: false, speedHigher: null, armorHigher: null, damageHigher: null, rofHigher: null, hullHigher: null },
//
//             { id: 'col2', title: 'Artillery Cruiser', desc: 'Smashes things with missles.', speed: 50, armor: 5, damage: 100, rof: 'Low', hull: 2500, strong: 'Ground', weak: 'Strikecraft, Railguns', image: 'artilleryCruiser_coalition.jpg', current: false,  speedHigher: false, armorHigher: null, damageHigher: null, rofHigher: null, hullHigher: false },
//
//             { id: 'col3', title: 'Assault Cruiser', desc: 'Assaults big stuff.', speed: 65, armor: 15, damage: 70, rof: 'High', hull: 2700, strong: 'Ground', weak: 'Aircraft, Railguns', image: 'assaultCruiser_coalition.jpg', current: false, speedHigher: null, armorHigher: null, damageHigher: null, rofHigher: null, hullHigher: null },
//
//             { id: 'col4', title: 'Baserunner', desc: 'Builds stuff.', speed: 65, armor: 2, damage: 5, rof: 'Medium', hull: 3350, strong: 'N/A', weak: 'Everything', image: 'baserunner_coalition.jpg', current: false, speedHigher: null, armorHigher: null, damageHigher: null, rofHigher: null, hullHigher: null },
//
//             { id: 'col5', title: 'Battlecruiser', desc: 'Big ship. Big guns.', speed: 50, armor: 25, damage: 300, rof: 'Low', hull: 6500, strong: 'Ground', weak: 'Railguns, Aircraft', image: 'battleCruiser_coalition.jpg', current: false, speedHigher: null, armorHigher: null, damageHigher: null, rofHigher: null, hullHigher: null },
//
//             { id: 'col6', title: 'Carrier', desc: 'Carries things. Lots of things.', speed: 60, armor: 25, damage: 10, rof: 'Very low', hull: 15000, strong: 'N/A', weak: 'Railguns, Cruisers', image: 'carrier_coalition.jpg', current: false, speedHigher: null, armorHigher: null, damageHigher: null, rofHigher: null, hullHigher: null },
//
//             { id: 'col7', title: 'Gunship', desc: 'Flying ship with a big gun.', speed: 375, armor: 10, damage: 15, rof: 'Very high', hull: 1050, strong: 'Ground', weak: 'Anti-air, Interceptors, Strikecraft', image: 'gunship_coalition.jpg', current: false, speedHigher: null, armorHigher: null, damageHigher: null, rofHigher: null, hullHigher: null },
//
//             { id: 'col8', title: 'LAV', desc: 'Light attack vehicle.', speed: 110, armor: 0, damage: 15, rof: 'Medium', hull: 550, strong: 'Strikecraft, Railguns', weak: 'Assault Railguns, Cruisers', image: 'LAV_coalition.jpg', current: true, speedHigher: false, armorHigher: null, damageHigher: null, rofHigher: null, hullHigher: false },
//
//             { id: 'col9', title: 'Missile Battery', desc: 'Shoots missiles at air units.', speed: 50, armor: 5, damage: 250, rof: 'Low', hull: 1800, strong: 'Aircraft', weak: 'Ground units', image: 'missileBattery_coalition.jpg', current: false, speedHigher: null, armorHigher: null, damageHigher: null, rofHigher: null, hullHigher: null },
//
//             { id: 'col10', title: 'Railgun', desc: 'Long-range, heavy-weapon platform.', speed: 66, armor: 3, damage: 225, rof: 'Medium', hull: 675, strong: 'Armored, Railguns', weak: 'Armored, Railguns', image: 'railgun_coalition.jpg', current: false, speedHigher: null, armorHigher: null, damageHigher: null, rofHigher: null, hullHigher: null },
//
//             { id: 'col11', title: 'Salvager', desc: 'Uses its tools to salvage stuff.', speed: 75, armor: 5, damage: 0, rof: 'N/A', hull: 900, strong: 'N/A', weak: 'Everything', image: 'salvager_coalition.jpg', current: false, speedHigher: null, armorHigher: null, damageHigher: null, rofHigher: null, hullHigher: null },
//
//             { id: 'col12', title: 'Strike Fighter', desc: 'Fast air superiority unit.', speed: 435, armor: 1, damage: 120, rof: 'Low', hull: 650, strong: 'Ground', weak: 'Anti-air, Interceptors, Strikecraft', image: 'strikeFighter_coalition.jpg', current: false, speedHigher: null, armorHigher: null, damageHigher: null, rofHigher: null, hullHigher: null },
//
//             { id: 'col13', title: 'Support Cruiser', desc: 'Large support unit.', speed: 70, armor: 2, damage: 1, rof: 'Low', hull: 4100, strong: 'N/A', weak: 'Everything', image: 'supportCruiser_coalition.jpg', current: false, speedHigher: null, armorHigher: null, damageHigher: null, rofHigher: null, hullHigher: null },
//
//             { id: 'col14', title: 'Tactical Bomber', desc: 'Drops big bombs that make big explosions.', speed: 370, armor: 15, damage: 2500, rof: 'Low', hull: 1050, strong: 'Ground', weak: 'Anti-air, Interceptors, Strikecraft', image: 'tacticalBomber_coalition.jpg', current: false, speedHigher: null, armorHigher: null, damageHigher: null, rofHigher: null, hullHigher: null },
//         ],
//     },
//     mutations: {
//
//     }
// })

var galUnits = Vue.component('gaalsien-units', {
    template: '<div> <p class="unit-description"> {{ desc }} </p> <slot></slot> </div>',
});

var colUnits = Vue.component('coalition-units', {
    template: '<div> <p class="unit-description"> {{ desc }} </p>  <slot></slot> </div>',
});

var vm = new Vue({
    el: '#app',
    mounted () {
        axios
            .get('galUnitData.json')
            .then(response => (this.galUnits = JSON.parse(response))) //JSON.parse doesn't work here.
            .get('colUnitData.json')
            .then(response => (this.colUnits = JSON.parse(response)))
    },
    data () {
            return {
                galUnits: [],
                colUnits: [],
            }
        },
    components: {
        'galUnits': galUnits,
        'colUnits': colUnits,
    },
    methods: {
        parseGalJSON: function() {
            var galJSON = JSON.parse(galUnits);
            console.log(galJSON);
        }
    }
});
