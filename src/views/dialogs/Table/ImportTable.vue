<template>
  <BaseDialog
    v-model="model"
    title="导入表格"
    icon="mdi-file-import"
    :loading="loading"
    @confirm="confirm"
  >
    <v-file-input
      v-model="file"
      label="选择表格文件"
      accept=".xlsx,.xls"
      show-size
    />
  </BaseDialog>
</template>

<script setup>
import { ref } from 'vue'
import BaseDialog from '@/components/common/BaseDialog.vue'
// import { importTableApi } from '@/api/table'

const model = defineModel({ type: Boolean })
const file = ref(null)
const loading = ref(false)

const confirm = async () => {
  if (!file.value) return
  loading.value = true
  try {
    // await importTableApi(file.value)
    model.value = false
  } finally {
    loading.value = false
  }
}
</script>
