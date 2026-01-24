<template>
  <BaseDialog
    v-model="model"
    title="投注表截图"
    icon="mdi-camera"
    :loading="loading"
    @confirm="confirm"
  >
    <div class="text-body-2">
      是否生成投注表截图？
    </div>
  </BaseDialog>
</template>

<script setup>
import { ref } from 'vue'
import BaseDialog from '@/components/common/BaseDialog.vue'
// import { captureBetApi } from '@/api/table'

const model = defineModel({ type: Boolean })
const loading = ref(false)

const confirm = async () => {
  loading.value = true
  try {
    // await captureBetApi()
    model.value = false
  } finally {
    loading.value = false
  }
}
</script>
