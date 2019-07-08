import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    coalition: {
      name: "Coalition",
      "units": {
        "AAV": {
          "name": "AAV",
          "id": 1,
          // "description: -----------"
          "speed": 80,
          "armor": 8,
          "damage": 11,
          "rof": "Very high",
          "hull": 1400,
          "strong": "Strikecraft",
          "weak": "Railguns, Cruisers",
          "image": require("./assets/coalition-units/AAV.jpg")
        },
        "Artillery Cruiser": {
          "name": "Artillery Cruiser",
          "id": 2,
          "speed": 50,
          "armor": 5,
          "damage": 100,
          "rof": "Low",
          "hull": 2500,
          "strong": "Ground units",
          "weak": "Strikecraft, Railguns",
          "image": require("./assets/coalition-units/artillery_cruiser.jpg")
        },
        "Assault Cruiser": {
          "name": "Assault Cruiser",
          "id": 3,
          "speed": 65,
          "armor": 15,
          "damage": 70,
          "rof": "High",
          "hull": 2700,
          "strong": "Ground units",
          "weak": "Aircraft, Railguns",
          "image": require("./assets/coalition-units/assault_cruiser.jpg")
        },
        "Baserunner": {
          "name": "Baserunner",
          "id": 4,
          "speed": 65,
          "armor": 2,
          "damage": 5,
          "rof": "Medium",
          "hull": 3350,
          "strong": "N/A",
          "weak": "Everything",
          "image": require("./assets/coalition-units/baserunner.jpg")
        },
        "Battle Cruiser": {
          "name": "Battle Cruiser",
          "id": 5,
          "speed": 50,
          "armor": 25,
          "damage": 300,
          "rof": "Low",
          "hull": 6500,
          "strong": "Ground units",
          "weak": "Railguns, Aircraft, Strikecraft",
          "image": require("./assets/coalition-units/battle_cruiser.jpg")
        },
        "Carrier": {
          "name": "Carrier",
          "id": 6,
          "speed": 60,
          "armor": 25,
          "damage": 10,
          "rof": "Very low",
          "hull": 15000,
          "strong": "None",
          "weak": "Railguns, Cruisers",
          "image": require("./assets/coalition-units/carrier.jpg")
        },
        "Gunship": {
          "name": "Gunship",
          "id": 7,
          "speed": 375,
          "armor": 10,
          "damage": 15,
          "rof": "Very high",
          "hull": 1050,
          "strong": "Ground units",
          "weak": "Anti-air, Interceptors",
          "image": require("./assets/coalition-units/gunship.jpg")
        },
        "LAV": {
          "name": "LAV",
          "id": 8,
          "speed": 110,
          "armor": 0,
          "damage": 15,
          "rof": "Medium",
          "hull": 500,
          "strong": "Strikecraft, Railguns",
          "weak": "AAVs, Cruisers",
          "image": require("./assets/coalition-units/LAV.jpg")
        },
        "Missile Battery": {
          "name": "Missile Battery",
          "id": 9,
          "speed": 50,
          "armor": 5,
          "damage": 250,
          "rof": "Low",
          "hull": 1800,
          "strong": "Aircraft",
          "weak": "Ground units",
          "image": require("./assets/coalition-units/missile_battery.jpg")
        },
        "Railgun": {
          "name": "Railgun",
          "id": 10,
          "speed": 66,
          "armor": 3,
          "damage": 225,
          "rof": "Medium",
          "hull": 675,
          "strong": "Armored, Railguns",
          "weak": "Railguns, Aircraft, Cruisers",
          "image": require("./assets/coalition-units/railgun.jpg")
        },
        "Salvager": {
          "name": "Salvager",
          "id": 11,
          "speed": 75,
          "armor": 5,
          "damage": 0,
          "rof": "N/A",
          "hull": 900,
          "strong": "N/A",
          "weak": "Everything",
          "image": require("./assets/coalition-units/salvager.jpg")
        },
        "Strike Fighter": {
          "name": "Strike Fighter",
          "id": 12,
          "speed": 435,
          "armor": 1,
          "damage": 120,
          "rof": "Low",
          "hull": 650,
          "strong": "Ground units",
          "weak": "Anti-air, Interceptors, Strikecraft",
          "image": require("./assets/coalition-units/strike_fighter.jpg")
        },
        "Tactical Bomber": {
          "name": "Tactical Bomber",
          "id": 13,
          "speed": 370,
          "armor": 15,
          "damage": 2500,
          "rof": "Low",
          "hull": 1050,
          "strong": "Ground units",
          "weak": "Anti-air, Interceptors, Strikecraft",
          "image": require("./assets/coalition-units/tactical_bomber.jpg")
        },
        "Support Cruiser": {
          "name": "Support Cruiser",
          "id": 14,
          "speed": 70,
          "armor": 2,
          "damage": 1,
          "rof": "Low",
          "hull": 4100,
          "strong": "N/A",
          "weak": "Evertyhing",
          "image": require("./assets/coalition-units/support_cruiser.jpg")
        }
      }
    },
    "gaalsien": {
      "name": "Gaalsien",
      "units": {
        "Assault Railgun": {
          "name": "Assault Railgun",
          "id": 1,
          "speed": 100,
          "armor": 6,
          "damage": 50,
          "rof": "High",
          "hull": 550,
          "strong": "Armored, Railguns",
          "weak": "Railguns, Aircraft, Cruisers",
          "image": require("./assets/gaalsien-units/assault_railgun.jpg")
        },
        "Assault Ship": {
          "name": "Assault Ship",
          "id": 2,
          "speed": 70,
          "armor": 6,
          "damage": 24,
          "rof": "Medium",
          "hull": 1400,
          "strong": "Strikecraft",
          "weak": "Railguns, Cruisers",
          "image": require("./assets/gaalsien-units/assault_ship.jpg")
        },
        "Baserunner": {
          "name": "Baserunner",
          "id": 3,
          "speed": 70,
          "armor": 2,
          "damage": 5,
          "rof": "Low",
          "hull": 3350,
          "strong": "N/A",
          "weak": "Everything",
          "image": require("./assets/gaalsien-units/baserunner.jpg")
        },
        "Carrier": {
          "name": "Carrier",
          "id": 4,
          "speed": 10,
          "armor": 40,
          "damage": 10,
          "rof": "Very low",
          "hull": 12500,
          "strong": "N/A",
          "weak": "Railguns, Cruisers",
          "image": require("./assets/gaalsien-units/carrier.jpg")
        },
        "Heavy Railgun": {
          "name": "Heavy Railgun",
          "id": 5,
          "speed": 62,
          "armor": 3,
          "damage": 225,
          "rof": "Medium",
          "hull": 620,
          "strong": "Armored, Railguns",
          "weak": "Railguns, Aircraft, Cruisers",
          "image": require("./assets/gaalsien-units/heavy_railgun.jpg")
        },
        "Honorguard Cruiser": {
          "name": "Honorguard Cruiser",
          "id": 6,
          "speed": 60,
          "armor": 6,
          "damage": 400,
          "rof": "Medium",
          "hull": 3600,
          "strong": "Ground units",
          "weak": "Aircraft, Railguns",
          "image": require("./assets/gaalsien-units/honorguard_cruiser.jpg")
        },
        "Interceptor": {
          "name": "Interceptor",
          "id": 7,
          "speed": 435,
          "armor": 1,
          "damage": 150,
          "rof": "Medium",
          "hull": 475,
          "strong": "Ground units",
          "weak": "Anti-air, Interceptors, Strikecraft",
          "image": require("./assets/gaalsien-units/interceptor.jpg")
        },
        "Missile Ship": {
          "name": "Missile Ship",
          "id": 8,
          "speed": 55,
          "armor": 5,
          "damage": 250,
          "rof": "Low",
          "hull": 1800,
          "strong": "Aircraft",
          "weak": "Ground units",
          "image": require("./assets/gaalsien-units/missile_ship.jpg")
        },
        "Precision Bomber": {
          "name": "Precision Bomber",
          "id": 9,
          "speed": 550,
          "armor": 15,
          "damage": 1000,
          "rof": "Low",
          "hull": 1250,
          "strong": "Ground units",
          "weak": "Anti-air, Interceptors, Strikecraft",
          "image": require("./assets/gaalsien-units/precision_bomber.jpg")
        },
        "Production Cruiser": {
          "name": "Production Cruiser",
          "id": 10,
          "speed": 70,
          "armor": 5,
          "damage": 20,
          "rof": "Low",
          "hull": 4100,
          "strong": "N/A",
          "weak": "Everything",
          "image": require("./assets/gaalsien-units/production_cruiser.jpg")
        },
        "Salvager": {
          "name": "Salvager",
          "id": 11,
          "speed": 75,
          "armor": 2,
          "damage": 0,
          "rof": "N/A",
          "hull": 900,
          "strong": "N/A",
          "weak": "Everything",
          "image": require("./assets/gaalsien-units/salvager.jpg")
        },
        "Sandskimmer": {
          "name": "Sandskimmer",
          "id": 12,
          "speed": 130,
          "armor": 0,
          "damage": 15,
          "rof": "Medium",
          "hull": 650,
          "strong": "Strikecraft, Railguns",
          "weak": "AAVs, Cruisers",
          "image": require("./assets/gaalsien-units/sandskimmer.jpg")
        },
        "Siege Cruiser": {
          "name": "Siege Cruiser",
          "id": 13,
          "speed": 55,
          "armor": 3,
          "damage": 100,
          "rof": "Low",
          "hull": 2500,
          "strong": "Ground units",
          "weak": "Strikecraft, Railguns",
          "image": require("./assets/gaalsien-units/siege_cruiser.jpg")
        }
      }
    }
  },
  getters: {
    colUnits: state => {
      return state.coalition;
    },
    galUnits: state => {
      return state.gaalsien;
    }
  },
  mutations: {},
  actions: {}
});