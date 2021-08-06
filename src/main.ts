import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import Vue2TouchEvents from "vue2-touch-events";

Vue.config.productionTip = false;

const path = localStorage.getItem("path");
const vueRouterPaths: any[] = [];

Vue.use(Vue2TouchEvents);

const app = new Vue({
    router,
    render: (h) => h(App),
}).$mount("#app");

setTimeout(() => {
    if (path && vueRouterPaths.some((item) => path.includes(item))) {
      localStorage.removeItem("path");
      app.$router.push(path);
}}, 1000);
