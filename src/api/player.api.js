import api from "@/utils/request"

export const getPlayersApi = () => {
  return api.post('/player/get_player')
}

export const createPlayerApi = (data) =>{
 return api.post("/player/add_player", data);
}
  
export const updatePlayerApi = (data) =>{
 return api.post(`/player/edit_player`, data);
}

export const deletePlayerApi = (data) =>{
return api.post(`/player/delete_player`,data);
}
  
export const topPlayerApi = (data) =>{
return api.post(`/player/top_player`,data);
}

export const hidePlayerApi = (data) =>{
return api.post(`/player/hide_player`,data);
}