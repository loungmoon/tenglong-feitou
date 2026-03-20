<template>
  <v-dialog v-model="model" max-width="1000" persistent>
    <v-card>
      <!-- Header -->
      <v-card-title class="bg-grey-lighten-4">
        <div class="d-flex align-center w-100">
          <v-icon class="mr-2">mdi-cog</v-icon>
          <span class="text-subtitle-1 font-weight-medium"> 每局盈亏明细 </span>

          <v-spacer />

          <v-btn icon variant="text" size="small" @click="model = false">
            <v-icon size="18">mdi-close</v-icon>
          </v-btn>
        </div>
      </v-card-title>

      <!-- Body -->
      <v-card-text>
        <v-row>
          <!-- Left: Filters -->
          <v-col cols="12" md="4">
            <v-card class="pa-3">
              <!-- Date Picker -->
              <v-menu v-model="dateMenu" :close-on-content-click="false">
                <template #activator="{ props }">
                  <v-text-field
                    v-bind="props"
                    :model-value="formattedDate"
                    label="日期"
                    density="compact"
                    variant="outlined"
                    readonly
                  />
                </template>

                <v-date-picker
                  v-model="date"
                  locale="zh-CN"
                  @update:model-value="dateMenu = false"
                />
              </v-menu>

              <!-- Shoe & Round -->
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
              <v-btn block color="#d17b4d" class="mt-4" @click="getDetails">
                查询某天某靴某局所有下注选手明细
              </v-btn>
            </v-card>
          </v-col>

          <!-- Right: Table -->
          <v-col cols="12" md="8">
            <v-card>
               <div style="overflow-x: auto;">
              <v-table fixed-header height="500">
                <thead>
                  <tr>
                    <th v-for="h in headers" :key="h.key" style="white-space: nowrap;">
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
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed,watch } from "vue";
import { useGroupPullStore } from "@/stores/group.store";
import { useNotify } from "@/composables/useNotifiy";
import { getPlayerDetailsQuery } from "@/api/data.api";

/* dialog */
const model = defineModel();

/* filters */
const date = ref(new Date());
const dateMenu = ref(false);

const form = ref({
  shoe: null,
  round: null,
});

const resetForm = () => {
  form.value.shoe = null;
  form.value.round = null;
  rows.value = [];
};

const notify = useNotify();

const groupStore = useGroupPullStore();
const loading = ref(false);
const rows = ref([]);

/* format date */
const formatDate = (value) => {
  if (!value) return "";

  const d = new Date(value);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formattedDate = computed(() => formatDate(date.value));
const groupNickName = computed(
  () => groupStore.setting?.group_nickname ?? null,
);

const headers = computed(() => [
  { title: "闲", key: "x" },
  { title: "庄", key: "z" },
  { title: "闲对", key: "xd" },
  { title: "庄对", key: "zd" },
  { title: "和", key: "h" },
  { title: "幸运6", key: "l" },
  { title: "完美", key: "m" },
  { title: "任意", key: "d" },
  { title: "庄闲洗码", key: "xml_zx" },
  { title: "三宝洗码", key: "xml_sb" },
  { title: "庄闲盈亏", key: "zx_yl" },
  { title: "三宝盈亏", key: "sb_yl" },
  { title: "有效流水", key: "yxxz" },
]);

watch(model, (val) => {
  if (!val) {
    resetForm();
  }
});

const getDetails = async () => {
  if (!groupNickName.value) return;

  if (!formattedDate.value) {
    notify.error("请选择日期");
    return;
  }

  if (!form.value.shoe || !form.value.round) {
    notify.error("请输入靴号和局号");
    return;
  }

  loading.value = true;

  try {
    const res = await getPlayerDetailsQuery({
      group_nickname: groupNickName.value,
      shoe: Number(form.value.shoe),
      round: Number(form.value.round),
      date: formattedDate.value,
    });

    if (res?.code !== 200) {
      notify.error(res?.msg ?? "查询失败");
      return;
    }
    rows.value = (res.data || []).map(mapScoreRow);
    notify.success(res.msg);
  } catch (err) {
    notify.error("获取点数统计失败");
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const mapScoreRow = (r) => ({
  z: r.z ?? 0,
  x: r.x ?? 0,
  zd: r.zd ?? 0,
  xd: r.xd ?? 0,
  h: r.h ?? 0,
  m: r.m ?? 0,
  l: r.l ?? 0,
  d: r.d ?? 0,
  xml_zx:r.xml_zx ?? 0,
  xml_sb:r.xml_sb ?? 0,
  zx_yl:r.zx_yl ?? 0,
  sb_yl:r.sb_yl ?? 0,
  yxxz:r.yxxz ?? 0,

});
</script>
