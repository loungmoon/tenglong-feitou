<template>
  <v-dialog v-model="model" max-width="1100" persistent>
    <v-card>
      <v-card-title
        class="d-flex justify-space-between align-center bg-grey-lighten-3"
      >
        <div class="d-flex align-center">
          <v-icon class="mr-2">mdi-chart-box</v-icon>
          <span class="font-weight-bold">选手数据查询及统计</span>
        </div>
        <v-btn icon variant="text" @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-col cols="12" md="4">
            <v-btn
              block
              class="mb-3"
              color="warning"
              :loading="playerStore.loading"
              :disabled="playerStore.loading"
              @click="refreshData()"
            >
              刷新选手
            </v-btn>
            <v-row dense>
              <v-col cols="6">
                <v-text-field
                  v-model="form.startTime"
                  type="date"
                  label="开始日期"
                  density="compact"
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="form.endTime"
                  type="date"
                  label="结束日期"
                  density="compact"
                />
              </v-col>
            </v-row>

            <!-- <v-alert type="error" variant="text" density="compact" class="mt-2">
              没有 ☆ 号为隐藏选手
            </v-alert> -->

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

            <!-- Virtual -->
            <v-checkbox
              class="mt-3"
              v-model="form.is_contains_virtual"
              :true-value="1"
              :false-value="0"
              label="包含虚拟"
              density="compact"
            />

            <!-- Buttons -->
            <v-btn
              block
              color="warning"
              class="mb-2"
              @click="querySingle"
              :disabled="!canQuerySingle"
            >
              按天查询单个选手
            </v-btn>

            <v-btn
              block
              color="warning"
              class="mb-2"
              @click="queryAll"
              :disabled="!canQueryAll"
            >
              按天查询所有选手
            </v-btn>

            <v-btn
              block
              color="warning"
              @click="queryByShoe"
              :disabled="!canQueryByShoe"
              class="mb-2"
            >
              按天查某靴所有选手
            </v-btn>

            <v-btn
              block
              color="warning"
              :disabled="!canByNameShoeRound"
              @click="queryByNameShoeRound"
            >
              按天按靴查询单个选手
            </v-btn>
          </v-col>

          <!-- ========== RIGHT PANEL ========== -->
          <v-col cols="12" md="8">
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
                    {{ row[h.key] ?? "-" }}
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
import { ref, computed, watch } from "vue";
import { usePlayerStore } from "@/stores/player.store";
import {
  queryPlayerDetails,
  queryPlayerDetailsByNameShoe,
} from "@/api/data.api";
import { useNotify } from "@/composables/useNotifiy";

const model = defineModel({ type: Boolean });
const notify = useNotify();
const playerStore = usePlayerStore();

const form = ref({
  name: "",
  shoe: null,
  round: null,
  startTime: "",
  endTime: "",
  is_contains_virtual: 0,
});

const rows = ref([]);

const tableMode = ref("normal");

const headers = computed(() => {
  if (tableMode.value === "byNameShoe") {
    return [
      { title: "选手", key: "username" },
      { title: "场次 (cc)", key: "cc" },
      { title: "局次 (jc)", key: "jc" },
      { title: "参考名称", key: "reference_name" },
      { title: "三宝盈利", key: "sb_yl" },
      { title: "闲庄盈利", key: "sx_yl" },
      { title: "三宝下注", key: "xml_sb" },
      { title: "闲庄下注", key: "xml_sx" },
      { title: "有效下注", key: "yxxz" },
    ];
  }

  // default table
  return [
    { title: "选手", key: "username" },
    { title: "参考名称", key: "reference_name" },
    { title: "三宝盈利", key: "sb_yl" },
    { title: "闲庄盈利", key: "sx_yl" },
    { title: "三宝下注", key: "xml_sb" },
    { title: "闲庄下注", key: "xml_sx" },
    { title: "有效下注", key: "yxxz" },
  ];
});

/* load players when open */
watch(model, async (open) => {
  if (!open) return;
  await playerStore.fetchPlayers();
});

const refreshData = async () => {
  try {
    rows.value = [];
    form.value.name = "";
    form.value.shoe = null;
    form.value.round = null;
    form.value.startTime = "";
    form.value.endTime = "";

    await playerStore.fetchPlayers(true);

    notify.success("选手列表已刷新");
  } catch (err) {
    notify.error("刷新选手失败");
    console.error(err);
  }
};

const hasDateRange = computed(
  () => !!form.value.startTime && !!form.value.endTime,
);

const canQuerySingle = computed(
  () => hasDateRange.value && !!form.value.name && !form.value.shoe,
);

const canQueryAll = computed(
  () => hasDateRange.value && !form.value.name && !form.value.shoe,
);

const canQueryByShoe = computed(
  () => hasDateRange.value && !!form.value.shoe && !form.value.name,
);

const canByNameShoeRound = computed(
  () => !!form.value.name && !!form.value.shoe && !!form.value.round,
);

const baseBody = () => ({
  startTime: form.value.startTime,
  endTime: form.value.endTime,
  is_contains_virtual: form.value.is_contains_virtual,
});

const querySingle = async () => {
   tableMode.value = "normal";
  const res = await queryPlayerDetails({
    ...baseBody(),
    name: form.value.name,
  });
  notify.success(res.msg);
  rows.value = res.data || [];
};

const queryAll = async () => {
   tableMode.value = "normal";
  const res = await queryPlayerDetails(baseBody());
  notify.success(res.msg);
  rows.value = res.data || [];
};

const queryByShoe = async () => {
   tableMode.value = "normal";
  const res = await queryPlayerDetails({
    ...baseBody(),
    shoe: form.value.shoe,
  });
  notify.success(res.msg);
  rows.value = res.data || [];
};

const queryByNameShoeRound = async () => {
  tableMode.value = "byNameShoe";
  const res = await queryPlayerDetailsByNameShoe({
    ...baseBody(),
    name: form.value.name,
    shoe: form.value.shoe,
    round: form.value.round,
  });
  notify.success(res.msg);
  rows.value = res.data || [];
};

const close = () => {
  model.value = false;
};
</script>
