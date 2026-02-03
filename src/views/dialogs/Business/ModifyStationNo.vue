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
        <v-text-field
          v-model="deskNumber"
          label="原台号昵称"
          density="compact"
          variant="outlined"
          readonly
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
import { useResultSettingStore } from "@/stores/resultsetting.store"
import { useGroupPullStore } from "@/stores/group.store";

const notify = useNotify()
const store = useResultSettingStore()

const groupStore = useGroupPullStore();

/* dialog model */
const visible = defineModel({ type: Boolean })

/* state */
const loading = ref(false)
const newNickname = ref("")
const formRef = ref(null)

const deskNumber = computed(() => store.setting.desk_number)
const groupNickName = computed(() => groupStore.setting.group_nickname);

const newNicknameRules = computed(() => [
  v => !!v || "请输入新台号昵称",
  v => v.length <= 10 || "昵称不能超过 10 个字符",
  v => v !== deskNumber.value || "新昵称不能与原昵称相同",
])

watch(visible, (open) => {
  if (!open) {
    newNickname.value = ""
    loading.value = false
  }
})

/* submit */
const handleConfirm = async () => {
  if (loading.value) return;

  if (!groupNickName.value) return;

  const { valid } = await formRef.value.validate()
  if (!valid) return
  loading.value = true
  try {
    const res =await editDeskNickname({
      old_desk_nickname: deskNumber.value,
      new_desk_nickname: newNickname.value,
      group_nickname: groupNickName.value,
    })

    notify.success(res.msg)
    visible.value = false
  } catch (err) {
    notify.error(err?.message || "修改失败，请稍后再试")
  } finally {
    loading.value = false
  }
}
</script>
