import { defineStore } from "pinia";

export const useAsideStore = defineStore({
  id: "aside",
  state: () => ({
    sideType: true,
  }),
  //Getter 完全等同于 Store 状态的 计算值。
  getters: {
    // getToken: (state) => !state.sideType,
  },
  //actions 可以是异步的
  actions: {
    changeSideType() {
      this.sideType = !this.sideType;
    },
  },
});
