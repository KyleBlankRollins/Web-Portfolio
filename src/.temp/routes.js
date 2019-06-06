export default [
  {
    path: "/about",
    component: () => import(/* webpackChunkName: "page--src--pages--about-vue" */ "/home/kyle/Projects/netlify-cms/Web-Portfolio/src/pages/About.vue"),
    meta: {
      data: [1,"522cd836"]
    }
  },
  {
    name: "home",
    path: "/",
    component: () => import(/* webpackChunkName: "page--src--pages--index-vue" */ "/home/kyle/Projects/netlify-cms/Web-Portfolio/src/pages/Index.vue"),
    meta: {
      data: [1,"522cd836"]
    }
  },
  {
    name: "404",
    path: "/404",
    component: () => import(/* webpackChunkName: "page--node-modules--gridsome--app--pages--404-vue" */ "/home/kyle/Projects/netlify-cms/Web-Portfolio/node_modules/gridsome/app/pages/404.vue"),
    meta: {
      data: [1,"522cd836"]
    }
  },
  {
    name: "*",
    path: "*",
    component: () => import(/* webpackChunkName: "page--node-modules--gridsome--app--pages--404-vue" */ "/home/kyle/Projects/netlify-cms/Web-Portfolio/node_modules/gridsome/app/pages/404.vue"),
    meta: {
      data: [1,"522cd836"]
    }
  }
]

