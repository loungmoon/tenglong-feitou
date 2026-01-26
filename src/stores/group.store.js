import { defineStore } from "pinia";
import {
  setGroupPullDataApi,
  getGroupPullDataApi,
} from "@/api/system.api";

export const useGroupPullStore = defineStore("groupPull", {
  state: () => ({
    loading: false,
    setting: {},
  }),

  actions: {
    async fetchSetting() {
      this.loading = true;
      try {
        const res = await getGroupPullDataApi();

        // 🔥 MUST extract first item
        const row = res.data?.[0] ?? {};

        // 🔥 normalize ALL booleans
        const normalized = {};

        Object.keys(row).forEach((key) => {
          if (key.startsWith("auto_send_") || key === "active") {
            normalized[key] = Boolean(row[key]);
          } else {
            normalized[key] = row[key];
          }
        });

        this.setting = normalized;
      } finally {
        this.loading = false;
      }
    },

    async saveSetting(form) {
      this.loading = true;
      try {
        // 🔥 convert boolean → 0/1 for backend
        const payload = {};

        Object.entries(form).forEach(([k, v]) => {
          payload[k] = typeof v === "boolean" ? (v ? 1 : 0) : v;
        });

        await setGroupPullDataApi(payload);

        // 🔥 keep store in FRONTEND format
        this.setting = { ...form };
      } finally {
        this.loading = false;
      }
    },
  },
});
