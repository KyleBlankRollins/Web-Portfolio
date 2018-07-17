var units = Vue.component('gal-units',{
    template: '#unit-template',
    data: function () {
        return {
            galSpeedHigher: true,
            galArmorHigher: null,
            galDamageHigher: null,
            galRofHigher: null,
            galHullHigher: true,
            galSpeedHigher: false,
            galArmorHigher: null,
            galDamageHigher: null,
            galRofHigher: null,
            galHullHigher: false,
            Sandskimmer: {
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
            },
            SiegeCruiser: {
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
        }
    },
});

new Vue ({
    el: '#app',
    data: {
        currentGalUnit: "Sandskimmer",
        currentColUnit: "Sandskimmer",
        showGalMenu: false,
        showColMenu: false,
        showTemplate: false,
    }
});
