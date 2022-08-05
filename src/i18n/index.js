import { createI18n } from "vue-i18n/dist/vue-i18n.esm-bundler.js";
import EN from "./en.json";
import ZH from "./zh.json";
const messages = {
  en: EN,
  zh: ZH,
};
//根据浏览器判断
const getCurLang = () => {
  const UALang = navigator.language; //'zh-CN'
  const langCode = UALang.indexOf("zh") !== -1 ? "zh" : "en";
  localStorage.setItem("lang", langCode);
  return langCode;
};
//根据localstorage
const getLocal = () => {
  return localStorage.getItem("lang");
};
const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  allowComposition: true,
  locale: getLocal() || getCurLang() || "zh",
  messages: messages,
});

export default i18n;
