<template>
  <BaseDialog
    v-model="model"
    title="设置是否自动开奖"
    icon="mdi-cog-outline"
    maxWidth="600"
    :loading="store.loading"
    confirmBtn="保存设置"
    @confirm="handleSubmit"
  >
    <v-form ref="formRef">
      <v-row dense align="center">
        <v-col cols="12" md="3">
          <v-checkbox
            v-model="form.active"
            label="是否启用"
            color="error"
            density="compact"
          />
        </v-col>

        <v-col cols="12" md="5">
          <v-select
            v-model="form.official_website_nickname"
            :items="nicknames"
            label="官网昵称"
            variant="outlined"
            density="compact"
            :rules="nicknameRules"
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field
            v-model="form.desk_number"
            label="台号"
            variant="outlined"
            density="compact"
            clearable
            :rules="deskRules"
          />
        </v-col>
      </v-row>

      <v-row dense>
        <v-col cols="12">
          <v-checkbox v-model="form.auto_result_report" density="compact">
            <template #label>
              <span class="text-error">自动报结果</span>
            </template>
          </v-checkbox>
        </v-col>
      </v-row>
    </v-form>
  </BaseDialog>
</template>

<script setup>
import { ref, reactive, watch, computed } from "vue"
import BaseDialog from "@/components/common/BaseDialog.vue"
import { useResultSettingStore } from "@/stores/resultsetting.store"
import { useNotify } from "@/composables/useNotifiy"

const model = defineModel({ type: Boolean })
const store = useResultSettingStore()
const notify = useNotify()

const formRef = ref(null)

/* ---------- LOCAL FORM ---------- */
const form = reactive({
  active: false,
  official_website_nickname: "",
  desk_number: "",
  auto_result_report: false,
})

/* ---------- RULES ---------- */
const nicknameRules = [
  (v) => !!v || "请选择官网昵称",
]

const deskRules = computed(() => [
  (v) => !!v || "必须填写台号",
  (v) => !v || v.length <= 10 || "台号不能超过 10 个字符",
  (v) => !v || /^[a-zA-Z0-9]+$/.test(v) || "台号只能包含字母和数字",
])

const nicknames = [
  "马尼拉",
  "卡卡湾",
  "百乐门",
  "太阳城",
  "新卡卡湾",
  "万金汇",
]

/* ---------- OPEN DIALOG ---------- */
watch(model, async (open) => {
  if (!open) return

  await store.ensureReady();

  Object.assign(form, store.setting);
})

/* ---------- SUBMIT ---------- */
const handleSubmit = async () => {
  const result = await formRef.value?.validate()
  if (!result?.valid) return

  try {
    await store.saveSetting({ ...form })
    notify.success("保存成功")
    model.value = false
  } catch (err) {
    notify.error(err || "保存失败")
  }
}
</script>

