<template>
  <BaseDialog
    v-model="model"
    title="显示提示信息"
    icon="mdi-cog"
    max-width="500"
    confirm-btn="清空错误信息"
    :loading="loading"
    @confirm="confirmAllPlay"
  >
    <div class="d-flex justify-center py-10">
      <span class="text-body-2 text-medium-emphasis">
        是否确认清空所有错误信息？
      </span>
    </div>
  </BaseDialog>
</template>

<script setup>
import { ref } from 'vue'
import BaseDialog from '@/components/common/BaseDialog.vue'

const model = defineModel({ type: Boolean })
const loading = ref(false)

const confirmAllPlay = async () => {
  loading.value = true
  try {
    // ✅ future API call here
    // await api.clearAllErrorMessages()
    model.value = false
  } finally {
    loading.value = false
  }
}
</script>
