import { defineStore } from "pinia";
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
    isReady: (state) => state.loaded && !state.loading,
  },

  actions: {
    buildPayload(extra = {}) {
      const groupStore = useGroupPullStore();
      const group_nickname = groupStore.setting.group_nickname;
      if (!group_nickname) return null;
      return {
        group_nickname,
        ...extra,
      };
    },

    preserveSelection(newList) {
      if (!this.selected) {
        this.selected = newList[0] || null;
        return;
      }

      const found = newList.find(
        (p) => p.playername === this.selected.playername,
      );

      this.selected = found || newList[0] || null;
    },

    async fetchPlayers(force = false) {
      if (this.loaded && !force) return;

      this.loading = true;
      try {
        const payload = this.buildPayload();
        if (!payload) return;

        const res = await getPlayersApi(payload);
        const list = res?.data || [];

        this.list = list;
        this.preserveSelection(list);
        this.loaded = true;
      } catch (err) {
        this.reset();
      } finally {
        this.loading = false;
      }
    },

    setSelectedByName(name) {
      this.selected = this.list.find((p) => p.playername === name) || null;
    },

    clearSelected() {
      this.selected = null;
    },

    //CRUD
    async createPlayer(form) {
      const payload = this.buildPayload(form);
      if (!payload) return;

      this.loading = true;
      try {
        await createPlayerApi(payload);
        await this.fetchPlayers(true);
      } finally {
        this.loading = false;
      }
    },

    async updatePlayer(form) {
      if (!this.selected) return;

      const keepName = this.selected.playername;
      const payload = this.buildPayload(form);
      if (!payload) return;

      this.loading = true;
      try {
        await updatePlayerApi(payload);
        await this.fetchPlayers(true);
        this.setSelectedByName(keepName);
      } finally {
        this.loading = false;
      }
    },

    async deletePlayer(name) {
      if (!name) return;

      const payload = this.buildPayload({ name });
        if (!payload) return;

      this.loading = true;
      try {
        await deletePlayerApi(payload);
        await this.fetchPlayers(true);
      } finally {
        this.loading = false;
      }
    },

    async topPlayer(player) {
      const name = typeof player === "string" ? player : player?.playername;
      if (!name) return;

      const payload = this.buildPayload({ name });
        if (!payload) return;

      this.loading = true;
      try {
        await topPlayerApi(payload);
        await this.fetchPlayers(true);
      } finally {
        this.loading = false;
      }
    },

    async hidePlayer(player) {
      const name = typeof player === "string" ? player : player?.playername;
      if (!name) return;

      const payload = this.buildPayload({ name });
      if (!payload) return;

      this.loading = true;
      try {
        await hidePlayerApi(payload);
        await this.fetchPlayers(true);
      } finally {
        this.loading = false;
      }
    },

    reset() {
      this.$reset();
    },
  },
});
