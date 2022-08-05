import axios from "axios";
import { diffTokenTime } from "@/utils/auth";
import { useTokenStore } from "@/stores/token";
const service = axios.create({
  baseURL: `${import.meta.env.VITE_APP_BASE_API}`,
  timeout: 5000,
});
service.interceptors.request.use(
  (config) => {
    if (localStorage.getItem("token")) {
      if (diffTokenTime()) {
        const tokenStore = useTokenStore();
        tokenStore.logout();
        // eslint-disable-next-line no-undef
        ElMessage({
          showClose: true,
          message: "tokon失效了",
          type: "error",
        });
        return Promise.reject(new Error("tokon失效了"));
      }
    }
    config.headers.Authorization = localStorage.getItem("token");
    return config;
  },
  (error) => {
    return Promise.reject(new Error(error)).catch((e) => {
      console.log(e);
    });
  }
);
service.interceptors.response.use((res) => {
  const { data, meta } = res.data;
  if (meta.status === 200 || meta.status === 201) {
    return data;
  } else {
    // eslint-disable-next-line no-undef
    ElMessage({
      showClose: true,
      message: meta.msg,
      type: "error",
    });
    return Promise.reject(new Error(meta.msg));
  }
});
export default service;
