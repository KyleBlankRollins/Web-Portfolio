var galUnits = Vue.component('gaalsien-units',{
    updated: function() {
        console.log("galUnits updated");
    },
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
        speedHigher: {
            type: Boolean,
            default: true,
        }
    },
    template: '<div> <p class="unit-description"> {{ desc }} </p> <slot></slot> </div>',
});

var colUnits = Vue.component('coalition-units',{
    updated: function() {
        console.log("colUnits updated");
    },
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
        speedHigher: {
            type: Boolean,
            default: false,
        }
    },
    template: '<div> <p class="unit-description"> {{ desc }} </p>  <slot></slot> </div>',
});

var vm = new Vue({
    el: '#app',
    created: function() {
        console.log("App created");
    },
    beforeUpdate: function() {
        console.log("Before App update");
        this.compareStats(); //needs to be called before update for the changes to be rendered.
    },
    updated: function() {
        console.log("App updated");
    },
    data() {
        return {
            showGalMenu: false,
            showColMenu: false,
            galUnits: [
                { id: 'gal1', title: 'Sandskimmer', desc: 'Light attack vehicle.', speed: 130, armor: 0, damage: 15, rof: 'Medium', hull: 650, strong: 'Strikecraft, Railguns', weak: 'AAVs, Cruisers', galFlag: true, image: 'sandskimmer_gaalsien.jpg', current: true,  speedHigher: true, armorHigher: null, damageHigher: null, rofHigher: null, hullHigher: true },

                { id: 'gal2', title: 'Assault Railgun', desc: 'Light attack vehicle.', speed: 100, armor: 6, damage: 50, rof: 'High', hull: 550, strong: 'Armored, Railguns', weak: 'Railguns, Aircraft, Cruisers', galFlag: true, image: 'assaultRailgun_gaalsien.jpg', current: false, speedHigher: null, armorHigher: null, damageHigher: null, rofHigher: null, hullHigher: null },

                { id: 'gal3', title: 'Sandskimmer', desc: 'Light attack vehicle.', speed: 130, armor: 0, damage: 15, rof: 'Medium', hull: 650, strong: 'Strikecraft, Railguns', weak: 'AAVs, Cruisers', galFlag: true, image: 'sandskimmer_gaalsien.jpg', current: false, speedHigher: null, armorHigher: null, damageHigher: null, rofHigher: null, hullHigher: null },

                { id: 'gal4', title: 'Assault Railgun', desc: 'Light attack vehicle.', speed: 100, armor: 6, damage: 50, rof: 'High', hull: 550, strong: 'Armored, Railguns', weak: 'Railguns, Aircraft, Cruisers', galFlag: true, image: 'assaultRailgun_gaalsien.jpg', current: false, speedHigher: null, armorHigher: null, damageHigher: null, rofHigher: null, hullHigher: null },

                { id: 'gal5', title: 'Sandskimmer', desc: 'Light attack vehicle.', speed: 130, armor: 0, damage: 15, rof: 'Medium', hull: 650, strong: 'Strikecraft, Railguns', weak: 'AAVs, Cruisers', galFlag: true, image: 'sandskimmer_gaalsien.jpg', current: false, speedHigher: null, armorHigher: null, damageHigher: null, rofHigher: null, hullHigher: null },

                { id: 'gal6', title: 'Assault Railgun', desc: 'Light attack vehicle.', speed: 100, armor: 6, damage: 50, rof: 'High', hull: 550, strong: 'Armored, Railguns', weak: 'Railguns, Aircraft, Cruisers', galFlag: true, image: 'assaultRailgun_gaalsien.jpg', current: false, speedHigher: null, armorHigher: null, damageHigher: null, rofHigher: null, hullHigher: null },

                { id: 'gal7', title: 'Sandskimmer', desc: 'Light attack vehicle.', speed: 130, armor: 0, damage: 15, rof: 'Medium', hull: 650, strong: 'Strikecraft, Railguns', weak: 'AAVs, Cruisers', galFlag: true, image: 'sandskimmer_gaalsien.jpg', current: false, speedHigher: null, armorHigher: null, damageHigher: null, rofHigher: null, hullHigher: null },

                { id: 'gal8', title: 'Assault Railgun', desc: 'Light attack vehicle.', speed: 100, armor: 6, damage: 50, rof: 'High', hull: 550, strong: 'Armored, Railguns', weak: 'Railguns, Aircraft, Cruisers', galFlag: true, image: 'assaultRailgun_gaalsien.jpg', current: false, speedHigher: null, armorHigher: null, damageHigher: null, rofHigher: null, hullHigher: null },

                { id: 'gal9', title: 'Sandskimmer', desc: 'Light attack vehicle.', speed: 130, armor: 0, damage: 15, rof: 'Medium', hull: 650, strong: 'Strikecraft, Railguns', weak: 'AAVs, Cruisers', galFlag: true, image: 'sandskimmer_gaalsien.jpg', current: false, speedHigher: null, armorHigher: null, damageHigher: null, rofHigher: null, hullHigher: null },

                { id: 'gal10', title: 'Assault Railgun', desc: 'Light attack vehicle.', speed: 100, armor: 6, damage: 50, rof: 'High', hull: 550, strong: 'Armored, Railguns', weak: 'Railguns, Aircraft, Cruisers', galFlag: true, image: 'assaultRailgun_gaalsien.jpg', current: false, speedHigher: null, armorHigher: null, damageHigher: null, rofHigher: null, hullHigher: null },
            ],
            colUnits: [
                { id: 'col1', title: 'AAV', desc: 'Armored assault vehicle.', speed: 80, armor: 8, damage: 11, rof: 'Very high', hull: 1400, strong: 'Strikecraft', weak: 'Railguns, Cruisers', galFlag: false, image: 'AAV_coalition.jpg', current: false, speedHigher: null, armorHigher: null, damageHigher: null, rofHigher: null, hullHigher: null },

                { id: 'col2', title: 'LAV', desc: 'Light attack vehicle.', speed: 110, armor: 0, damage: 15, rof: 'Medium', hull: 550, strong: 'Strikecraft, Railguns', weak: 'Assault Railguns, Cruisers', galFlag: false, image: 'LAV_coalition.jpg', current: true,  speedHigher: false, armorHigher: null, damageHigher: null, rofHigher: null, hullHigher: false },

                { id: 'col3', title: 'AAV', desc: 'Armored assault vehicle.', speed: 80, armor: 8, damage: 11, rof: 'Very high', hull: 1400, strong: 'Strikecraft', weak: 'Railguns, Cruisers', galFlag: false, image: 'AAV_coalition.jpg', current: false, speedHigher: null, armorHigher: null, damageHigher: null, rofHigher: null, hullHigher: null },

                { id: 'col4', title: 'LAV', desc: 'Light attack vehicle.', speed: 110, armor: 0, damage: 15, rof: 'Medium', hull: 550, strong: 'Strikecraft, Railguns', weak: 'Assault Railguns, Cruisers', galFlag: false, image: 'LAV_coalition.jpg', current: false, speedHigher: null, armorHigher: null, damageHigher: null, rofHigher: null, hullHigher: null },

                { id: 'col5', title: 'AAV', desc: 'Armored assault vehicle.', speed: 80, armor: 8, damage: 11, rof: 'Very high', hull: 1400, strong: 'Strikecraft', weak: 'Railguns, Cruisers', galFlag: false, image: 'AAV_coalition.jpg', current: false, speedHigher: null, armorHigher: null, damageHigher: null, rofHigher: null, hullHigher: null },

                { id: 'col6', title: 'LAV', desc: 'Light attack vehicle.', speed: 110, armor: 0, damage: 15, rof: 'Medium', hull: 550, strong: 'Strikecraft, Railguns', weak: 'Assault Railguns, Cruisers', galFlag: false, image: 'LAV_coalition.jpg', current: false, speedHigher: null, armorHigher: null, damageHigher: null, rofHigher: null, hullHigher: null },

                { id: 'col7', title: 'AAV', desc: 'Armored assault vehicle.', speed: 80, armor: 8, damage: 11, rof: 'Very high', hull: 1400, strong: 'Strikecraft', weak: 'Railguns, Cruisers', galFlag: false, image: 'AAV_coalition.jpg', current: false, speedHigher: null, armorHigher: null, damageHigher: null, rofHigher: null, hullHigher: null },

                { id: 'col8', title: 'LAV', desc: 'Light attack vehicle.', speed: 110, armor: 0, damage: 15, rof: 'Medium', hull: 550, strong: 'Strikecraft, Railguns', weak: 'Assault Railguns, Cruisers', galFlag: false, image: 'LAV_coalition.jpg', current: false, speedHigher: null, armorHigher: null, damageHigher: null, rofHigher: null, hullHigher: null },

                { id: 'col9', title: 'AAV', desc: 'Armored assault vehicle.', speed: 80, armor: 8, damage: 11, rof: 'Very high', hull: 1400, strong: 'Strikecraft', weak: 'Railguns, Cruisers', galFlag: false, image: 'AAV_coalition.jpg', current: false, speedHigher: null, armorHigher: null, damageHigher: null, rofHigher: null, hullHigher: null },

                { id: 'col10', title: 'LAV', desc: 'Light attack vehicle.', speed: 110, armor: 0, damage: 15, rof: 'Medium', hull: 550, strong: 'Strikecraft, Railguns', weak: 'Assault Railguns, Cruisers', galFlag: false, image: 'LAV_coalition.jpg', current: false, speedHigher: null, armorHigher: null, damageHigher: null, rofHigher: null, hullHigher: null },
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
                    this.showGalMenu = false;
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
                    this.showColMenu = false;
                } else {                                //07.19 - Limits selection to one unit. May be able to expand to multiple units by re-working.
                this.colUnits[i].current = false;
                };
            });
        },
        compareStats: function() {
            console.log(this.activeColUnit[0].speed);

            if (this.activeColUnit[0].speed > this.activeGalUnit[0].speed) {
                Vue.set(this.activeColUnit[0], 'speedHigher', true);
                Vue.set(this.activeGalUnit[0], 'speedHigher', false);
            } else if (this.activeColUnit[0].speed < this.activeGalUnit[0].speed) {
                Vue.set(this.activeColUnit[0], 'speedHigher', false);
                Vue.set(this.activeGalUnit[0], 'speedHigher', true);
            } else if (this.activeColUnit[0].speed == this.activeGalUnit[0].speed) {
                Vue.set(this.activeColUnit[0], 'speedHigher', null);
                Vue.set(this.activeGalUnit[0], 'speedHigher', null);
            };

            // console.log("Compare stats ran. colSpeedHigher: " + this.activeColUnit[0].speedHigher + " | galSpeedHigher: " + this.activeGalUnit[0].speedHigher);
        },
    },
    watch:{                                     //These work, but I haven't found a good use for them yet.
        activeColUnit: {
            handler(val) {
                console.log("activeColUnit changed!");
                console.log(val);
            },
            deep: true
        },
        activeGalUnit: {
            handler(val) {
                console.log("activeGalUnit changed!");
                console.log(val);
            },
            deep: true
        },
    },
});
