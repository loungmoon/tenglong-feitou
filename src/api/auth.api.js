import api from "@/utils/request";

export const loginApi = async (payload) => {
  const res = await api.post("/user/login", payload);

  return res;
}