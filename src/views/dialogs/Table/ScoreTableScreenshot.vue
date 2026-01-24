<template>
  <BaseDialog
    v-model="model"
    title="分数表截图"
    icon="mdi-camera-outline"
    :loading="loading"
    @confirm="confirm"
  >
    <div class="text-body-2">
      是否生成分数表截图？
    </div>
  </BaseDialog>
</template>

<script setup>
import { ref } from 'vue'
import BaseDialog from '@/components/common/BaseDialog.vue'
// import { captureScoreApi } from '@/api/table'

const model = defineModel({ type: Boolean })
const loading = ref(false)

const confirm = async () => {
  loading.value = true
  try {
    // await captureScoreApi()
    model.value = false
  } finally {
    loading.value = false
  }
}
</script>