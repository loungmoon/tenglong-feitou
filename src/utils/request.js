import axios from "axios";
import router from "@/router";
import { useNotify } from "@/composables/useNotifiy";

/* token helpers */
export const getToken = () => localStorage.getItem("token");
export const setToken = (token) =>
  token && localStorage.setItem("token", token);
export const clearToken = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("group_nickname");
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000,
});

/* request interceptor */
api.interceptors.request.use((config) => {
  if (!config.url?.includes("/login")) {
    const token = getToken();
    if (token) {
      config.headers.token = token;
    }
  }
  return config;
});

/* response interceptor */
api.interceptors.response.use(
  (response) => {
    const data = response.data;

    // handle backend business status
    if (data?.status === 401 || data?.status === 403) {
      clearToken();

      if (router.currentRoute.value.path !== "/login") {
        router.replace({
          path: "/login",
          query: { redirect: router.currentRoute.value.fullPath },
        });
      }
      return Promise.reject(new Error(data.msg || "Unauthorized"));
    }

    if (data.code !== 200) {
      return Promise.reject(new Error(data.msg || "Error"));
    }

    return data;
  },
  (error) => {
    const notify = useNotify();

    if (error.code === "ECONNABORTED") {
      notify.error("请求超时，请稍后重试");
    } else if (!error.response) {
      notify.error("网络异常，请检查网络连接");
    } else {
      notify.error(
        error.response?.data?.msg || "服务器错误"
      );
    }
    return Promise.reject(error);
  },
);

export default api;
