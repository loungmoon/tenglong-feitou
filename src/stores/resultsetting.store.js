import { defineStore } from "pinia";
import {
  getLotteryResultApi,
  setLotteryResultApi,
  deskInfo,
} from "@/api/system.api";

export const useResultSettingStore = defineStore("resultSetting", {
  state: () => ({
    loaded: false, // 👈 important: first time only
    loading: false,
    setting: {
      active: false,
      official_website_nickname: "",
      desk_number: "",
      auto_result_report: false,
    },
    info: {
      shoe:null,
      round: null
    }
  }),

  actions: {
    async fetchSetting() {
      if (this.loaded) return;

      this.loading = true;
      try {
        const { data } = await getLotteryResultApi();

        this.setting = {
          active: Boolean(data.active),
          official_website_nickname: data.official_website_nickname || "",
          desk_number: data.desk_number || "",
          auto_result_report: Boolean(data.auto_result_report),
        };

        this.loaded = true;
      } finally {
        this.loading = false;
      }
    },

    async saveSetting(form) {
      this.loading = true;
      try {
        await setLotteryResultApi({
          active: form.active ? 1 : 0,
          official_website_nickname: form.official_website_nickname,
          desk_number: form.desk_number,
          auto_result_report: form.auto_result_report ? 1 : 0,
        });

        // sync store after save
        this.setting = { ...form };
      } finally {
        this.loading = false;
      }
    },

    async getDeskInfo() {
      if (!this.loaded) {
      await this.fetchSetting()
     }
      const deskNumber = this.setting.desk_number;

      if (!deskNumber) return;
      const { data } = await deskInfo({
        desk_number: deskNumber,
      });

      this.info = {
        shoe: data.shoe,
        round: data.round
      }
    },
  },
});
