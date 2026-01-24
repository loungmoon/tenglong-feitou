<template>
  <BaseDialog
    v-model="model"
    title="初始化台上筹码"
    icon="mdi-cog"
    max-width="500"
    :loading="loading"
    @confirm="confirm"
  >
    <v-form ref="form" v-model="valid">
      <v-text-field
        v-model.number="amount"
        label="筹码数"
        variant="outlined"
        density="compact"
        type="number"
        :rules="amountRules"
        hide-details="auto"
        clearable
      />

      <v-row justify="center" class="mt-2">
        <span class="text-error text-caption">
          {{ currentTime }}
        </span>
      </v-row>
    </v-form>
  </BaseDialog>
</template>

<script setup>
import { ref, computed } from "vue";
import BaseDialog from "@/components/common/BaseDialog.vue";

const model = defineModel({ type: Boolean });

const form = ref(null);
const valid = ref(false);
const loading = ref(false);

const amount = ref(null);

const currentTime = computed(() =>
  new Date().toLocaleString()
);

const amountRules = [
  v => v !== null || "请输入筹码数",
  v => Number(v) > 0 || "筹码必须大于 0",
  v => Number.isInteger(v) || "只能输入整数",
];

const confirm = async () => {
  if (loading.value) return;

  const { valid } = await form.value.validate();
  if (!valid) return;

  try {
    loading.value = true;

    // WAIT API
    // await api.initChips({ amount })
    console.log("Init chips:", amount.value);

    model.value = false;
  } finally {
    loading.value = false;
  }
};
</script>
