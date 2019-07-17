export default [
  {
    name: "home",
    path: "/",
    component: () => import(/* webpackChunkName: "page--src--pages--index-vue" */ "/home/kyle/Documents/Web-Portfolio/src/pages/Index.vue"),
    meta: {
      data: true
    }
  },
  {
    path: "/posts",
    component: () => import(/* webpackChunkName: "page--src--pages--posts-vue" */ "/home/kyle/Documents/Web-Portfolio/src/pages/Posts.vue")
  },
  {
    path: "/posts/enable-virtualization-in-your-pcs-bios",
    component: () => import(/* webpackChunkName: "page--src--templates--post-vue" */ "/home/kyle/Documents/Web-Portfolio/src/templates/Post.vue"),
    meta: {
      data: true
    }
  },
  {
    name: "404",
    path: "/404",
    component: () => import(/* webpackChunkName: "page--node-modules--gridsome--app--pages--404-vue" */ "/home/kyle/Documents/Web-Portfolio/node_modules/gridsome/app/pages/404.vue")
  },
  {
    name: "*",
    path: "*",
    component: () => import(/* webpackChunkName: "page--node-modules--gridsome--app--pages--404-vue" */ "/home/kyle/Documents/Web-Portfolio/node_modules/gridsome/app/pages/404.vue")
  }
]

