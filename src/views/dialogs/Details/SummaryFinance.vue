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

            <!-- Query button -->
            <v-btn
              block
              color="#d17b4d"
              class="mt-2"
              :disabled="!queryMode"
              @click="query"
            >
              {{queryLabel}}
            </v-btn>

            <v-btn
              block
              color="#d17b4d"
              class="mt-2"
              :disabled="!canQueryByNameShoeRound"
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
import { useGroupPullStore } from "@/stores/group.store";
import {
  queryPlayerDetails,
  queryPlayerDetailsByNameShoe,
} from "@/api/data.api";
import { useNotify } from "@/composables/useNotifiy";

const model = defineModel({ type: Boolean });
const notify = useNotify();

const playerStore = usePlayerStore();
const groupStore = useGroupPullStore();

const rows = ref([]);
const tableMode = ref("normal");

const startMenu = ref(false);
const endMenu = ref(false);

const form = ref({
  shoe: null,
  round: null,
  startTime: "",
  endTime: "",
  is_contains_virtual: 0,
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

const hasDateRange = computed(
  () => !!form.value.startTime && !!form.value.endTime,
);

const queryMode = computed(() => {
  const { shoe,round } = form.value;

  if (hasDateRange.value && selectedName.value && !shoe ) return "SINGLE";
  if (hasDateRange.value && shoe && round && !selectedName.value) return "BY_SHOE";
  if (hasDateRange.value && !selectedName.value && !shoe) return "ALL";

  return null;
});

const canQueryByNameShoeRound = computed(() => {
  return (
    selectedName.value &&
    form.value.shoe &&
    form.value.round &&
    form.value.startTime &&
    form.value.endTime
  );
});

const queryLabel = computed(
  () =>
    ({
      SINGLE: "按天查询单个选手",
      ALL: "按天查询所有选手",
      BY_SHOE: "按天查某靴所有选手",
    })[queryMode.value] || "查询",
);

const headersMap = {
  normal: [
    { title: "选手", key: "username" },
    { title: "参考名称", key: "reference_name" },
    { title: "三宝盈利", key: "sb_yl" },
    { title: "闲庄盈利", key: "sx_yl" },
    { title: "三宝下注", key: "xml_sb" },
    { title: "闲庄下注", key: "xml_sx" },
    { title: "有效下注", key: "yxxz" },
  ],
  byNameShoe: [
    { title: "选手", key: "username" },
    { title: "场次", key: "cc" },
    { title: "局次", key: "jc" },
    { title: "参考名称", key: "reference_name" },
    { title: "三宝盈利", key: "sb_yl" },
    { title: "闲庄盈利", key: "sx_yl" },
    { title: "三宝下注", key: "xml_sb" },
    { title: "闲庄下注", key: "xml_sx" },
    { title: "有效下注", key: "yxxz" },
  ],
};

const headers = computed(() => headersMap[tableMode.value]);

const isSelected = (name) => selectedName.value === name;

const selectPlayer = (name) => {
  playerStore.setSelectedByName(name);
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

const query = async () => {
  rows.value = [];

  try {
    let res;

    switch (queryMode.value) {
      case "SINGLE":
        tableMode.value = "normal";
        res = await queryPlayerDetails({
          ...basePayload(),
          name: selectedName.value,
        });
        break;

      case "ALL":
        tableMode.value = "normal";
        res = await queryPlayerDetails(basePayload());
        break;

      case "BY_SHOE":
        tableMode.value = "normal";
        res = await queryPlayerDetails({
          ...basePayload(),
          shoe: form.value.shoe,
          round: form.value.round,
        });
        break;

      default:
        notify.error("查询条件不完整");
        return;
    }
    rows.value = res.data || [];
    notify.success(res.msg);
  } catch (err) {
    console.error(err);
    notify.error("查询失败");
  }
};

const queryByNameShoeRound = async () => {
  if (!canQueryByNameShoeRound.value) {
    notify.error("请完整选择日期、选手、靴号和局号");
    return;
  }

  rows.value = [];
  tableMode.value = "byNameShoe";

  try {
    const res = await queryPlayerDetailsByNameShoe({
      ...basePayload(),
      name: selectedName.value,
      shoe: form.value.shoe,
      round: form.value.round,
    });

    rows.value = res.data || [];
    notify.success(res.msg);

  } catch (err) {
    console.error(err);
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
    is_contains_virtual: 0,
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
