//stores/group.store.js
import { defineStore } from "pinia";
import { getGroupPullDataApi, setGroupPullDataApi } from "@/api/system.api";

const STORAGE_KEY = "group_nickname";

function getCachedNickname() {
  return localStorage.getItem(STORAGE_KEY) || "";
}

function setCachedNickname(nickname) {
  if (nickname) {
    localStorage.setItem(STORAGE_KEY, nickname);
  }
}

function normalizeResponse(row = {}) {
  const normalized = {};

  Object.entries(row).forEach(([key, value]) => {
    normalized[key] =
      key.startsWith("auto_send_") || key === "active" ? Boolean(value) : value;
  });

  return normalized;
}

export const useGroupPullStore = defineStore("group", {
  state: () => ({
    loading: false,
    isFetched: false,

    setting: {
      group_nickname: getCachedNickname(),
    },
  }),

  getters: {
    isReady: (state) => !!state.setting.group_nickname && state.isFetched,
  },

  actions: {
    async fetchSetting({ force = false } = {}) {
      if (this.isFetched && !force) return;

      const nickname = this.setting.group_nickname;

      if (!nickname) {
        this.isFetched = true;
        return;
      }

      this.loading = true;

      try {
        const res = await getGroupPullDataApi({
          group_nickname: nickname,
        });

        const row = res.data?.[0] || null;
        if (!row) {
          this.isFetched = true;
          return;
        }

        const normalized = normalizeResponse(row);

        this.setting = {
          ...this.setting,
          ...normalized,
        };

        setCachedNickname(this.setting.group_nickname);

        this.isFetched = true;
      } finally {
        this.loading = false;
      }
    },

    async ensureReady() {
      if (this.isFetched) return;
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

        this.setting = {
          ...this.setting,
          ...form,
        };

        setCachedNickname(form.group_nickname);
        this.isFetched = true;
      } finally {
        this.loading = false;
      }
    },

    async reload() {
      this.isFetched = false;
      await this.fetchSetting(true);
    },

    reset() {
      this.$reset();
      localStorage.removeItem(STORAGE_KEY);
    },
  },
});
