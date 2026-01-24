import { defineStore } from "pinia";
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
    }),

    getters: {
        /* for v-select */
        nameList: (state) => state.list.map((p) => p.playername),
        userList: (state) => state.list.filter((u) => u.is_hide === 0),
    },

    actions: {
        async fetchPlayers(force = false) {
            if (this.list.length && !force) return;

            this.loading = true;
            try {
                const res = await getPlayersApi();
                this.list = res.data;
                if (!this.selected && res.length) {
                this.selected = res[0];
                }
            } finally {
                this.loading = false;
            }
        },

        setSelectedByName(name) {
            this.selected = this.list.find((p) => p.playername === name) || null;
        },

        async createPlayer(payload) {
            await createPlayerApi(payload);
            await this.fetchPlayers(true);
        },

        async updatePlayer(payload) {
            const { Id } = this.selected;
            await updatePlayerApi(payload);
            await this.fetchPlayers(true);
            this.selected = this.list.find((p) => p.Id === Id) || null;
        },

        async deletePlayer(name) {
            if (!name) return;

            await deletePlayerApi({ name }); // ✅ BODY

            this.list = this.list.filter((p) => p.playername !== name);

            if (this.selected?.playername === name) {
                this.selected = this.list[0] || null;
            }
        },

        async topPlayer(player) {
            const name = typeof player === "string" ? player : player?.playername;

            if (!name) return;

            await topPlayerApi({ name });
            await this.fetchPlayers(true);
        },

        async hidePlayer(player) {
            const name = typeof player === "string" ? player : player?.playername;

            if (!name) return;

            await hidePlayerApi({ name });
            await this.fetchPlayers(true);
        },
    },
});
