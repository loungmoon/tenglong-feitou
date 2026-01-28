<template>
  <v-dialog v-model="model" max-width="1100" persistent>
    <v-card>
      <v-card-title
        class="d-flex justify-space-between align-center bg-grey-lighten-3"
      >
        <div class="d-flex align-center">
          <v-icon class="mr-2" color="primary">mdi-chart-box</v-icon>
          <span class="font-weight-bold">三宝点数统计</span>
        </div>
        <v-btn icon variant="text" @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-col cols="12" md="3">
            <v-alert
              color="#d17b4d"
              variant="text"
              density="compact"
              class="mb-2 border"
            >
              <v-icon size="small">mdi-star-off-outline</v-icon>
              号为隐藏选手
            </v-alert>

            <v-sheet
              border
              rounded
              class="mt-1 pa-2 overflow-y-auto"
              height="300"
            >
              <v-list density="compact">
                <v-list-item
                  v-for="p in playerStore.list"
                  :key="p.playername"
                  :active="isSelected(p.playername)"
                  color="#0d47a1"
                  @click="selectPlayer(p.playername)"
                >
                  <template #prepend>
                    <v-icon
                      :icon="p.is_hide ? 'mdi-star-off-outline' : 'mdi-star'"
                    />
                  </template>

                  <v-list-item-title>
                    {{ p.playername }}
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-sheet>

            <!-- Shoe / Round -->
            <v-row dense class="mt-4" align="center">
              <span>第</span>
              <v-text-field
                v-model.number="form.shoe"
                type="number"
                density="compact"
                style="width: 80px"
                clearable
              />
              <span class="mx-1">靴</span>
              <v-text-field
                v-model.number="form.round"
                type="number"
                density="compact"
                style="width: 80px"
                clearable
              />
              <span>局</span>
            </v-row>

            <!-- Buttons -->
            <v-btn
              block
              color="#d17b4d"
              class="mb-2"
              :disabled="!canQuery"
              @click="getScoreData()"
            >
              查询单个选手点数统计
            </v-btn>
          </v-col>

          <v-col cols="12" md="9">
            <v-table fixed-header height="500">
              <thead>
                <tr>
                  <th v-for="h in headers" :key="h.key">
                    {{ h.title }}
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="(row, i) in rows" :key="i">
                  <td v-for="h in headers" :key="h.key">
                    {{ row[h.key] }}
                  </td>
                </tr>

                <tr v-if="!rows.length">
                  <td :colspan="headers.length" class="text-center">
                    暂无数据
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { usePlayerStore } from "@/stores/player.store";
import { getPlayerScoreDataApi } from "@/api/data.api";
import { useNotify } from "@/composables/useNotifiy";

const model = defineModel({ type: Boolean });
const notify = useNotify();
const playerStore = usePlayerStore();
const loading = ref(false);

const form = ref({
  name: "",
  shoe: null,
  round: null,
});

const rows = ref([]);

const headers = computed(() => [
  { title: "本局得分", key: "yl" },
  { title: "剩余分", key: "score" },
  { title: "初始分", key: "raw_score" },
  { title: "日积分", key: "daily_points" },
  { title: "总积分", key: "total_points" },
  { title: "分红", key: "fh" },
]);

/* load players when open */
watch(model, async (open) => {
  if (!open) {
    rows.value = [];
    resetForm();
    return;
  }
  await playerStore.fetchPlayers();
});

const canQuery = computed(
  () => !!form.value.name && !!form.value.shoe && !!form.value.round,
);

const isSelected = (name) => playerStore.selected?.playername === name;

const selectPlayer = (name) => {
  form.value.name = name;
  playerStore.setSelectedByName(name);
};

const resetForm = () => {
  form.value = { name: "", shoe: null, round: null };
};

watch(
  () => playerStore.selected,
  (player) => {
    if (player) {
      form.value.name = player.playername;
    }
  },
  { immediate: true },
);

const getScoreData = async () => {
  loading.value = true;
  try {
    const res = await getPlayerScoreDataApi({ ...form.value });
    notify.success(res.msg);
    rows.value = (res.data || []).map(mapScoreRow);
  } finally {
    loading.value = false;
  }
};

const mapScoreRow = (r) => ({
  daily_points: r.daily_points ?? 0,
  fh: r.fh ?? 0,
  raw_score: r.raw_score ?? 0,
  score: r.score ?? 0,
  total_points: r.total_points ?? 0,
  xz: r.xz ?? 0,
  yl: r.yl ?? 0,
});

const close = () => {
  model.value = false;
};
</script>
