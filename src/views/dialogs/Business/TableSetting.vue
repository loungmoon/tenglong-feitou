<template>
  <BaseDialog
    v-model="model"
    title="表格设置"
    icon="mdi-cog"
    max-width="600"
    :loading="loading"
    confirm-btn="确定"
    @confirm="handleConfirm"
  >

 <FieldSetBox title="参数设置">
      <v-row dense>
        <v-col cols="6">
          <v-select
            v-model="form.rowHeight"
            label="表格行高"
            :items="items"
            density="compact"
            variant="outlined"
          />
          <v-select
            v-model="form.headerColor"
            label="表格头颜色"
            :items="items"
            density="compact"
            variant="outlined"
          />
        </v-col>

        <v-col cols="6">
          <v-select
            v-model="form.totalHeight"
            label="表格总高"
            :items="items"
            density="compact"
            variant="outlined"
          />
          <v-select
            v-model="form.totalColor"
            label="表格合计颜色"
            :items="items"
            density="compact"
            variant="outlined"
          />
        </v-col>
      </v-row>

      <!-- Font Settings -->
      <v-row class="justify-center mt-4">
        <div class="d-flex align-center mr-6">结算表</div>
        <v-btn variant="outlined" size="small">
          表格字体 【 Arial , 12.9pt 】
        </v-btn>
      </v-row>

      <v-row class="justify-center mt-6 mb-5">
        <div class="d-flex align-center mr-6">核对表</div>
        <v-btn variant="outlined" size="small">
          表格字体 【 宋休 , 14pt 】
        </v-btn>
      </v-row>
    </FieldSetBox>

    <!-- Custom actions -->
    <template #actions>
      <v-btn
        variant="flat"
        color="grey"
        @click="resetFont"
      >
        默认表格字体
      </v-btn>

      <v-btn
        color="primary"
        variant="flat"
        :loading="loading"
        :disabled="loading"
        @click="handleConfirm"
      >
        确定
      </v-btn>
    </template>
  </BaseDialog>
</template>

<script setup>
import { ref, reactive } from 'vue'
import BaseDialog from '@/components/common/BaseDialog.vue'

const model = defineModel({ type: Boolean })
const loading = ref(false)

const items = [1, 2, 3, 4, 5]

const form = reactive({
  rowHeight: null,
  headerColor: null,
  totalHeight: null,
  totalColor: null,
})

const handleConfirm = async () => {
  loading.value = true
  try {
    console.log('Save table settings:', { ...form })
    model.value = false
  } finally {
    loading.value = false
  }
}

const resetFont = () => {
  console.log('Reset to default font')
}
</script>

