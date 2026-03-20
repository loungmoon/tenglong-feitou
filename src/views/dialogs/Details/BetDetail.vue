<template>
  <v-dialog v-model="model" max-width="1300" persistent>
    <v-card>
      <v-card-title class="d-flex justify-space-between bg-grey-lighten-3">
        <div class="d-flex align-center">
          <v-icon class="mr-2" color="primary">mdi-chart-box</v-icon>
          <span class="font-weight-bold">查询玩家的下注流水</span>
        </div>
        <v-btn icon variant="text" @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-col cols="12" md="3">
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
                      variant="outlined"
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
                      variant="outlined"
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

            <v-btn
              block
              color="#d17b4d"
              class="mb-2 mt-4"
              :disabled="!canQuery"
              @click="queryBetData()"
            >
              查询单个选手下注流水
            </v-btn>
          </v-col>

          <v-col cols="12" md="9">
            <div style="overflow-x: auto">
              <v-table fixed-header height="850">
                <thead>
                  <tr>
                    <th
                      v-for="h in headers"
                      :key="h.key"
                      :style="{
                        whiteSpace: 'nowrap',
                        width: h.width || 'auto',
                        minWidth: h.width || 'auto',
                      }"
                    >
                      {{ h.title }}
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="(row, i) in rows" :key="i">
                    <td
                      v-for="h in headers"
                      :key="h.key"
                      :style="{
                        width: h.width || 'auto',
                        minWidth: h.width || 'auto',
                      }"
                    >
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
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { usePlayerStore } from "@/stores/player.store";
import { useGroupPullStore } from "@/stores/group.store";
import { getBetDetailsByName } from "@/api/data.api";
import { useNotify } from "@/composables/useNotifiy";

const model = defineModel({ type: Boolean });
const notify = useNotify();

const playerStore = usePlayerStore();
const groupStore = useGroupPullStore();

const startMenu = ref(false);
const endMenu = ref(false);

const form = ref({
  startTime: "",
  endTime: "",
});

const loading = ref(false);

const rows = ref([]);

const groupNickName = computed(() => groupStore.setting.group_nickname);

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

const headers = computed(() => [
  { title: "会员昵称", key: "nickname" },
  { title: "鞋局", key: "shoe" },
  { title: "下注金额", key: "betMoney" },
  { title: "下注输赢", key: "raw_money" },
  { title: "下注命令", key: "bet_order" },
  { title: "命令格式", key: "bet_format" },
  { title: "下注时间", key: "bet_time", width: "120px" },
  { title: "开奖结果", key: "result" },
  { title: "开奖时间", key: "result_time", width: "120px" },
  { title: "结算状态", key: "result_status" },
  { title: "原始字符串", key: "result_rawstring" },
  { title: "下注前金额", key: "before_bet_money" },
]);

const canQuery = computed(
  () =>
    !!groupNickName.value &&
    !!playerStore.selected &&
    !!form.value.startTime &&
    !!form.value.endTime,
);

const isSelected = (name) => playerStore.selected?.playername === name;

const selectPlayer = (name) => {
  playerStore.setSelectedByName(name);
};

const resetForm = () => {
  form.value.startTime = "";
  form.value.endTime = "";
};

const resetTable = () => {
  rows.value = [];
};

watch(model, async (open) => {
  if (!open) {
    resetForm();
    resetTable();
    playerStore.clearSelected();
    return;
  }
  await playerStore.fetchPlayers();
});

watch(groupNickName, () => {
  resetForm();
  resetTable();
  playerStore.clearSelected();
});

const queryBetData = async () => {
  if (!canQuery.value) return;

  loading.value = true;
  try {
    const res = await getBetDetailsByName({
      group_nickname: groupNickName.value,
      name: playerStore.selected.playername,
      startTime: form.value.startTime,
      endTime: form.value.endTime,
    });

    if (res?.code !== 200) {
      notify.error(res?.msg ?? "查询失败");
      return;
    }

    rows.value = (res.data || []).map(mapBetRow);
    notify.success(res.msg);
  } catch (err) {
    notify.error("查询下注流水失败");
  } finally {
    loading.value = false;
  }
};

const mapBetRow = (r) => ({
  nickname: r.nickname,
  before_bet_money: r.before_bet_money ?? 0,
  betMoney: r.betMoney ?? 0,
  bet_format: r.bet_format ?? 0,
  bet_order: r.bet_order ?? 0,
  raw_money: r.raw_money ?? 0,
  result: r.result ?? 0,
  result_rawstring: r.result_rawstring ?? 0,
  result_status: r.result_status ?? 0,
  shoe: r.shoe ?? 0,
  bet_time: r.bet_time ?? 0,
  result_time: r.result_time ?? 0,
});

const close = () => {
  model.value = false;
};
</script>
