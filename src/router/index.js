import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
    meta: {
      id: "0"
    }
  },
  {
    path: "/samples",
    name: "samples",
    meta: {
      id: "1"
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Samples.vue")
  },
  {
    path: "/web_projects",
    name: "webprojects",
    meta: {
      id: "2"
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/WebProjects.vue")
  }
];

const router = new VueRouter({
  routes
});

export default router;
