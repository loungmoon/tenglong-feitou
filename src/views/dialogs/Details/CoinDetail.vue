<template>
  <v-dialog v-model="model" max-width="1100" persistent>
    <v-card>
      <v-card-title
        class="d-flex justify-space-between align-center bg-grey-lighten-3"
      >
        <div class="d-flex align-center">
          <v-icon class="mr-2" color="primary">mdi-chart-box</v-icon>
          <span class="font-weight-bold">三宝占成统计</span>
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
            </v-row>

            <!-- Buttons -->
            <v-btn block color="#d17b4d" class="mb-2" @click="getScoreByShoe()">
              按靴查询明细
            </v-btn>
            <v-btn block color="#d17b4d" class="mb-2" @click="getData()">
              按天查询汇总
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
import { useGroupPullStore } from "@/stores/group.store";
import { getStatisticSBPercentage } from "@/api/data.api";
import { useNotify } from "@/composables/useNotifiy";

const model = defineModel({ type: Boolean });
const notify = useNotify();

const groupStore = useGroupPullStore();

const loading = ref(false);
const startMenu = ref(false);
const endMenu = ref(false);

const form = ref({
  shoe: null,
  startTime: "",
  endTime: "",
});

const rows = ref([]);
const tableMode = ref("ByShoe");

const groupNickName = computed(() => groupStore.setting.group_nickname);

const headersMap = {
  ByShoe: [
    { title: "靴", key: "username" },
    { title: "闲对", key: "reference_name" },
    { title: "庄对", key: "sb_yl" },
    { title: "和", key: "xml_sb" },
    { title: "完美", key: "xml_zx" },
    { title: "任意", key: "zx_yl" },
    { title: "三宝幸运6对应总投注", key: "yxxz" },
    { title: "开奖结果", key: "zx_yl" },
    { title: "选手总赢亏", key: "yxxz" },
    { title: "公司总利润", key: "yxxz" },
  ],
  normal: [
    { title: "日期", key: "username" },
    { title: "三宝总投注分", key: "cc" },
    { title: "三宝选手赢亏总分", key: "reference_name" },
    { title: "幸运6总投注分", key: "sb_yl" },
    { title: "幸运6选手赢亏总分", key: "sb_xz" },
    { title: "完美对子投注分", key: "xml_sb" },
    { title: "完美对子选手赢亏总分", key: "xml_sb" },
    { title: "任意对子总投注分", key: "xml_sx" },
    { title: "任意对子选手赢亏总分", key: "xz_xz" },
    { title: "公司利润总分", key: "xz_yl" },
  ],
};

const headers = computed(() => headersMap[tableMode.value]);

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

const resetForm = () => {
  form.value.shoe = null;
  form.value.endTime = "";
  form.value.startTime = "";
};

const resetTable = () => {
  rows.value = [];
};

watch(model, async (open) => {
  if (!open) {
    resetForm();
    resetTable();
    return;
  }
});

watch(groupNickName, () => {
  resetForm();
  resetTable();
});

const getScoreByShoe = async () => {
  if (!groupNickName.value) return;
  if (!form.value.shoe || !form.value.endTime || !form.value.startTime) {
    notify.error("请输入靴号、开始时间和结束时间");
    return;
  }
  tableMode.value = "ByShoe";
  loading.value = true;
  try {
    const res = await getStatisticSBPercentage({
      group_nickname: groupNickName.value,
      shoe: form.value.shoe,
      startTime: form.value.startTime,
      endTime: form.value.endTime,
    });

    if (res?.code !== 200) {
      notify.error(res?.msg ?? "查询失败");
      return;
    }
    rows.value = (res.data || []).map(mapScoreRow);
    notify.success(res.msg);
  } catch {
    notify.error("获取点数统计失败");
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

const getData = async () => {
  tableMode.value = "normal";
};

const close = () => {
  model.value = false;
};
</script>
