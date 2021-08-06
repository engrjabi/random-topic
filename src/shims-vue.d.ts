declare module "*.vue" {
  import Vue from "vue";
  export default Vue;
}

declare module "*.svg" {
  const content: Svg;
  export default content;
}

declare module "public-google-sheets-parser";
declare module "vue-masonry";
declare module "@saeris/vue-spinners";
declare module "vue-simple-calendar";
declare module "vue-simple-calendar/dist/style.css";
declare module "vue-simple-calendar/static/css/default.css";
declare module "vue-simple-calendar/static/css/holidays-us.css";
