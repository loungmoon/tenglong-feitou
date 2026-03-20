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

export const getRemainScoreSummary = (data) => {
return api.post(`/data_query/get_remaining_score_summary`,data);
}

export const getPlayerDetailsQuery = (data) => {
return api.post(`/data_query/player_details_query_by_round`,data);
}

export const getBetDetailsByName =(data) => {
return api.post(`/data_query/bet_details_query_by_name`,data);
}

export const getStatisticSBPercentage = (data) => {
  return api.post(`/data_query/statistics_sb_percentage_by_shoe`,data)
}