//stores/resultsetting.store.js
import { defineStore } from "pinia";
import {
  getLotteryResultApi,
  setLotteryResultApi,
  deskInfo,
} from "@/api/system.api";
import { useGroupPullStore } from "@/stores/group.store";
import {
  parseGameHistory,
  buildBigRoad,
  buildLogicalBigRoad,
  buildBeadRoad,
} from "@/composables/useBigRoad";

import { DerivedRoad } from "@/composables/DerivedRoad";
import { buildDerivedBigRoad } from "@/composables/useDerivedRoadGrid";

function createDefaultSetting() {
  return {
    active: false,
    official_website_nickname: "",
    desk_number: "",
    auto_result_report: false,
  };
}

function createDefaultInfo() {
  return {
    shoe: null,
    round: null,
    gameHistory: "",
  };
}

function normalizeSetting(row = {}) {
  return {
    active: Boolean(row.active),
    official_website_nickname: row.official_website_nickname || "",
    desk_number: row.desk_number || "",
    auto_result_report: Boolean(row.auto_result_report),
  };
}

export const useResultSettingStore = defineStore("result", {
  state: () => ({
    loading: false,
    isFetched: false,
    setting: createDefaultSetting(),
    info: createDefaultInfo(),
  }),

  getters: {
     groupNickname() {
      const groupStore = useGroupPullStore();
      return groupStore.setting.group_nickname;
    },

    values(state) {
      if (!state.info.gameHistory) return [];
      return parseGameHistory(state.info.gameHistory);
    },

    rawBigRoad() {
      return this.values.length ? buildLogicalBigRoad(this.values) : [];
    },

    bigRoad() {
      return this.values.length ? buildBigRoad(this.values) : [];
    },

    beadRoad() {
      return buildBeadRoad(this.values);
    },

    bigEyeRoadRaw() {
      return this.buildDerived(1);
    },

    smallRoadRaw() {
      return this.buildDerived(2);
    },

    cockroachRoadRaw() {
      return this.buildDerived(3);
    },
  },

  actions: {
    buildDerived(type){
        if(!this.rawBigRoad.length) return [];

        const evaluator = new DerivedRoad(type);
        const flat = evaluator.evaluate(this.rawBigRoad);
        return buildDerivedBigRoad(flat,6)
    },

    async fetchSetting({ force = false } = {}) {
       if (this.isFetched && !force) return;

       const group_nickname = this.groupNickname;
        if (!group_nickname) {
          this.isFetched = true;
          return;
        }

      this.loading = true;
      try {
        const res = await getLotteryResultApi({ group_nickname });
        const row = res?.data;
        if(row){
          this.setting = normalizeSetting(row);
        }
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
      const group_nickname = this.groupNickname;
      if (!group_nickname) return;
      
      this.loading = true;
      try {
       
        await setLotteryResultApi({
          group_nickname,
          active: form.active ? 1 : 0,
          official_website_nickname: form.official_website_nickname,
          desk_number: form.desk_number,
          auto_result_report: form.auto_result_report ? 1 : 0,
        });

        this.setting = { ...form };
        this.isFetched = true;
      } finally {
        this.loading = false;
      }
    },

    async getDeskInfo() {
      if (!this.setting.desk_number) return;

      const group_nickname = this.groupNickname;
      if (!group_nickname) return;

      this.loading = true;

      try{
         const { data } = await deskInfo({
        group_nickname,
        desk_number: this.setting.desk_number,
      });

      this.info = {
        ...this.info,
        shoe: data?.shoe ?? null,
        round: data?.round ?? null,
        gameHistory: data?.gameHistory ?? this.info.gameHistory,
      };
      }finally{
        this.loading = false;
      }
    },

    async reload() {
      this.isFetched = false;
      await this.fetchSetting({ force: true });
    },

    reset() {
      this.$reset();
    }
  },
});
