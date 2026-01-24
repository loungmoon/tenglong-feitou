import api from "@/utils/request"

export const proceedNextShoeApi = () => {
  return api.post('/opt/proceed_next_shoe')
}

export const nextRoundApi = (data) =>{
 return api.post("/opt/next_round", data);
}
  
export const drawLotteryApi = (data) =>{
 return  api.post(`/opt/lottery_draw`, data);
}

export const editShoeApi = (data) =>{
return api.post(`/opt/edit_shoe`,data);
}
  
export const uploadImageApi = (formData) =>{
return api.post(`/opt/upload`,formData,{
  headers: {
      "Content-Type": "multipart/form-data",
    },
});
}

export const sendBetReportImageApi = (data) =>{
return api.post(`/opt/send_bet_report_image`,data);
}

export const sendScoreReportImageApi = (data) =>{
return api.post(`/opt/send_score_report_image`,data);
}
