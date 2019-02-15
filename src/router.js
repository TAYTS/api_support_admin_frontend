import Vue from "vue";
import Router from "vue-router";
<<<<<<< feature/migrate_dashboard
import LoginPage from "./views/LoginPage.vue";
=======
import Home from "./views/Home.vue";
import Dashboard from "./views/Dashboard.vue";
>>>>>>> feature: Add vuetify

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
<<<<<<< feature/migrate_dashboard
      name: "LoginPage",
      component: LoginPage
=======
      name: "dashboard",
      component: Dashboard
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/About.vue")
>>>>>>> feature: Add vuetify
    }
    // {
    //   path: "/about",
    //   name: "about",
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () =>
    //     import(/* webpackChunkName: "about" */ "./views/About.vue")
    // }
  ]
});
