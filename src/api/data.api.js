import api from "@/utils/request"

export const queryPlayerDetails = (data) => {
  return api.post("/data_query/player_details_query", data)
}

export const queryPlayerDetailsByNameShoe = (data) =>{
 return  api.post(`/data_query/player_details_query_by_shoe`, data);
}

export const getPlayerBetDataApi = (data) => {
  return api.post('/data_query/get_player_bet_data',data)
}

export const getPlayerScoreDataApi = (data) =>{
return api.post(`/data_query/get_player_score_data`,data);
}
