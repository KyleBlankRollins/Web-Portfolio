import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    currentGalUnit: {
      "name": "Sandskimmer",
      "id": 12,
      "description": "Sandskimmers are light attack vehicles. Because they're small and light (no armor), they're very fast—great for harassing resource lines. In a 1:1 fight, a Sandskimmer will beat a Coalition LAV because it’s faster and has a stronger hull.",
      "speed": 130,
      "armor": 0,
      "damage": 15,
      "rof": "Medium",
      "hull": 650,
      "strong": "Strikecraft, Railguns",
      "weak": "AAVs, Cruisers",
      "image": require("./assets/gaalsien-units/sandskimmer.jpg")
    },
    currentColUnit: {
      "name": "LAV",
      "id": 8,
      "description": "Light attack vehicles (LAVs) are fast and nimble. Use them to hit resource operations or disrupt rail cannon lines.",
      "speed": 110,
      "armor": 0,
      "damage": 15,
      "rof": "Medium",
      "hull": 500,
      "strong": "Strikecraft, Railguns",
      "weak": "AAVs, Cruisers",
      "image": require("./assets/coalition-units/LAV.jpg")
    },
    coalition: {
      name: "Coalition",
      "units": {
        "AAV": {
          "name": "AAV",
          "id": 1,
          "description": "As you might expect from its name, the Armored Assault Vehicle has solid armor – particularly when compared to its Gaalsien counterpart, the Assault Ship.",
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
          "description": "Compared to the Gaalsien Seige Cruiser, the Artillery Cruiser trades 10% speed for 40% more armor. That should give it enough durability to make up for its relatively slower speed.",
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
          "description": "This is your all-around generalist cruiser. The Assault Cruiser has moderate amounts of everything. Because of this, it doesn’t excel in any situation, but it is also useful for almost anything you’re doing.",
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
          "description": "Utility. That’s what the Baserunner brings your forces. It’s relatively fast for a larger unit and has plenty of abilities that help take and hold territory.",
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
          "description": "Built to take a beating, the Battle Cruiser can be the vanguard of your advances – just make sure its slow speed doesn’t hamper you too much. While this behemoth can handle many things on its own, you should send a compliment of LAVs along with it to screen long-range opposition.",
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
          "description": "The largest and most durable Coalition unit. Advanced power systems allow you to choose between fleet management and the Carrier’s own fighting abilities.",
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
          "description": "Massive air-borne autocannon? That’s what the Gunship brings to your forces. It’s highly effective against all ground units, but watch out for Missile Ships or other air defenses.",
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
          "description": "",
          "description": "Light attack vehicles (LAVs) are fast and nimble. Use them to hit resource operations or disrupt rail cannon lines.",
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
          "description": "You’ll want to take a couple of these with you everywhere in the mid- to late-game. They’re essential for taking out air-borne units before they do too much damage.",
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
          "description": "The Coalition Railgun is slightly faster and more durable than the Gaalsien Heavy Railgun – giving it the edge. Just make sure that it has support because if anything gets close, this unit won’t last long.",
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
          "description": "The workhorse of your fleet, nothing else can happen without diligently-working Salvagers. Coalition Salvagers have significantly more armor than their Gaalsien counterparts, which makes them a bit harder to harass.",
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
          "description": "The extremely fast Strike Fighter serves as an air-superiority unit, with better durability than its Gaalsien counterpart, the Interceptor. Clear the skies and maintain control of your airspace with judicious use.",
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
          "description": "Sheer stopping power. The Tactical Bomber sacrifices both speed and durability in favor of bigger booms. If you can get these units to their targets, there won’t be much left standing.",
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
          "description": "The Support Cruiser is your Salvagers’ home away from home. Used mainly for remote resourcing operations, the Support Cruiser can also serve in a fleet repair role.",
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
          "description": "The Assault Railgun is a speedy and compact powerhouse. It will make short work of anything smaller than a cruiser – except for Light Attack Vehicles.",
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
          "description": "In an unusual trade off for the Gaalsien, the Assault Ship favors slower, more powerful salvos over quick strikes.",
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
          "description": "The Gaalsien Baserunner is very similar to its Coalition counterpart. It serves a fleet support role, giving you tools to take and hold territory.",
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
          "description": "Compared to its Coalition counterpart, the Gaalsien Carrier has nearly 40% more armor, but is far slower and has about 20% less durability.",
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
          "description": "The Heavy Railgun is a long-range killer. Its high damage and respectable rate of fire make it a significant threat to cruisers. However, it’s at a serious disadvantage at close range.",
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
          "description": "With truly impressive firepower, the Honorguard Cruiser is a game changer when it hits the scene. Its major weakness is a lack of armor.",
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
          "description": "The Interceptor is very fast, but has less durability than its Coalition counterpart. Deploy Interceptor to harass opposition forces and maintain air control.",
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
          "description": "Don’t go far without a Missile Ship in your fleet. They’re crucial for denying your opponents air control. Surprisingly durable for a small unit, it will decimate air units in its range.",
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
          "description": "Speed brings the Precision Bomber to its targets reliably. While its damage is much lower than its Coalition counterpart, helps keep it just ahead of anti-air defenses.",
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
          "description": "The Production Cruiser is a remote resource controller, giving Salvagers a place to drop their raw materials. It also serves as a secondary unit factory.",
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
          "description": "Salvagers are essential to your fleet operations. Without the resources they bring in, your fleet production will grind to a standstill.",
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
          "description": "",
          "description": "Sandskimmers are light attack vehicles. Because they're small and light (no armor), they're very fast—great for harassing resource lines. In a 1:1 fight, a Sandskimmer will beat a Coalition LAV because it’s faster and has a stronger hull.",
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
          "description": "The Siege Cruiser rains explosives from above. It can be devastating to clumps of units – particularly if they’re stationary.",
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
    },
    currentUnits: state => {
      return {
        currentColUnit: state.currentColUnit,
        currentGalUnit: state.currentGalUnit
      }
    }
  },
  mutations: {
    setGalUnit: (state, payload) => {
      state.currentGalUnit = payload;
    },
    setColUnit: (state, payload) => {
      state.currentColUnit = payload;
    }
  },
  actions: {}
});