import { defineStore } from "pinia";
import { login as loginApi } from "@/api/login.js";
import router from "@/router";
import { setTokenTime } from "@/utils/auth";

interface State {
  token: string;
}
interface Data {
  email: string;
  id: number;
  mobile: string;
  rid?: number;
  token: string;
  username: string;
}
export const useTokenStore = defineStore({
  id: "token",
  state: (): State => ({
    token: localStorage.getItem("token") || "",
  }),
  //Getter 完全等同于 Store 状态的 计算值。
  getters: {
    //当需要使用其他getters时，可以定义常规函数来通过this访问store实例,但是需要定义返回类型
    // doubleCountPlus(): number {
    //   return this.doubleCount + 1;
    // },
    getToken: (state) => state.token,
  },
  //actions 可以是异步的
  actions: {
    setToken(token: string) {
      this.token = token;
      localStorage.setItem("token", token);
    },
    login(userInfo: object) {
      return new Promise<void>((resolve, reject) => {
        loginApi(userInfo)
          .then((res: Data) => {
            this.setToken(res.token);
            setTokenTime();
            router.replace("/");
            resolve();
          })
          .catch((err: unknown) => {
            reject(err);
          });
      });
    },
    // 退出登陆
    logout() {
      this.setToken(""); //把pinia里的token清空
      localStorage.clear();
      sessionStorage.clear();
      router.replace("/login");
    },
  },
});
