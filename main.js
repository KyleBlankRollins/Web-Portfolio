var galUnits = Vue.component('gaalsien-units',{
    props: {
        title: String,
        speed: Number,
    },
    template: '<div> <h4> {{ title }} </h4> <slot></slot> </div>',
});

var colUnits = Vue.component('coalition-units',{
    props: {
        title: String,
        speed: Number,
    },
    template: '<div> <h4> {{ title }} </h4> <slot></slot> </div>',
});

var unitSpeed = Vue.component('speed',{
    props: {
        speed: Number,
    },
    template: '<div><h5>Speed</h5><p> {{ speed }} </p></div>',
});

new Vue({
    el: '#app',
    created: console.log("App created"),
    data() {
        return {
            showGalMenu: false,
            showColMenu: false,
            currentGalUnit: 'gal2',
            currentColUnit: 'col1',
            galUnits: [
                { id: 'gal1', title: 'Sandskimmer', desc: 'Light attack vehicle.', speed: 130, armor: 0, damage: 15, rof: 'Medium', hull: 650, strong: 'Strikecraft, Railguns', weak: 'AAVs, Cruisers', galFlag: true, image: 'sandskimmer_gaalsien.jpg' },
                { id: 'gal2', title: 'Assault Railgun', desc: 'Light attack vehicle.', speed: 100, armor: 6, damage: 50, rof: 'High', hull: 550, strong: 'Armored, Railguns', weak: 'Railguns, Aircraft, Cruisers', galFlag: true, image: 'assaultRailgun_gaalsien.jpg' },
                { id: 'gal3', title: 'Sandskimmer', desc: 'Light attack vehicle.', speed: 130, armor: 0, damage: 15, rof: 'Medium', hull: 650, strong: 'Strikecraft, Railguns', weak: 'AAVs, Cruisers', galFlag: true, image: 'sandskimmer_gaalsien.jpg' },
                { id: 'gal4', title: 'Assault Railgun', desc: 'Light attack vehicle.', speed: 100, armor: 6, damage: 50, rof: 'High', hull: 550, strong: 'Armored, Railguns', weak: 'Railguns, Aircraft, Cruisers', galFlag: true, image: 'assaultRailgun_gaalsien.jpg' },
                { id: 'gal5', title: 'Sandskimmer', desc: 'Light attack vehicle.', speed: 130, armor: 0, damage: 15, rof: 'Medium', hull: 650, strong: 'Strikecraft, Railguns', weak: 'AAVs, Cruisers', galFlag: true, image: 'sandskimmer_gaalsien.jpg' },
                { id: 'gal6', title: 'Assault Railgun', desc: 'Light attack vehicle.', speed: 100, armor: 6, damage: 50, rof: 'High', hull: 550, strong: 'Armored, Railguns', weak: 'Railguns, Aircraft, Cruisers', galFlag: true, image: 'assaultRailgun_gaalsien.jpg' },
                { id: 'gal7', title: 'Sandskimmer', desc: 'Light attack vehicle.', speed: 130, armor: 0, damage: 15, rof: 'Medium', hull: 650, strong: 'Strikecraft, Railguns', weak: 'AAVs, Cruisers', galFlag: true, image: 'sandskimmer_gaalsien.jpg' },
                { id: 'gal8', title: 'Assault Railgun', desc: 'Light attack vehicle.', speed: 100, armor: 6, damage: 50, rof: 'High', hull: 550, strong: 'Armored, Railguns', weak: 'Railguns, Aircraft, Cruisers', galFlag: true, image: 'assaultRailgun_gaalsien.jpg' },
                { id: 'gal9', title: 'Sandskimmer', desc: 'Light attack vehicle.', speed: 130, armor: 0, damage: 15, rof: 'Medium', hull: 650, strong: 'Strikecraft, Railguns', weak: 'AAVs, Cruisers', galFlag: true, image: 'sandskimmer_gaalsien.jpg' },
                { id: 'gal10', title: 'Assault Railgun', desc: 'Light attack vehicle.', speed: 100, armor: 6, damage: 50, rof: 'High', hull: 550, strong: 'Armored, Railguns', weak: 'Railguns, Aircraft, Cruisers', galFlag: true, image: 'assaultRailgun_gaalsien.jpg' },
            ],
            colUnits: [
                { id: 'col1', title: 'AAV', desc: 'Armored assault vehicle.', speed: 80, armor: 8, damage: 11, rof: 'Very high', hull: 1400, strong: 'Strikecraft', weak: 'Railguns, Cruisers', galFlag: false, image: 'AAV_coalition.jpg' },
                { id: 'col2', title: 'LAV', desc: 'Light attack vehicle.', speed: 110, armor: 0, damage: 15, rof: 'Medium', hull: 550, strong: 'Strikecraft, Railguns', weak: 'Assault Railguns, Cruisers', galFlag: false, image: 'LAV_coalition.jpg' },
                { id: 'col3', title: 'AAV', desc: 'Armored assault vehicle.', speed: 80, armor: 8, damage: 11, rof: 'Very high', hull: 1400, strong: 'Strikecraft', weak: 'Railguns, Cruisers', galFlag: false, image: 'AAV_coalition.jpg' },
                { id: 'col4', title: 'LAV', desc: 'Light attack vehicle.', speed: 110, armor: 0, damage: 15, rof: 'Medium', hull: 550, strong: 'Strikecraft, Railguns', weak: 'Assault Railguns, Cruisers', galFlag: false, image: 'LAV_coalition.jpg' },
                { id: 'col5', title: 'AAV', desc: 'Armored assault vehicle.', speed: 80, armor: 8, damage: 11, rof: 'Very high', hull: 1400, strong: 'Strikecraft', weak: 'Railguns, Cruisers', galFlag: false, image: 'AAV_coalition.jpg' },
                { id: 'col6', title: 'LAV', desc: 'Light attack vehicle.', speed: 110, armor: 0, damage: 15, rof: 'Medium', hull: 550, strong: 'Strikecraft, Railguns', weak: 'Assault Railguns, Cruisers', galFlag: false, image: 'LAV_coalition.jpg' },
                { id: 'col7', title: 'AAV', desc: 'Armored assault vehicle.', speed: 80, armor: 8, damage: 11, rof: 'Very high', hull: 1400, strong: 'Strikecraft', weak: 'Railguns, Cruisers', galFlag: false, image: 'AAV_coalition.jpg' },
                { id: 'col8', title: 'LAV', desc: 'Light attack vehicle.', speed: 110, armor: 0, damage: 15, rof: 'Medium', hull: 550, strong: 'Strikecraft, Railguns', weak: 'Assault Railguns, Cruisers', galFlag: false, image: 'LAV_coalition.jpg' },
                { id: 'col9', title: 'AAV', desc: 'Armored assault vehicle.', speed: 80, armor: 8, damage: 11, rof: 'Very high', hull: 1400, strong: 'Strikecraft', weak: 'Railguns, Cruisers', galFlag: false, image: 'AAV_coalition.jpg' },
                { id: 'col10', title: 'LAV', desc: 'Light attack vehicle.', speed: 110, armor: 0, damage: 15, rof: 'Medium', hull: 550, strong: 'Strikecraft, Railguns', weak: 'Assault Railguns, Cruisers', galFlag: false, image: 'LAV_coalition.jpg' },
            ],
        }
    },
    components: {
        'galUnits': galUnits,
        'coUnits': colUnits,
        'unitSpeed': unitSpeed,
    },
});
