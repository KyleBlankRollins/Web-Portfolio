var galUnits = Vue.component('gaalsien-units',{
    props: {
        id: String,
        title: String,
        desc: String,
        speed: Number,
        armor: Number,
        damage: Number,
        rof: String,
        hull: Number,
        strong: String,
        weak: String,
        image: String,
    },
    template: '<div> <p class="unit-description"> {{ desc }} </p> <slot></slot> </div>',
});

var colUnits = Vue.component('coalition-units',{
    props: {
        id: String,
        title: String,
        desc: String,
        speed: Number,
        armor: Number,
        damage: Number,
        rof: String,
        hull: Number,
        strong: String,
        weak: String,
        image: String,
    },
    template: '<div> <p class="unit-description"> {{ desc }} </p>  <slot></slot> </div>',
});

var vm = new Vue({
    el: '#app',
    created: function() {
        console.log("App created");
    },
    updated: function() {
        console.log("App updated");
    },
    data() {
        return {
            showGalMenu: false,
            showColMenu: false,
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
            galUnits: [
                { id: 'gal1', title: 'Sandskimmer', desc: 'Light attack vehicle.', speed: 130, armor: 0, damage: 15, rof: 'Medium', hull: 650, strong: 'Strikecraft, Railguns', weak: 'AAVs, Cruisers', galFlag: true, image: 'sandskimmer_gaalsien.jpg', current: true },
                { id: 'gal2', title: 'Assault Railgun', desc: 'Light attack vehicle.', speed: 100, armor: 6, damage: 50, rof: 'High', hull: 550, strong: 'Armored, Railguns', weak: 'Railguns, Aircraft, Cruisers', galFlag: true, image: 'assaultRailgun_gaalsien.jpg', current: false },
                { id: 'gal3', title: 'Sandskimmer', desc: 'Light attack vehicle.', speed: 130, armor: 0, damage: 15, rof: 'Medium', hull: 650, strong: 'Strikecraft, Railguns', weak: 'AAVs, Cruisers', galFlag: true, image: 'sandskimmer_gaalsien.jpg', current: false },
                { id: 'gal4', title: 'Assault Railgun', desc: 'Light attack vehicle.', speed: 100, armor: 6, damage: 50, rof: 'High', hull: 550, strong: 'Armored, Railguns', weak: 'Railguns, Aircraft, Cruisers', galFlag: true, image: 'assaultRailgun_gaalsien.jpg', current: false },
                { id: 'gal5', title: 'Sandskimmer', desc: 'Light attack vehicle.', speed: 130, armor: 0, damage: 15, rof: 'Medium', hull: 650, strong: 'Strikecraft, Railguns', weak: 'AAVs, Cruisers', galFlag: true, image: 'sandskimmer_gaalsien.jpg', current: false },
                { id: 'gal6', title: 'Assault Railgun', desc: 'Light attack vehicle.', speed: 100, armor: 6, damage: 50, rof: 'High', hull: 550, strong: 'Armored, Railguns', weak: 'Railguns, Aircraft, Cruisers', galFlag: true, image: 'assaultRailgun_gaalsien.jpg', current: false },
                { id: 'gal7', title: 'Sandskimmer', desc: 'Light attack vehicle.', speed: 130, armor: 0, damage: 15, rof: 'Medium', hull: 650, strong: 'Strikecraft, Railguns', weak: 'AAVs, Cruisers', galFlag: true, image: 'sandskimmer_gaalsien.jpg', current: false },
                { id: 'gal8', title: 'Assault Railgun', desc: 'Light attack vehicle.', speed: 100, armor: 6, damage: 50, rof: 'High', hull: 550, strong: 'Armored, Railguns', weak: 'Railguns, Aircraft, Cruisers', galFlag: true, image: 'assaultRailgun_gaalsien.jpg', current: false },
                { id: 'gal9', title: 'Sandskimmer', desc: 'Light attack vehicle.', speed: 130, armor: 0, damage: 15, rof: 'Medium', hull: 650, strong: 'Strikecraft, Railguns', weak: 'AAVs, Cruisers', galFlag: true, image: 'sandskimmer_gaalsien.jpg', current: false },
                { id: 'gal10', title: 'Assault Railgun', desc: 'Light attack vehicle.', speed: 100, armor: 6, damage: 50, rof: 'High', hull: 550, strong: 'Armored, Railguns', weak: 'Railguns, Aircraft, Cruisers', galFlag: true, image: 'assaultRailgun_gaalsien.jpg', current: false },
            ],
            colUnits: [
                { id: 'col1', title: 'AAV', desc: 'Armored assault vehicle.', speed: 80, armor: 8, damage: 11, rof: 'Very high', hull: 1400, strong: 'Strikecraft', weak: 'Railguns, Cruisers', galFlag: false, image: 'AAV_coalition.jpg', current: false },
                { id: 'col2', title: 'LAV', desc: 'Light attack vehicle.', speed: 110, armor: 0, damage: 15, rof: 'Medium', hull: 550, strong: 'Strikecraft, Railguns', weak: 'Assault Railguns, Cruisers', galFlag: false, image: 'LAV_coalition.jpg', current: true },
                { id: 'col3', title: 'AAV', desc: 'Armored assault vehicle.', speed: 80, armor: 8, damage: 11, rof: 'Very high', hull: 1400, strong: 'Strikecraft', weak: 'Railguns, Cruisers', galFlag: false, image: 'AAV_coalition.jpg', current: false },
                { id: 'col4', title: 'LAV', desc: 'Light attack vehicle.', speed: 110, armor: 0, damage: 15, rof: 'Medium', hull: 550, strong: 'Strikecraft, Railguns', weak: 'Assault Railguns, Cruisers', galFlag: false, image: 'LAV_coalition.jpg', current: false },
                { id: 'col5', title: 'AAV', desc: 'Armored assault vehicle.', speed: 80, armor: 8, damage: 11, rof: 'Very high', hull: 1400, strong: 'Strikecraft', weak: 'Railguns, Cruisers', galFlag: false, image: 'AAV_coalition.jpg', current: false },
                { id: 'col6', title: 'LAV', desc: 'Light attack vehicle.', speed: 110, armor: 0, damage: 15, rof: 'Medium', hull: 550, strong: 'Strikecraft, Railguns', weak: 'Assault Railguns, Cruisers', galFlag: false, image: 'LAV_coalition.jpg', current: false },
                { id: 'col7', title: 'AAV', desc: 'Armored assault vehicle.', speed: 80, armor: 8, damage: 11, rof: 'Very high', hull: 1400, strong: 'Strikecraft', weak: 'Railguns, Cruisers', galFlag: false, image: 'AAV_coalition.jpg', current: false },
                { id: 'col8', title: 'LAV', desc: 'Light attack vehicle.', speed: 110, armor: 0, damage: 15, rof: 'Medium', hull: 550, strong: 'Strikecraft, Railguns', weak: 'Assault Railguns, Cruisers', galFlag: false, image: 'LAV_coalition.jpg', current: false },
                { id: 'col9', title: 'AAV', desc: 'Armored assault vehicle.', speed: 80, armor: 8, damage: 11, rof: 'Very high', hull: 1400, strong: 'Strikecraft', weak: 'Railguns, Cruisers', galFlag: false, image: 'AAV_coalition.jpg', current: false },
                { id: 'col10', title: 'LAV', desc: 'Light attack vehicle.', speed: 110, armor: 0, damage: 15, rof: 'Medium', hull: 550, strong: 'Strikecraft, Railguns', weak: 'Assault Railguns, Cruisers', galFlag: false, image: 'LAV_coalition.jpg', current: false },
            ],
        }
    },
    components: {
        'galUnits': galUnits,
        'colUnits': colUnits,
    },
    computed: {
        activeColUnit: function() {
            return this.colUnits.filter(function(u) {
                return u.current                        //07.19Looks through the unit array and filters out units with current:false. Only one unit should have a true value at any given time.
            })
        },
        activeGalUnit: function() {
            return this.galUnits.filter(function(u) {    //07.19Looks through the unit array and filters out units with current:false. Only one unit should have a true value at any given time.
                return u.current
            })
        },
    },
    methods: {
        activeGalSwap: function(element) {
            console.log("activeGalSwap triggered");
            this.galUnits.forEach((e, i) => {
                if (e.id == element.id) {
                    this.galUnits[i].current = true;
                } else {                                //07.19 - Limits selection to one unit. May be able to expand to multiple units by re-working.
                this.galUnits[i].current = false;
                }
            });
        },
        activeColSwap: function(element) {
            console.log("activeColSwap triggered");
            this.colUnits.forEach((e, i) => {
                if (e.id == element.id) {
                    this.colUnits[i].current = true;
                } else {                                //07.19 - Limits selection to one unit. May be able to expand to multiple units by re-working.
                this.colUnits[i].current = false;
                }
            });
        },
        // compareStats: function() {
        //     if (colSpeed > galSpeed) {
        //         this.colSpeedHigher = true;
        //         this.galSpeedHigher = false;
        //     } else if (colSpeed < galSpeed) {
        //         this.colSpeedHigher = false;
        //         this.galSpeedHigher = true;
        //     } else if (colSpeed == galSpeed) {
        //         this.colSpeedHigher = null;
        //         this.galSpeedHigher = null;
        //     }
        //
        //     console.log("Compare stats ran. colSpeedHigher: " + this.colSpeedHigher + "| galSpeedHigher: " + this.galSpeedHigher);
        // },
    },
});
