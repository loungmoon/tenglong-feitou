<template>
  <BaseDialog
    v-model="model"
    title="服务器地址设置"
    icon="mdi-lifebuoy"
    maxWidth="500"
    :loading="loading"
    @confirm="confirm"
  >
    <v-text-field
      v-model="url"
      label="服务器地址"
      variant="outlined"
      density="comfortable"
      placeholder="http://xxx.xxx.xxx/OptAction/?"
      hint="示例：http://xxx.xxx.xxx/OptAction/?"
      persistent-hint
      clearable
      :rules="rules"
      class="hint-red"
    />
  </BaseDialog>
  <v-snackbar
    v-model="toast.show"
    :color="toast.color"
    location="top"
    timeout="3000"
  >
    {{ toast.message }}
  </v-snackbar>
</template>

<script setup>
import { ref } from 'vue'
import BaseDialog from '@/components/common/BaseDialog.vue'

const model = defineModel({ type: Boolean })
const url = ref('http://xxx.xxx.xxx/OptAction/?')
const loading = ref(false)

const toast = ref({
  show: false,
  message: '',
  color: 'success',
})

const showToast = (message, color = 'success') => {
  toast.value = { show: true, message, color }
}

const rules = [
  v => !!v || '服务器地址不能为空',
  v => /^https?:\/\//.test(v) || '必须以 http:// 或 https:// 开头',
]

const confirm = async() => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1500))
    console.log('Server URL:', url.value)
    showToast('服务器地址保存成功', 'success')
    model.value = false
  } catch (err) {
    showToast(err.message || '保存失败', 'error')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.hint-red :deep(.v-messages__message) {
  color: #d32f2f;
}
</style>
