import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./css/main.css";
import VueTouch from "vue-touch";

Vue.config.productionTip = false;
Vue.use(VueTouch);

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");