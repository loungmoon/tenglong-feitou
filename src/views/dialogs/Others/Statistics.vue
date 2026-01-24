<template>
  <BaseDialog
    v-model="model"
    title="统计停止"
    :loading="loading"
    icon="mdi-cog"
    icon-color="info"
    confirm-color="info"
    @confirm="handleConfirm"
  >
    <div class="d-flex align-center">
      <v-icon color="info" class="mr-1"> mdi-help-circle-outline </v-icon>
      您确定要停止统计吗？
    </div>
  </BaseDialog>
</template>

<script setup>
import { ref } from 'vue'
import BaseDialog from '@/components/common/BaseDialog.vue'

const model = defineModel({ type: Boolean });
const loading = ref(false);

const handleConfirm = async() => {
  if (loading.value) return
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1500))
    model.value = false
  } finally {
    loading.value = false
  }
}
</script>
