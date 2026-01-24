<template>
  <BaseDialog
    v-model="visible"
    title="修改台号昵称"
    icon="mdi-cog"
    max-width="400"
    :loading="loading"
    confirm-btn="保存修改"
    @confirm="handleConfirm"
  >
  <v-form ref="formRef">
    <v-row justify="center" dense>
      <v-col cols="10">
        <v-select
          v-model="oldNickname"
          label="原台号昵称"
          :items="tableNames"
          item-title="label"
          item-value="value"
          density="compact"
          variant="outlined"
          :rules="oldNicknameRules"
          hide-details="auto"
        />
      </v-col>

      <v-col cols="10">
        <v-text-field
          v-model.trim="newNickname"
          label="新台号昵称"
          density="compact"
          variant="outlined"
          class="mt-4"
          :rules="newNicknameRules"
          hide-details="auto"
          clearable
        />
      </v-col>
    </v-row>
    </v-form>
  </BaseDialog>
</template>

<script setup>
import { ref, computed, watch } from "vue"
import BaseDialog from "@/components/common/BaseDialog.vue"
import { editDeskNickname } from "@/api/system.api"
import { useNotify } from "@/composables/useNotifiy"

const notify = useNotify()

/* dialog model */
const visible = defineModel({ type: Boolean })

/* state */
const loading = ref(false)
const oldNickname = ref("")
const newNickname = ref("")
const formRef = ref(null)

/* constants */
const tableNames = [
  { label: "凯旋1号", value: "凯旋1号" },
  { label: "辉煌一台", value: "辉煌一台" },
  { label: "辉煌二台", value: "辉煌二台" },
  { label: "辉煌三台", value: "辉煌三台" },
  { label: "辉煌四台", value: "辉煌四台" },
]

/* validation */
const oldNicknameRules = [
  v => !!v || "请选择原台号昵称",
]

const newNicknameRules = computed(() => [
  v => !!v || "请输入新台号昵称",
  v => v.length <= 10 || "昵称不能超过 10 个字符",
  v => v !== oldNickname.value || "新昵称不能与原昵称相同",
])

/* reset form when dialog closes */
watch(visible, (val) => {
  if (!val) {
    oldNickname.value = ""
    newNickname.value = ""
    loading.value = false
  }
})

/* submit */
const handleConfirm = async () => {
  if (loading.value) return

  const { valid } = await formRef.value.validate()
  if (!valid) return
  loading.value = true
  try {
    await editDeskNickname({
      old_desk_nickname: oldNickname.value,
      new_desk_nickname: newNickname.value,
    })

    notify.success("台号昵称修改成功")
    visible.value = false
  } catch (err) {
    notify.error(err?.message || "修改失败，请稍后再试")
  } finally {
    loading.value = false
  }
}
</script>
