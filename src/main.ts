import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import PublicGoogleSheetsParser from "public-google-sheets-parser";
import { VueMasonryPlugin } from "vue-masonry";
import VueSmoothScroll from "vue2-smooth-scroll";
import Vue2TouchEvents from "vue2-touch-events";
import VueLazyload from "vue-lazyload";

Vue.config.productionTip = false;

const spreadsheetId = "1Qdl6oePPqalgQS_XZ8voAkRuHH1bwSXtUhBDANsS7Cs";

/// Same root path here vue.config.js
const ghPagePath = "lp-url-redirect";
const linkRedirectCacheKey = "linkRedirectCache";

const path = localStorage.getItem("path");
const vueRouterPaths = ["reservation", "calendar", "more-info"];

const redirectToDefinedUrl = (
  items: { [key: string]: any },
  rootPath: string
) => {
  const urlIndex = items.findIndex((item: any) => {
    return item.path === rootPath;
  });

  if (urlIndex !== -1) {
    window.location.replace(items[urlIndex].link);
    return;
  }
};

if (path && !vueRouterPaths.some((item) => path.includes(item))) {
  const linkRedirectCache = localStorage.getItem(linkRedirectCacheKey);
  localStorage.removeItem("path");
  const rootPath = path.replace(ghPagePath, "").replace("/", "");
  const parser = new PublicGoogleSheetsParser();

  parser.parse(spreadsheetId).then((items: any) => {
    if (items !== null && items.length > 0) {
      try {
        localStorage.setItem(linkRedirectCacheKey, JSON.stringify(items));
      } catch (e) {
        console.log(e);
      }

      redirectToDefinedUrl(items, rootPath);
    }
  });

  setTimeout(() => {
    try {
      if (linkRedirectCache) {
        const linkRedirectCacheParsed = JSON.parse(linkRedirectCache);
        redirectToDefinedUrl(linkRedirectCacheParsed, rootPath);
      }
    } catch (e) {
      console.log(e);
    }
  }, 500);
} else {
  Vue.use(VueMasonryPlugin);
  Vue.use(VueSmoothScroll);
  Vue.use(Vue2TouchEvents);
  Vue.use(VueLazyload);

  const app = new Vue({
    router,
    render: (h) => h(App),
  }).$mount("#app");

  setTimeout(() => {
    if (path && vueRouterPaths.some((item) => path.includes(item))) {
      localStorage.removeItem("path");
      app.$router.push(path);
    }
  }, 1000);
}
