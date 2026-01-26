// stores/ui.store.js
import { defineStore } from "pinia"

export const useUiStore = defineStore("ui", {
  state: () => ({
    betTableEl: null,
    scoreTableEl: null,
  }),
})
