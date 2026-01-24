<template>
  <BaseDialog
    v-model="model"
    title="路单设置"
    icon="mdi-cog"
    max-width="600"
    :loading="loading"
    confirm-btn="确定"
    @confirm="confirm"
  >
    <v-row justify="center" dense>
      <v-col cols="8">
        <v-select
          v-model="roadStyle"
          label="路单样式"
          :items="ROAD_STYLE_OPTIONS"
          item-title="label"
          item-value="value"
          density="compact"
          variant="outlined"
          hide-details="auto"
        />
      </v-col>

      <v-col cols="8" class="mt-5">
        <v-text-field
          v-model.trim="roadName"
          label="路单名称"
          density="compact"
          variant="outlined"
          clearable
          :rules="nameRules"
          hide-details="auto"
        />
      </v-col>
    </v-row>
  </BaseDialog>
</template>

<script setup>
import { ref, watch } from "vue";
import BaseDialog from "@/components/common/BaseDialog.vue";

const model = defineModel({ type: Boolean });
const loading = ref(false);

/* backend values */
const roadStyle = ref(1);
const roadName = ref("VIP路单系统");

/* options (FIXED) */
const ROAD_STYLE_OPTIONS = [
  { label: "路单1", value: 1 },
  { label: "路单2", value: 2 },
  { label: "路单3", value: 3 },
  { label: "路单4", value: 4 },
];

/* validation */
const nameRules = [
  v => !!v || "请输入路单名称",
  v => v.length <= 20 || "名称不能超过 20 个字符",
];

/* sync when open */
watch(model, (open) => {
  if (open) {
    // WAIT API
    // const res = await api.getRoadSetting()
    // roadStyle.value = res.style
    // roadName.value = res.name

    // mock
    roadStyle.value = 1;
    roadName.value = "VIP路单系统";
  }
});

const confirm = async () => {
  if (loading.value) return;
  if (!roadName.value) return;

  try {
    loading.value = true;

    // WAIT API
    // await api.saveRoadSetting({
    //   style: roadStyle.value,
    //   name: roadName.value,
    // });

    model.value = false;
  } finally {
    loading.value = false;
  }
};
</script>
