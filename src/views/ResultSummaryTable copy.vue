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
import { ref, onMounted, computed, watch } from "vue";
import { getPlayerBetDataApi } from "@/api/data.api";
import { useNotify } from "@/composables/useNotifiy";
import { usePlayerStore } from "@/stores/player.store";
import { useUiStore } from "@/stores/ui.store";

const store = usePlayerStore();
const users = computed(() => store.userList);

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

const items = ref([]);
const loading = ref(false);
const notify = useNotify();
const betTableRef = ref(null);

const uiStore = useUiStore()

const fetchTableData = async () => {
  loading.value = true;
  try {
    const res = await getPlayerBetDataApi();
    if (res.code == 200) {
      notify.success(res.msg);

      items.value = users.value.map((u) => {
        return {
          name: u.playername,
          bank: 0,
          bankPair: 0,
          player: 0,
          playerPair: 0,
          tie: 0,
          lucky6: 0,
          perfect: 0,
        };
      });

      const list = res.data;
      let totalBank = 0;
      let totalBankPair = 0;
      let totalPlayer = 0;
      let totalPlayerPair = 0;
      let totalTie = 0;
      let totalLucky6 = 0;
      let totalPerfect = 0;

      for (let i = 0; i < list.length; i++) {
        const r = list[i];
        const bet = r.bet_detail;
        const item = items.value.find((d) => d.name === r.name);
        if (item) {
          item.bank = bet?.bank ?? 0;
          item.bankPair = bet?.bankPair ?? 0;
          item.player = bet?.player ?? 0;
          item.playerPair = bet?.playerPair ?? 0;
          item.tie = bet?.tie ?? 0;
          item.lucky6 = bet?.lucky6 ?? 0;
          item.perfect = bet?.perfect ?? 0;

          totalBank += bet?.bank ?? 0;
          totalBankPair += bet?.bankPair ?? 0;
          totalPlayer += bet?.player ?? 0;
          totalPlayerPair += bet?.playerPair ?? 0;
          totalTie += bet?.tie ?? 0;
          totalLucky6 += bet?.lucky6 ?? 0;
          totalPerfect += bet?.perfect ?? 0;
        }
      }

      items.value.push({
        name: "合计",
        bank: totalBank,
        bankPair: totalBankPair,
        player: totalPlayer,
        playerPair: totalPlayerPair,
        tie: totalTie,
        lucky6: totalLucky6,
        perfect: totalPerfect,
      });
    }
  } finally {
    loading.value = false;
  }
};

watch(
  () => users.value.length,
  () => {
    fetchTableData();
  },
  { deep: true, immediate: true },
);

onMounted(() => {
  let interval = null;
  let retry = 10;
  interval = setInterval(() => {
    if (users.value.length > 0 && retry >= 0) {
      fetchTableData();
      clearInterval(interval);
      retry = 10;
    } else {
      retry -= 1;
      if (retry == 0) clearInterval(interval);
    }
  }, 1000);

   uiStore.betTableEl = betTableRef.value
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
