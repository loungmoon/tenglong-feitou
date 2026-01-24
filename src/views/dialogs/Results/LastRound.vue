<!-- dialogs/Table/LastRound.vue -->
<template>
  <BaseDialog
    v-model="model"
    title="最近一局"
    icon="mdi-history"
    confirmText="跳转"
    :loading="loading"
    @confirm="confirm"
  >
    <div class="text-body-2">
      跳转到最近一局数据？
    </div>
  </BaseDialog>
</template>

<script setup>
import { ref } from 'vue'
import BaseDialog from '@/components/common/BaseDialog.vue'
// import { goLastRoundApi } from '@/api/table'

const model = defineModel({ type: Boolean })
const loading = ref(false)

const confirm = async () => {
  loading.value = true
  try {
    // await goLastRoundApi()
    model.value = false
  } finally {
    loading.value = false
  }
}
</script>
