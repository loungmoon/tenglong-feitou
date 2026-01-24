<template>
  <BaseDialog
    v-model="model"
    title="需要同步提示!"
    icon="mdi-cog"
    max-width="500"
    :loading="loading"
    @confirm="confirm"
  >
    <v-card-text class="text-medium-emphasis">
      您需要将所有选手的剩余分 同步给 初始分 吗?
    </v-card-text>
  </BaseDialog>
</template>

<script setup>
import { ref } from "vue";
import BaseDialog from "@/components/common/BaseDialog.vue";

const model = defineModel({ type: Boolean });
const loading = ref(false);

const confirm = async () => {
  if (loading.value) return;

  try {
    loading.value = true;
                   
    // WAIT API
    // await api.syncAllPlayerPoints()
    console.log("Confirm")
    model.value = false;
  } finally {
    loading.value = false;
  }
};
</script>
