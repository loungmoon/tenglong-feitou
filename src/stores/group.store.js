import { defineStore } from "pinia";
import {
  setGroupPullDataApi,
  getGroupPullDataApi,
} from "@/api/system.api";

const STORAGE_KEY = "group_nickname";

export const useGroupPullStore = defineStore("groupPull", {
  state: () => ({
    loading: false,
    loaded: false, // ✅ prevent duplicate API calls

    setting: {
      group_nickname: localStorage.getItem(STORAGE_KEY) || "",
    },
  }),

  getters: {
    isReady: (state) =>!!state.setting.group_nickname && state.loaded,
  },

  actions: {
    restoreNickname() {
      if (!this.setting.group_nickname) {
        this.setting.group_nickname =
          localStorage.getItem(STORAGE_KEY) || "";
      }
    },

    async fetchSetting(force = false) {
      // ✅ already loaded → skip
      if (this.loaded && !force) return;

      this.restoreNickname();
      if (!this.setting.group_nickname) return;

      this.loading = true;
      try {
        const res = await getGroupPullDataApi({
          group_nickname: this.setting.group_nickname,
        });

        const row = res.data?.[0];
        if (!row) return;

        // persist nickname
        if (row.group_nickname) {
          localStorage.setItem(STORAGE_KEY, row.group_nickname);
        }

        const normalized = {};
        for (const [key, value] of Object.entries(row)) {
          normalized[key] =
            key.startsWith("auto_send_") || key === "active"
              ? Boolean(value)
              : value;
        }

        this.setting = {
          ...this.setting,
          ...normalized,
        };

        this.loaded = true; // mark as loaded
      } finally {
        this.loading = false;
      }
    },

    async ensureReady() {
      if (this.loaded) return;
      await this.fetchSetting();
    },

    async saveSetting(form) {
      this.loading = true;
      try {
        const payload = {};
        for (const [k, v] of Object.entries(form)) {
          payload[k] = typeof v === "boolean" ? (v ? 1 : 0) : v;
        }

        await setGroupPullDataApi(payload);

      
        if (form.group_nickname) {
          localStorage.setItem(STORAGE_KEY, form.group_nickname);
        }

        this.setting = {
          ...this.setting,
          ...form,
        };

      } finally {
        this.loading = false;
      }
    },

    async reload() {
      this.loaded = false;
      await this.fetchSetting(true);
    },
  },
});
