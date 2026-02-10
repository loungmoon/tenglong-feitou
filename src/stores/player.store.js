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
    /**
     * Ensure group is ready and build payload
     */
    async buildPayload(extra = {}) {
      const groupStore = useGroupPullStore();

      const group_nickname = groupStore.setting.group_nickname;
      if (!group_nickname) {
        // console.warn("[player.store] Missing group_nickname");
        return null;
      }

      return {
        group_nickname,
        ...extra,
      };
    },

    /**
     * Fetch players list
     */
    async fetchPlayers(force = false) {
      if (this.loaded && !force) return;

      this.loading = true;
      try {
        const payload = await this.buildPayload();
        if (!payload) return;

        const res = await getPlayersApi(payload);
        const list = res?.data || [];

        this.list = list;
        this.loaded = true;

        // keep selection stable
        if (list.length) {
          this.selected =
            this.selected &&
            list.find((p) => p.playername === this.selected.playername)
              ? list.find((p) => p.playername === this.selected.playername)
              : list[0];
        } else {
          this.selected = null;
        }
      } catch (err) {
        console.error("[player.store] fetchPlayers failed", err);
        this.list = [];
        this.selected = null;
        this.loaded = false;
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

    /**
     * CRUD operations
     */
    async createPlayer(form) {
      this.loading = true;
      try {
        const payload = await this.buildPayload(form);
        if (!payload) return;

        await createPlayerApi(payload);
        await this.fetchPlayers(true);
      } finally {
        this.loading = false;
      }
    },

    async updatePlayer(form) {
      if (!this.selected) return;

      const keepName = this.selected.playername;
      this.loading = true;

      try {
        const payload = await this.buildPayload(form);
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
        const payload = await this.buildPayload({ name });
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
        const payload = await this.buildPayload({ name });
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
        const payload = await this.buildPayload({ name });
        if (!payload) return;

        await hidePlayerApi(payload);
        await this.fetchPlayers(true);
      } finally {
        this.loading = false;
      }
    },

    /**
     * Reset when group changes
     */
    resetStore() {
      this.list = [];
      this.selected = null;
      this.loading = false;
      this.loaded = false;
    },
  },
});
