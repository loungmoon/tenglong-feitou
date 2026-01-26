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
      item-key="name"
      class="desktop-table mt-5"
      :row-props="rowProps"
    >
      <!-- Loading -->
      <template #loading>
        <v-skeleton-loader type="table-row@7" />
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
import { ref, onMounted, computed } from "vue";
import { getPlayerScoreDataApi } from "@/api/data.api";
import { useNotify } from "@/composables/useNotifiy";
import { usePlayerStore } from "../stores/player.store";
import { useResultSettingStore } from "../stores/resultsetting.store";
import { useUiStore } from "@/stores/ui.store";

const playStore = usePlayerStore();
const resultStore = useResultSettingStore();
const uiStore = useUiStore();

const users = computed(() => playStore.userList);

const headers = [
  { title: "姓名", key: "name", align: "center" },
  { title: "本局得分", key: "yl", align: "center" },
  { title: "剩余分", key: "score", align: "center" },
  { title: "初始分", key: "raw_score", align: "center" },
  { title: "日积分", key: "daily_points", align: "center" },
  { title: "总积分", key: "total_points", align: "center" },
];

/* ----------------------------
   State
----------------------------- */
const items = ref([]);
const loading = ref(false);
const notify = useNotify();
const betScoreRef = ref("");

const fetchScoreData = async () => {
  loading.value = true;
  try {
    await new Promise((r) => setTimeout(r, 1000)); // simulate API
    const res = await getPlayerScoreDataApi({
      shoe: resultStore.info.shoe,
      round: resultStore.info.round,
    });
    if (res.code == 200) {
        notify.success(res.msg);
        items.value = users.value.map((u) => {
            return {
                name: u.playername,
                yl: 0,
                score: 0,
                raw_score: 0,
                daily_points: 0,
                total_points: 0,
            }
        })

        const list = res.data;
        let totalYl = 0;
        let totalScore = 0;
        let totalRawScore = 0;
        let totalDailyPoint = 0;
        let totalPoint = 0;
        for (let i = 0; i < list.length; i++) {
            const l = list[i];
            const item = items.value.find(d => d.name === l.username);
            if (item) {
                item.yl = l?.yl ?? 0;
                item.score = l?.score ?? 0;
                item.raw_score = l?.raw_score ?? 0;
                item.daily_points = l?.daily_points ?? 0;
                item.total_points = l?.total_points ?? 0;

                totalYl += l?.yl ?? 0;
                totalScore += l?.score ?? 0;
                totalRawScore += l?.raw_score ?? 0;
                totalDailyPoint += l?.daily_points ?? 0;
                totalPoint += l?.total_points ?? 0;
            }
        }

        items.value.push({
            name: '合计',
            yl: totalYl,
            score: totalScore,
            raw_score: totalRawScore,
            daily_points: totalDailyPoint,
            total_points: totalPoint,
        });
    } else {
        notify.error(res.msg);
    }
    
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
    let interval = null;
    let retry = 10;
    interval = setInterval(() => {
        if (users.value.length > 0 && retry >= 0) {
            fetchScoreData();
            clearInterval(interval);
            retry = 10;
        } else {
            retry -= 1;
            if (retry == 0) clearInterval(interval);
        }
    }, 1000);

    uiStore.scoreTableEl = betScoreRef.value
});

/* ----------------------------
   Row styling
----------------------------- */
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
