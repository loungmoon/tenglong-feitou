<template>
  <BaseDialog
    v-model="model"
    title="提示"
    icon="mdi-alert-circle-outline"
    icon-color="warning"
    confirm-color="info"
    :loading="loading"
    @confirm="handleConfirm"
  >
    <div class="d-flex align-center justify-center">
      <v-icon color="warning" class="mr-1">
        mdi-exclamation
      </v-icon>
      还没有下注信息？
    </div>
  </BaseDialog>
</template>

<script setup>
import { ref } from 'vue';  
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
