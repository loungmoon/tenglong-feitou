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
import { ref, computed, watch, onMounted } from "vue";
import { getPlayerBetDataApi } from "@/api/data.api";
import { useNotify } from "@/composables/useNotifiy";
import { usePlayerStore } from "@/stores/player.store";
import { useUiStore } from "@/stores/ui.store";

const notify = useNotify();
const playerStore = usePlayerStore();
const uiStore = useUiStore();

const betTableRef = ref(null);
const loading = ref(false);

const players = computed(() => playerStore.userList);

const items = ref([]);

const headers = [
  { title: "姓名", key: "name", width: 90 },
  { title: "闲", key: "player", align: "center" },
  { title: "庄", key: "bank", align: "center" },
  { title: "闲对", key: "playerPair", align: "center" },
  { title: "庄对", key: "bankPair", align: "center" },
  { title: "和", key: "tie", align: "center" },
  { title: "幸运6", key: "lucky6", align: "center" },
  { title: "完美", key: "perfect", align: "center" },
];

const fetchTableData = async () => {
  if (!players.value.length) return;

  loading.value = true;

  try {
    const res = await getPlayerBetDataApi();
    if (res.code !== 200) return;

    const betMap = new Map();

    res.data.forEach((r) => {
      betMap.set(r.name, r.bet_detail ?? {});
    });

    let totals = {
      bank: 0,
      bankPair: 0,
      player: 0,
      playerPair: 0,
      tie: 0,
      lucky6: 0,
      perfect: 0,
    };

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

    items.value = rows;
  } catch (err) {
    console.error(err);
    notify.error("获取投注数据失败");
  } finally {
    loading.value = false;
  }
};

watch(
  () => players.value.map(p => p.playername),
  () => {
    fetchTableData();
  },
  { immediate: true }
);

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
  background-color: #0d47a1;
  color: white;
  font-weight: bold;
}

:deep(tr.total-row td) {
  background-color: #d17b4d;
  font-weight: bold;
}
</style>
