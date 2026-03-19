// stores/ui.store.js
import { defineStore } from "pinia"

export const useUiStore = defineStore("ui", {
  state: () => ({
    betTableEl: null,
    scoreTableEl: null,

    totals: {
      total_score: 0,
      total_raw_score: 0,
    }
  }),

  actions: {
    setTotals(data){
      this.totals = data;
    },

    resetTotals(){
      this.totals = {
        total_score: 0,
        total_raw_score: 0,
      }
    }
  }
})
