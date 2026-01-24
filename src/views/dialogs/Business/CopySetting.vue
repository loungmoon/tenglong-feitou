<template>
  <BaseDialog
    v-model="model"
    title="提示"
    icon="mdi-cog"
    max-width="360"
    confirm-btn="确定"
    :loading="loading"
    @confirm="confirm"
  >
    <div class="text-body-2 text-medium-emphasis text-center">
      分表复制成功？
    </div>
  </BaseDialog>
</template>

<script setup>
import { ref } from 'vue'
import BaseDialog from '@/components/common/BaseDialog.vue'

const model = defineModel({ type: Boolean })
const loading = ref(false)

const confirm = async () => {
  if (loading.value) return

  try {
    loading.value = true

    // WAIT API (optional)
    // await api.copyTableConfirm()
    console.log("confirm")
    model.value = false
  } finally {
    loading.value = false
  }
}
</script>
