<template>
  <v-dialog v-model="model" max-width="1400" persistent>
    <v-card>
      <v-card-title
        class="d-flex justify-space-between align-center bg-grey-lighten-3"
      >
        <div class="d-flex align-center">
          <v-icon class="mr-2" color="primary">mdi-chart-box</v-icon>
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
              color="#d17b4d"
              :loading="playerStore.loading"
              @click="reloadPlayers"
            >
              刷新选手
            </v-btn>

            <v-row dense>
              <v-col cols="6">
                <v-menu v-model="startMenu" :close-on-content-click="false">
                  <template #activator="{ props }">
                    <v-text-field
                      v-bind="props"
                      v-model="form.startTime"
                      label="开始日期"
                      readonly
                      density="compact"
                    />
                  </template>

                  <v-date-picker
                    v-model="form.startTime"
                    @update:model-value="onStartDateSelect"
                  />
                </v-menu>
              </v-col>

              <v-col cols="6">
                <v-menu v-model="endMenu" :close-on-content-click="false">
                  <template #activator="{ props }">
                    <v-text-field
                      v-bind="props"
                      v-model="form.endTime"
                      label="结束日期"
                      readonly
                      density="compact"
                    />
                  </template>

                  <v-date-picker
                    v-model="form.endTime"
                    @update:model-value="onEndDateSelect"
                  />
                </v-menu>
              </v-col>
            </v-row>

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
                  color="primary"
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

            <div
              v-if="selectedName && scoreMap[selectedName]"
              class="mt-2 text-primary"
            >
              <div class="d-flex justify-end">
                <strong>{{ selectedName }}</strong>
              </div>

              <div class="d-flex justify-center gap-4">
                <span>剩余分: {{ scoreMap[selectedName].score }}</span> |
                <span>初始分: {{ scoreMap[selectedName].raw_score }}</span>
              </div>
            </div>

            <!-- Virtual -->
            <v-row>
              <v-col cols="5"> </v-col>
              <v-col cols="7">
                <v-checkbox
                  class="mt-3"
                  v-model="form.is_contains_virtual"
                  :true-value="1"
                  :false-value="0"
                  label="包含虚拟"
                  density="compact"
                />
                <v-btn
                  block
                  color="#d17b4d"
                  class="mt-2"
                  @click="querySingle"
                >
                  按天查询单个选手明细
                </v-btn>

                <v-btn
                  block
                  color="#d17b4d"
                  class="mt-2"
                  @click="queryAll"
                >
                  按天查询所有选手明细
                </v-btn>

                <v-btn
                  block
                  color="#d17b4d"
                  class="mt-2"
                  @click="queryByNameShoeRound"
                >
                  按天按靴查询单个选手明细
                </v-btn>
              </v-col>
            </v-row>

            <v-row align="center">
              <!-- LEFT: input -->
              <v-col cols="5">
                <div class="d-flex align-center">
                  <span class="mr-2">第</span>

                  <v-text-field
                    v-model="form.shoe"
                    type="number"
                    density="compact"
                    hide-details
                    style="max-width: 80px"
                    class="mr-2"
                  />

                  <span>靴</span>
                </div>
              </v-col>

              <!-- RIGHT: button -->
              <v-col cols="7">
                <v-btn
                  block
                  color="#d17b4d"
                  @click="queryByShoe"
                >
                  按天查某靴所有选手汇总
                </v-btn>
              </v-col>
            </v-row>
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
import { useGroupPullStore } from "@/stores/group.store";
import { useUiStore } from "@/stores/ui.store";
import {
  queryPlayerDetails,
  queryPlayerDetailsByNameShoe,
} from "@/api/data.api";
import { useNotify } from "@/composables/useNotifiy";

const model = defineModel({ type: Boolean });
const notify = useNotify();

const playerStore = usePlayerStore();
const groupStore = useGroupPullStore();
const uiStore = useUiStore();

const rows = ref([]);
const tableMode = ref("normal");

const startMenu = ref(false);
const endMenu = ref(false);

const form = ref({
  shoe: null,
  round: null,
  startTime: "",
  endTime: "",
  is_contains_virtual: 1,
});

const selectedName = computed(() => playerStore.selected?.playername);
const groupNickName = computed(
  () => groupStore.setting?.group_nickname ?? null,
);

const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const onStartDateSelect = (val) => {
  form.value.startTime = formatDate(val);
  startMenu.value = false;
};

const onEndDateSelect = (val) => {
  form.value.endTime = formatDate(val);
  endMenu.value = false;
};

const headersMap = {
  normal: [
    { title: "选手", key: "username" },
    { title: "参考名称", key: "reference_name" },
    { title: "三宝盈利", key: "sb_yl" },
    { title: "三宝洗码量", key: "xml_sb" },
    { title: "闲庄洗码量", key: "xml_zx" },
    { title: "闲庄盈利", key: "zx_yl" },
    { title: "有效下注", key: "yxxz" },
  ],
  byNameShoe: [
    { title: "选手", key: "username" },
    { title: "靴", key: "cc" },
    { title: "参考名称", key: "reference_name" },
    { title: "三宝盈利", key: "sb_yl" },
    // { title: "三宝下注", key: "sb_xz" },
    { title: "三宝洗码量", key: "xml_sb" },
    { title: "闲庄洗码量", key: "xml_sx" },
    { title: "闲庄下注", key: "xz_xz" },
    { title: "闲庄盈利", key: "xz_yl" },
    { title: "有效下注", key: "yxxz" },
  ],
};

const headers = computed(() => headersMap[tableMode.value]);

const scoreMap = computed(() => uiStore.scoreMap);
const isSelected = (name) => selectedName.value === name;

// const selectPlayer = (name) => {
//   playerStore.setSelectedByName(name);
// };

const selectPlayer = (name) => {
  if (selectedName.value === name) {
    // Already selected → unselect
    playerStore.selected = null;
  } else {
    // Otherwise, select
    playerStore.setSelectedByName(name);
  }
};

const reloadPlayers = async () => {
  await playerStore.fetchPlayers();
  playerStore.selected = null;
};

const basePayload = () => ({
  group_nickname: groupNickName.value,
  startTime: form.value.startTime,
  endTime: form.value.endTime,
  is_contains_virtual: form.value.is_contains_virtual,
});

const querySingle = async () => {
  if (!form.value.startTime || !form.value.endTime) {
    notify.error("请选择开始和结束日期");
    return;
  }

  if (!selectedName.value) {
    notify.error("请选择选手");
    return;
  }

  if (form.value.shoe) {
    // notify.error("单个选手查询不需要填写靴号");
    // return;
    form.value.shoe = null;
  }

  tableMode.value = "normal";
  rows.value = [];

  try {
    const res = await queryPlayerDetails({
      ...basePayload(),
      name: selectedName.value,
    });

    rows.value = res.data || [];
    notify.success(res.msg);
  } catch (err) {
    notify.error("查询失败");
  }
};

const queryAll = async () => {
  if (!form.value.startTime || !form.value.endTime) {
    notify.error("请选择开始和结束日期");
    return;
  }

  if (selectedName.value) {
    playerStore.selected = null;
  }

  if (form.value.shoe) {
    form.value.shoe = null;
  }

  tableMode.value = "normal";
  rows.value = [];

  try {
    const res = await queryPlayerDetails(basePayload());

    rows.value = res.data || [];
    notify.success(res.msg);
  } catch (err) {
    notify.error("查询失败");
  }
};

const queryByNameShoeRound = async () => {
  if (!form.value.startTime || !form.value.endTime) {
    notify.error("请选择开始和结束日期");
    return;
  }

  if (!selectedName.value) {
    notify.error("请选择选手");
    return;
  }

  if (!form.value.shoe) {
    notify.error("请输入靴号");
    return;
  }

  rows.value = [];
  tableMode.value = "byNameShoe";

  try {
    const res = await queryPlayerDetailsByNameShoe({
      ...basePayload(),
      name: selectedName.value,
      shoe: Number(form.value.shoe),
    });

    rows.value = res.data || [];
    notify.success(res.msg);
  } catch (err) {
    notify.error("查询失败");
  }
};

const queryByShoe = async () => {
  if (!form.value.startTime || !form.value.endTime) {
    notify.error("请选择开始和结束日期");
    return;
  }

  if (!form.value.shoe) {
    notify.error("请输入靴号");
    return;
  }

  if (selectedName.value) {
    playerStore.selected = null;
  }

  tableMode.value = "normal";
  rows.value = [];

  try {
    const res = await queryPlayerDetails({
      ...basePayload(),
      shoe: Number(form.value.shoe),
    });

    rows.value = res.data || [];
    notify.success(res.msg);
  } catch (err) {
    notify.error("查询失败");
  }
};



const reset = () => {
  rows.value = [];
  form.value = {
    shoe: null,
    round: null,
    startTime: "",
    endTime: "",
    is_contains_virtual: 1,
  };
  playerStore.clearSelected();
};

const close = () => {
  model.value = false;
};

watch(model, async (open) => {
  if (!open) {
    reset();
    return;
  }
  await reloadPlayers();
});
</script>
