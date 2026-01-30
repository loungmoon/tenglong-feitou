<template>
  <v-card elevation="0">
    <div ref="betScoreRef">
      <v-data-table
        :headers="headers"
        :items="items"
        :loading="loading"
        density="compact"
        hide-default-footer
        disable-sort
        :items-per-page="-1"
        item-key="name"
        class="desktop-table mt-5"
        :row-props="rowProps"
      >
        <!-- Loading -->
        <template #loading>
          <v-skeleton-loader type="table-row@7"/>
        </template>

        <!-- Name -->
        <template #item.name="{ item }">
          <strong v-if="item.name === '合计'">
            {{ item.name }}
          </strong>
          <span v-else>
            {{ item.name }}
          </span>
        </template>
      </v-data-table>
    </div>
  </v-card>
</template>

<script setup>
import { ref, onMounted, computed,watch } from "vue";
import { getPlayerScoreDataApi } from "@/api/data.api";
import { useNotify } from "@/composables/useNotifiy";
import { useGroupPullStore } from "@/stores/group.store";
import { usePlayerStore } from "../stores/player.store";
import { useResultSettingStore } from "../stores/resultsetting.store";
import { useUiStore } from "@/stores/ui.store";

const notify = useNotify();
const grpupStore = useGroupPullStore();
const playStore = usePlayerStore();
const resultStore = useResultSettingStore();
const uiStore = useUiStore();

const betScoreRef = ref(null);
const loading = ref(false);

const players = computed(() => playStore.userList);
const shoe = computed(() => resultStore.info.shoe);
const round = computed(() => resultStore.info.round);

const items = ref([]);

const headers = [
  { title: "姓名", key: "name", align: "center" },
  { title: "本局得分", key: "yl", align: "center" },
  { title: "剩余分", key: "score", align: "center" },
  { title: "初始分", key: "raw_score", align: "center" },
  { title: "日积分", key: "daily_points", align: "center" },
  { title: "总积分", key: "total_points", align: "center" },
];

const fetchScoreData = async () => {
  if (!players.value.length || !shoe.value || !round.value) return;

  loading.value = true;

  try {
    const res = await getPlayerScoreDataApi({
      group_nickname: grpupStore.setting.group_nickname,
      shoe: shoe.value,
      round: round.value,
    });

    if (res.code !== 200) {
      notify.error(res.msg);
      return;
    }

    const scoreMap = new Map();
    res.data.forEach((r) => {
      scoreMap.set(r.username, r);
    });

    const totals = {
      yl: 0,
      score: 0,
      raw_score: 0,
      daily_points: 0,
      total_points: 0,
    };

    const rows = players.value.map((p) => {
      const s = scoreMap.get(p.playername) ?? {};

      Object.keys(totals).forEach(
        (k) => (totals[k] += s[k] ?? 0)
      );

      return {
        name: p.playername,
        yl: s.yl ?? 0,
        score: s.score ?? 0,
        raw_score: s.raw_score ?? 0,
        daily_points: s.daily_points ?? 0,
        total_points: s.total_points ?? 0,
      };
    });

    rows.push({ name: "合计", ...totals });

    items.value = rows;
  } catch (err) {
    console.error(err);
    notify.error("获取积分数据失败");
  } finally {
    loading.value = false;
  }
};

watch(
  () => [
    players.value.map(p => p.playername).join(),
    shoe.value,
    round.value,
  ],
  fetchScoreData,
  { immediate: true }
);

onMounted(() => {
  uiStore.scoreTableEl = betScoreRef.value;
});

const rowProps = ({ item }) => {
  if (item.name === "合计") {
    return { class: "total-row" };
  }
};
</script>

<style scoped>
.desktop-table :deep(td),
.desktop-table :deep(th) {
  border: 1px solid #999;
  font-size: 12px;
  padding: 2px 4px;
}

.desktop-table :deep(th) {
  background-color: gray;
  color: white;
  font-weight: bold;
}

:deep(tr.total-row td) {
  background-color: #d17b4d;
  font-weight: bold;
}
</style>
