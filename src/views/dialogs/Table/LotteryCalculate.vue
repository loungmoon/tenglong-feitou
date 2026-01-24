<template>
  <BaseDialog
    v-model="model"
    title="开奖计算"
    icon="mdi-calculator"
    confirmText="开始计算"
    :loading="loading"
    @confirm="confirm"
  >
    <div class="text-body-2">
      确定开始进行开奖计算？
    </div>
  </BaseDialog>
</template>

<script setup>
import { ref } from 'vue'
import BaseDialog from '@/components/common/BaseDialog.vue'
// import { calculateLotteryApi } from '@/api/table'

const model = defineModel({ type: Boolean })
const loading = ref(false)

const confirm = async () => {
  loading.value = true
  try {
    // await calculateLotteryApi()
    model.value = false
  } finally {
    loading.value = false
  }
}
</script>
