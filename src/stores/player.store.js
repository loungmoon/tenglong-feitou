import { defineStore } from "pinia";
import { watch } from "vue";
import { useGroupPullStore } from "@/stores/group.store";
import {
  getPlayersApi,
  createPlayerApi,
  deletePlayerApi,
  updatePlayerApi,
  topPlayerApi,
  hidePlayerApi,
} from "@/api/player.api";

export const usePlayerStore = defineStore("player", {
  state: () => ({
    list: [],
    selected: null,
    loading: false,
    loaded: false,
  }),

  getters: {
    nameList: (state) => state.list.map((p) => p.playername),
    userList: (state) => state.list.filter((p) => p.is_hide === 0),
  },

  actions: {
    async getGroupPayload(extra = {}) {
      const groupStore = useGroupPullStore();

      const group_nickname = groupStore.setting.group_nickname;
      if (!group_nickname) {
        console.warn("[player.store] Missing group_nickname");
        return null;
      }

      return {
        ...extra,
        group_nickname,
      };
    },

    async fetchPlayers(force = false) {
      this.loading = true;

      try {
        const payload = await this.getGroupPayload();
        if (!payload) return;

        if (this.list.length && !force) return;

        const res = await getPlayersApi(payload);

        this.list = res?.data || [];
        if (!this.selected && this.list.length) {
          this.selected = this.list[0];
        }
      } catch (err) {
        console.error("[player.store] fetchPlayers failed", err);
        this.list = [];
        this.selected = null;
      } finally {
        this.loading = false;
      }
    },

    setSelectedByName(name) {
      this.selected = this.list.find((p) => p.playername === name) || null;
    },

    async createPlayer(form) {
      this.loading = true;
      try {
        const payload = await this.getGroupPayload(form);
        if (!payload) return;

        await createPlayerApi(payload);
        await this.fetchPlayers(true);
      } finally {
        this.loading = false;
      }
    },

    async updatePlayer(form) {
      if (!this.selected) return;

      this.loading = true;
      const keepName = this.selected.playername;

      try {
        const payload = await this.getGroupPayload(form);
        if (!payload) return;

        await updatePlayerApi(payload);
        await this.fetchPlayers(true);

        this.selected =
          this.list.find((p) => p.playername === keepName) || null;
      } finally {
        this.loading = false;
      }
    },

    async deletePlayer(name) {
      if (!name) return;

      this.loading = true;
      try {
        const payload = await this.getGroupPayload({ name });
        if (!payload) return;

        await deletePlayerApi(payload);
        await this.fetchPlayers(true);
      } finally {
        this.loading = false;
      }
    },

    async topPlayer(player) {
      const name = typeof player === "string" ? player : player?.playername;
      if (!name) return;

      this.loading = true;
      try {
        const payload = await this.getGroupPayload({ name });
        if (!payload) return;

        await topPlayerApi(payload);
        await this.fetchPlayers(true);
      } finally {
        this.loading = false;
      }
    },

    async hidePlayer(player) {
      const name = typeof player === "string" ? player : player?.playername;
      if (!name) return;

      this.loading = true;
      try {
        const payload = await this.getGroupPayload({ name });
        if (!payload) return;

        await hidePlayerApi(payload);
        await this.fetchPlayers(true);
      } finally {
        this.loading = false;
      }
    },

    resetStore() {
      this.list = [];
      this.selected = null;
      this.loading = false;
    },
  },
});
