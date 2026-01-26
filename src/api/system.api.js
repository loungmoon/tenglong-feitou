import api from "@/utils/request"

export const setGroupPullDataApi = (data) =>{
 return api.post("/system/group_pull_data_setup", data);
}

export const getGroupPullDataApi = (data) =>{
 return  api.post(`/system/get_group_pull_data_setup`, data);
}

export const setLotteryResultApi = (data) => {
  return api.post('/system/auto_lottery_setup',data)
}

export const getLotteryResultApi = (data) =>{
return api.post(`/system/get_auto_lottery_setup`,data);
}
  
export const setParameter = (data) =>{
return api.post(`/system/parameter_setup`,data);
}

export const getPersonalParameter = (data) =>{
return api.post(`/system/get_personal_parameter`,data);
}

export const setPersonalParameter = (data) =>{
return api.post(`/system/personal_parameter_setup`,data);
}

export const editDeskNickname = (data) => {
  return api.post('/system/edit_desk_nickname',data)
}

export const initDeskCoin = (data) => {
  return api.post('/system/init_desk_coin',data)
}

export const synchronizePoints = (data) => {
  return api.post('/system/synchronize_points',data)
}

export const deskInfo = (data) => {
  return api.post('/data_query/get_desk_info',data);
}