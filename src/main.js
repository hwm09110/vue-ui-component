import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import HtToast from "./components/Toast"

Vue.config.productionTip = false;
Vue.use(HtToast)

import "./assets/css/base.css"

window.vm = new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
