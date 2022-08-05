import router from "./index";
import { useTokenStore } from "@/stores/token";

//白名单
const whiteList = ["/login"];
router.beforeEach((to, from, next) => {
  const tokenStore = useTokenStore();
  if (tokenStore.getToken) {
    if (to.path === "/login") {
      next("/");
    } else {
      next();
    }
  } else if (whiteList.includes(to.path)) {
    next();
  } else {
    next("/login");
  }
});
