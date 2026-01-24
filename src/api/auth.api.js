import api,{setToken} from "@/utils/request";

export const loginApi = async (payload) => {
  const res = await api.post("/user/login", payload);

  // backend returns { userId, token, account, enable }
  setToken(res.data.token);

  return res;
}