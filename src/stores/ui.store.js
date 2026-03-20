// stores/ui.store.js
import { defineStore } from "pinia"

export const useUiStore = defineStore("ui", {
  state: () => ({
    betTableEl: null,
    scoreTableEl: null,

    totals: {
      total_score: 0,
      total_raw_score: 0,
    },
    scores: [],

    selectedScore: {
      userName: "",
      score: 0,
      raw_score: 0,
    }
  }),

  actions: {
    setTotals(data){
      this.totals = data;
    },

    setScores(data){
      this.scores = data;
    },

    setSelectedScore(data) {
      this.selectedScore = data;
    },

    resetTotals(){
      this.totals = {
        total_score: 0,
        total_raw_score: 0,
      }
    }
  },

  getters: {
    // quick lookup map for fast access by name
    scoreMap: (state) => {
      const map = {};
      state.scores.forEach((s) => {
        map[s.name] = s;
      });
      return map;
    }
  }
})
