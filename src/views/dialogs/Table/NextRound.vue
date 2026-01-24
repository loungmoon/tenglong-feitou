<template>
  <BaseDialog
    v-model="model"
    title="进入下局"
    icon="mdi-skip-forward"
    confirmText="确认"
    :loading="loading"
    @confirm="confirm"
  >
    <div class="text-body-2">
      确定进入下一局？
    </div>
  </BaseDialog>
</template>

<script setup>
import { ref } from 'vue'
import BaseDialog from '@/components/common/BaseDialog.vue'
// import { nextRoundApi } from '@/api/table'

const model = defineModel({ type: Boolean })
const loading = ref(false)

const confirm = async () => {
  loading.value = true
  try {
    // await nextRoundApi()
    model.value = false
  } finally {
    loading.value = false
  }
}
</script>
