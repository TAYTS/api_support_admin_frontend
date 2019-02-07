import Vue from "vue";
import './plugins/vuetify'
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import "material-design-icons-iconfont/dist/material-design-icons.css";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";

Vue.config.productionTip = false;
Vue.use(Vuetify, {
  basePath: "./assets",
  theme: {
    primary: "#d099ef",
    secondary: "#ffffff",
    accent: "9f2edf",
    background: "a991b6"
  },
  iconfont: "md"
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
