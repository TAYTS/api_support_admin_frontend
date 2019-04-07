import Vue from "vue";
import Router from "vue-router";
import LoginPage from "./views/LoginPage.vue";
import Dashboard from "./views/Dashboard.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/login",
      name: "LoginPage",
      component: LoginPage
    },
    {
      path: "/:jobLevel/:messageID",
      component: Dashboard
    },
    { path: "/", redirect: "/newjobs/0" },
    { path: "/newjobs", redirect: "/newjobs/0" },
    { path: "/myjobs", redirect: "/myjobs/0" },
    { path: "/*", redirect: "/newjobs/0" }
  ]
});
