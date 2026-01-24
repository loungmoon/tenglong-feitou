<!-- dialogs/Table/LockBootRound.vue -->
<template>
  <BaseDialog
    v-model="model"
    title="锁定靴局"
    icon="mdi-lock"
    confirmText="锁定"
    confirmColor="warning"
    :loading="loading"
    @confirm="confirm"
  >
    <div class="text-body-2 mb-2">
      确定要锁定当前靴局吗？
    </div>

    <v-alert type="info" variant="tonal" density="compact">
      当前：第 {{ boot }} 靴，第 {{ round }} 局
    </v-alert>
  </BaseDialog>
</template>

<script setup>
import { ref } from 'vue'
import BaseDialog from '@/components/common/BaseDialog.vue'
// import { lockBootRoundApi } from '@/api/table'

const model = defineModel({ type: Boolean })
const props = defineProps({
  boot: Number,
  round: Number,
})

const loading = ref(false)

const confirm = async () => {
  loading.value = true
  try {
    // await lockBootRoundApi({
    //   boot: props.boot,
    //   round: props.round,
    // })
    model.value = false
  } finally {
    loading.value = false
  }
}
</script>
