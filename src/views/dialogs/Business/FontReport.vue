<template>
  <BaseDialog
    v-model="model"
    title="报注字体大小"
    icon="mdi-cog"
    max-width="500"
    :loading="loading"
    confirm-btn="保存"
    @confirm="confirm"
  >
    <v-row justify="center" dense>
      <v-col cols="8">
        <v-select
          v-model="fontSize"
          label="字体大小"
          :items="FONT_SIZE_OPTIONS"
          item-title="label"
          item-value="value"
          density="compact"
          variant="outlined"
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
const fontSize = ref(3);

/* backend-safe options */
const FONT_SIZE_OPTIONS = [
  { label: "1", value: 1 },
  { label: "2", value: 2 },
  { label: "3", value: 3 },
  { label: "4", value: 4 },
  { label: "5", value: 5 },
];

/* optional: sync when dialog opens */
watch(model, (open) => {
  if (open) {
    // WAIT API
    // fontSize.value = await api.getFontSize()
    fontSize.value = 3;
  }
});

const confirm = async () => {
  if (loading.value) return;

  try {
    loading.value = true;

    // WAIT API
    // await api.updateFontSize(fontSize.value)
    console.log("FontSize", fontSize.value);
    model.value = false;
  } finally {
    loading.value = false;
  }
};
</script>
