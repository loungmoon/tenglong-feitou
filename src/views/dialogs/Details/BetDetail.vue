<template>
  <v-dialog v-model="model" max-width="1100" persistent>
    <v-card>
      <v-card-title
        class="d-flex justify-space-between align-center bg-grey-lighten-3"
      >
        <div class="d-flex align-center">
          <v-icon class="mr-2">mdi-chart-box</v-icon>
          <span class="font-weight-bold">查询玩家的下注流水</span>
        </div>
        <v-btn icon variant="text" @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-col cols="12" md="3">
            <v-select
              v-model="form.name"
              :items="playerStore.nameList"
              label="选手"
              density="compact"
              clearable
            />

            <v-sheet border rounded class="pa-2 overflow-y-auto" height="200">
              <div
                v-for="p in playerStore.nameList"
                :key="p"
                class="py-1"
                :class="p === form.name ? 'text-error font-weight-bold' : ''"
              >
                <v-icon size="14">mdi-star</v-icon>
                {{ p }}
              </div>
            </v-sheet>

            <!-- Shoe / Round -->
            <v-row dense class="mt-4" align="center">
              <span>第</span>
              <v-text-field
                v-model="form.shoe"
                type="number"
                density="compact"
                style="width: 80px"
                clearable
              />
              <span class="mx-1">靴</span>
              <v-text-field
                v-model="form.round"
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
              color="warning"
              class="mb-2"
              :disabled="!canQuery"
              @click="getPlayerBetData()"
            >
              查询单个选手下注流水
            </v-btn>
          </v-col>

          <!-- ========== RIGHT PANEL ========== -->
          <v-col cols="12" md="9">
            <v-table fixed-header height="500">
              <thead>
                <tr>
                  <th>选手</th>
                  <th>庄</th>
                  <th>庄对</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, i) in rows" :key="i">
                  <td>{{ row.name }}</td>
                  <td>{{ row.bank }}</td>
                  <td>{{ row.bankPair }}</td>
                </tr>
                <tr v-if="!rows.length">
                  <td colspan="3" class="text-center text-medium-emphasis">
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
import { getPlayerBetDataApi } from "@/api/data.api";
import { useNotify } from "@/composables/useNotifiy";

const model = defineModel({ type: Boolean });
const notify = useNotify();
const playerStore = usePlayerStore();

const form = ref({
  name: "",
  shoe: null,
  round: null,
});

const rows = ref([]);

/* load players when open */
watch(model, async (open) => {
  if (!open) {
    rows.value = [];
    return;
  }
  await playerStore.fetchPlayers();
});

const canQuery = computed(
  () => !!form.value.shoe && !!form.value.round,
);

const getPlayerBetData = async () => {
  const res = await getPlayerBetDataApi({
    name: form.value.name,
    shoe: form.value.shoe,
    round: form.value.round,
  });
  notify.success(res.msg);
  rows.value = (res.data || []).map((r) => ({
    name: r.name,
    bank: r.bet_detail?.bank ?? 0,
    bankPair: r.bet_detail?.bankPair ?? 0,
  }));
};

const close = () => {
  model.value = false;
};
</script>
