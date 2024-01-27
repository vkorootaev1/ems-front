import { createApp } from "vue";
import App from "./App.vue";
import { router } from "@/router";
import { createPinia } from "pinia";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "vue-loading-overlay/dist/css/index.css";
import { useLoadingStore } from "@/stores/LoadingStore";
import { useUserStore } from "@/stores/UserStore";
import { useNotificationStore } from "@/stores/NotificationsStore";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import { vue3Debounce } from "vue-debounce";

import {
  faCaretDown,
  faCalendarDays,
  faStar,
  faTable,
  faBox,
  faUser,
  faCircle,
  faEnvelope,
  faFileArrowDown,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";

import {
  faTelegram,
  faViber,
  faYoutube,
  faWhatsapp,
  faVk,
} from "@fortawesome/free-brands-svg-icons";

library.add(
  faCaretDown,
  faCalendarDays,
  faStar,
  faTable,
  faBox,
  faUser,
  faCircle,
  faTelegram,
  faViber,
  faYoutube,
  faWhatsapp,
  faVk,
  faEnvelope,
  faFileArrowDown,
  faCheck
);

loadFonts();

const app = createApp(App);
app.component("font-awesome-icon", FontAwesomeIcon);

const pinia = createPinia();
app.use(router);
app.use(pinia);
app.use(vuetify);

const userStore = useUserStore();
const loadingStore = useLoadingStore();
const notificationStore = useNotificationStore();

app.provide("$userStore", userStore);
app.provide("$loadingStore", loadingStore);
app.provide("$notificationStore", notificationStore);

app.directive("debounce", vue3Debounce({ lock: true }));

app.mount("#app");
