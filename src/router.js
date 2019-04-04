import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Page1 from "./views/Page1.vue";
import Page2 from "./views/Page2.vue";
import Page3 from "./views/Page3.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/page1",
      name: "page1",
      component: Page1
    },
    {
      path: "/page2",
      name: "page2",
      component: Page2
    },
    {
      path: "/page3",
      name: "page3",
      component: Page3
    }
  ]
});
