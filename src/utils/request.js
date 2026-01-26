import axios from "axios"
import router from "@/router"

/* token helpers */
export const getToken = () => localStorage.getItem("token")
export const setToken = (token) => token && localStorage.setItem("token", token)
export const clearToken = () => localStorage.removeItem("token")

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000,
})

/* request interceptor */
api.interceptors.request.use((config) => {
  if (!config.url?.includes("/login")) {
    const token = getToken()
    if (token) {
      config.headers.token = token
    }
  }
  return config
})

/* response interceptor */
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const { status, data } = error.response || {}

    if (status === 401 || status === 403) {
      clearToken()

      if (router.currentRoute.value.path !== "/login") {
        router.replace({
          path: "/login",
          query: { redirect: router.currentRoute.value.fullPath },
        })
      }
    }

    return Promise.reject({
      response: {
        data: data || { msg: "请求失败" },
      },
    })
  }
)

export default api
