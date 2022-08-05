import { defineStore } from "pinia";

export const useLangStore = defineStore({
  id: "lang",
  state: () => ({
    lang: localStorage.getItem("lang") || "zh",
  }),
  getters: {},
  actions: {
    changLang(lang: string) {
      this.lang = lang;
    },
  },
});
