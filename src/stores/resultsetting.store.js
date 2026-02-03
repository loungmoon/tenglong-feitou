import { defineStore } from "pinia";
import {
  getLotteryResultApi,
  setLotteryResultApi,
  deskInfo,
} from "@/api/system.api";
import { useGroupPullStore } from "@/stores/group.store";

export const useResultSettingStore = defineStore("resultSetting", {
  state: () => ({
    loaded: false,
    loading: false,
    setting: {
      active: false,
      official_website_nickname: "",
      desk_number: "",
      auto_result_report: false,
    },
    info: {
      shoe: null,
      round: null,
    },
  }),

  actions: {
    getGroupNickname() {
      const groupStore = useGroupPullStore();
      const group_nickname = groupStore.setting.group_nickname;

      if (!group_nickname) {
        console.warn("[resultSetting.store] Missing group_nickname");
        return null;
      }

      return group_nickname;
    },

    async ensureReady() {
      if (this.loaded) return;
      await this.fetchSetting();
    },

    async fetchSetting() {
      if (this.loaded) return;

      this.loading = true;
      try {
        const group_nickname = this.getGroupNickname();
        if(!group_nickname) return;

        const { data } = await getLotteryResultApi({
          group_nickname,
        });

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
        const group_nickname = this.getGroupNickname();
        if (!group_nickname) return;

        await setLotteryResultApi({
          group_nickname,
          active: form.active ? 1 : 0,
          official_website_nickname: form.official_website_nickname,
          desk_number: form.desk_number,
          auto_result_report: form.auto_result_report ? 1 : 0,
        });

        this.setting = { ...form };
        this.loaded = true;
      } finally {
        this.loading = false;
      }
    },

    async getDeskInfo() {
      await this.ensureReady();

      const deskNumber = this.setting.desk_number;
      if (!deskNumber) return;

      const { data } = await deskInfo({
        desk_number: deskNumber,
      });

      this.info = {
        shoe: data?.shoe ?? null,
        round: data?.round ?? null,
      };
    },

    reset() {
      this.loaded = false;
      this.setting = {
        active: false,
        official_website_nickname: "",
        desk_number: "",
        auto_result_report: false,
      };
      this.info = { shoe: null, round: null };
    },
  },
});
