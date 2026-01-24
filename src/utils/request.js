import axios from "axios";
import router from "@/router";

/* token helpers */
const getToken = () => localStorage.getItem("token");
const setToken = (token) => localStorage.setItem("token", token);

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  // timeout: 15000,
});

/* request interceptor */
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    // config.headers.Authorization = `Bearer ${token}`;
    config.headers.token = token;
  }
  return config;
});

/* response interceptor */
api.interceptors.response.use(
  (response) => {
    const res = response.data;

     if (res.status === 403 || res.status === 401) {
      localStorage.removeItem("token");

      if (router.currentRoute.value.path !== "/login") {
        router.replace({
          path: "/login",
          query: { redirect: router.currentRoute.value.fullPath },
        });
      }

      return Promise.reject(res.msg);
    }

    return res;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export { setToken };
export default api;
