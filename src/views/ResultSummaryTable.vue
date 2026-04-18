<!-- ResultSummary.vue -->
<template>
  <v-card>
     <div ref="betTableRef">
      <v-data-table
        :headers="headers"
        :items="items"
        :loading="loading"
        density="compact"
        hide-default-footer
        disable-sort
        :items-per-page="-1"
        class="desktop-table"
        item-key="name"
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
import { ref, computed, watch, onMounted,onBeforeUnmount } from "vue";
import { getPlayerBetDataApi } from "@/api/data.api";
import { useNotify } from "@/composables/useNotifiy";
import { useGroupPullStore } from "@/stores/group.store";
import { usePlayerStore } from "@/stores/player.store";
import { useResultSettingStore } from "../stores/resultsetting.store";
import { useUiStore } from "@/stores/ui.store";

const notify = useNotify();
const groupStore = useGroupPullStore();
const playerStore = usePlayerStore();
const uiStore = useUiStore();
const resultStore = useResultSettingStore();

const betTableRef = ref(null);
const loading = ref(false);
const items = ref([]);

let intervalId = null;
let fetching = false;
const firstLoad = ref(true);

const players = computed(() => playerStore.userList);
const groupNickName = computed(()=> groupStore.setting.group_nickname)
const shoe = computed(() => resultStore.info.shoe);
const round = computed(() => resultStore.info.round);

const headers = computed(() => [
  { 
    title: `${shoe.value ?? ""} 靴 ${round.value ?? ""}局`, // always show shoe and round
    key: "name",
    align: "center" 
  },
  { title: "闲", key: "player", align: "center" },
  { title: "庄", key: "bank", align: "center" },
  { title: "闲对", key: "playerPair", align: "center" },
  { title: "庄对", key: "bankPair", align: "center" },
  { title: "和", key: "tie", align: "center" },
  { title: "幸运6", key: "lucky6", align: "center" },
  { title: "完美", key: "perfect", align: "center" },
]);

const emptyTotals = () => ({
  bank: 0,
  bankPair: 0,
  player: 0,
  playerPair: 0,
  tie: 0,
  lucky6: 0,
  perfect: 0,
});

//(NO JUMP)
// const updateItemsSmoothly = (newRows) => {
//   if (items.value.length === 0) {
//     items.value = newRows;
//     return;
//   }

//   newRows.forEach((newRow, index) => {
//     if (!items.value[index]) {
//       items.value[index] = newRow;
//     } else {
//       Object.assign(items.value[index], newRow);
//     }
//   });
// };
const updateItemsSmoothly = (newRows) => {
  // remove extra rows
  if (items.value.length > newRows.length) {
    items.value.splice(newRows.length);
  }

  newRows.forEach((newRow, index) => {
    if (!items.value[index]) {
      items.value[index] = newRow;
    } else {
      Object.assign(items.value[index], newRow);
    }
  });
};

const fetchTableData = async () => {
  // if (!players.value.length) return;
  if (fetching) return;

  if (!groupNickName.value || !players.value.length) {
    items.value = [];
    return;
  }

  // loading.value = true;
  fetching = true;

  if (firstLoad.value) loading.value = true;

  try {
    const res = await getPlayerBetDataApi({
      group_nickname: groupNickName.value,
      shoe: shoe.value,
      round: round.value,
    });
    if (res.code !== 200) return;

    const betMap = new Map();

    res.data.forEach((r) => {
      betMap.set(r.name, r.bet_detail ?? {});
    });

    const totals = emptyTotals();

    const rows = players.value.map((p) => {
      const bet = betMap.get(p.playername) ?? {};

      Object.keys(totals).forEach(
        (k) => (totals[k] += bet[k] ?? 0)
      );

      return {
        name: p.playername,
        bank: bet.bank ?? 0,
        bankPair: bet.bankPair ?? 0,
        player: bet.player ?? 0,
        playerPair: bet.playerPair ?? 0,
        tie: bet.tie ?? 0,
        lucky6: bet.lucky6 ?? 0,
        perfect: bet.perfect ?? 0,
      };
    });

    rows.push({ name: "合计", ...totals });

    // items.value = rows;
    updateItemsSmoothly(rows);
    firstLoad.value = false;
  } catch (err) {
    console.error(err);
    // notify.error("获取投注数据失败");
  } finally {
    loading.value = false;
    fetching = false;
  }
};

const startPolling = () => {
  if (intervalId) return; // prevent duplicate intervals

  intervalId = setInterval(() => {
    if (groupNickName.value && shoe.value && round.value) {
      fetchTableData();
    }
  }, 10000);
};

const stopPolling = () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
};

// watch(groupNickName,
//   () => {
//     items.value =[];
//   }
// );

watch(
  [groupNickName, shoe, round],
  ([g, s, r]) => {
    if (g && s && r) {
      fetchTableData();
      startPolling();
    } else {
      stopPolling();
      items.value = [];
    }
  },
  { immediate: true }
);

watch(
  () => players.value.map(p => p.playername),
  () => {
    fetchTableData();
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  stopPolling();
});

onMounted(() => {
  uiStore.betTableEl = betTableRef.value;
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

.desktop-table :deep(th:nth-child(1)) {
  background-color: #9e9e9e;
  font-weight: 600;
}

.desktop-table :deep(th:nth-child(n + 2)) {
  background-color: rgba(var(--v-theme-primary));
  color: white;
  font-weight: bold;
}

:deep(tr.total-row td) {
  background-color: #d17b4d;
  font-weight: bold;
}
</style>
