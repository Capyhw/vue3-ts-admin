import { createApp } from "vue";
import { createPinia, type PiniaPluginContext } from "pinia";

import App from "./App.vue";
import router from "@/router/index";
import "@/router/permission";
import "@/styles/index.scss";
import * as ElIcons from "@element-plus/icons-vue";
import i18n from "@/i18n/index.js";
import SvgIcon from "@/components/SvgIcon/index.vue";
import "virtual:svg-icons-register";
const app = createApp(App);
const pinia = createPinia();

app.component("svg-icon", SvgIcon);

for (const iconName in ElIcons) {
  app.component(iconName, ElIcons[iconName]);
}
app.use(pinia);
app.use(router);
app.use(i18n);

app.mount("#app");
