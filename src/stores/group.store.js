import { defineStore } from "pinia";
import {
  setGroupPullDataApi,
  getGroupPullDataApi,
} from "@/api/system.api";

export const useGroupPullStore = defineStore("groupPull", {
  state: () => ({
    loaded: false,
    loading: false,
    setting: {},
  }),

  actions: {
    async fetchSetting() {
      if (this.loaded) return;

      this.loading = true;
      try {
        const { data } = await getGroupPullDataApi();

        this.setting = {
          ...data,
          // normalize backend → frontend
          active: Boolean(data.active),
          auto_send_bet_report: Boolean(data.auto_send_bet_report),
          auto_send_road: Boolean(data.auto_send_road),
          auto_send_settlement_table: Boolean(data.auto_send_settlement_table),
          auto_send_start_img: Boolean(data.auto_send_start_img),
        };

        this.loaded = true;
      } finally {
        this.loading = false;
      }
    },

    async saveSetting(form) {
      this.loading = true;
      try {
        const payload = Object.fromEntries(
          Object.entries(form).map(([k, v]) => [
            k,
            typeof v === "boolean" ? (v ? 1 : 0) : v,
          ]),
        );

        await setGroupPullDataApi(payload);

        // sync store
        this.setting = { ...form };
      } finally {
        this.loading = false;
      }
    },
  },
});
