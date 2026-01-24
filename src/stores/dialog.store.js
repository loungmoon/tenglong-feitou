import { defineStore } from 'pinia'

export const useDialogStore = defineStore('dialog', {
  state: () => ({
    activeMenu: null,

    server: false,
    mcall: false,
    result: false,
    logout: false,

    odds: false,
    bill: false,
    zero: false,
    all: false,
    table: false,
    chips: false,
    remain: false,
    fonts: false,
    waybill: false,
    station: false,
    copy: false,

    summary: false,
    detail: false,
    bet: false,
    coin: false,

    statistics: false,
    clear: false,
  }),

  actions: {
    open(key) {
      if (key in this.$state) {
        this.activeMenu = key
        this[key] = true
      }
    },
    close(key) {
      this[key] = false
      if(this.activeMenu === key){
        this.activeMenu = null
      }
    },
    clearActive(){
      this.activeMenu = null
    }
  },
})
