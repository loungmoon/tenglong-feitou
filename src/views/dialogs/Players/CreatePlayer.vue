<template>
  <BaseDialog
    v-model="model"
    title="新增选手"
    icon="mdi-account-plus"
    :loading="loading"
    @confirm="confirm"
  >
    <v-form ref="formRef">
      <v-text-field
        v-model="form.name"
        label="选手名称"
        variant="outlined"
        density="comfortable"
        :rules="rules"
      />

      <v-checkbox
        v-model="form.isVirtual"
        label="是否虚拟"
        color="success"
        density="compact"
      />
    </v-form>
  </BaseDialog>
</template>

<script setup>
import { ref, reactive, watch } from "vue";
import BaseDialog from "@/components/common/BaseDialog.vue";
import { usePlayerStore } from "@/stores/player.store";
import { useNotify } from "@/composables/useNotifiy";

const model = defineModel({ type: Boolean });

const store = usePlayerStore();
const notify = useNotify();

const formRef = ref(null);
const loading = ref(false);

const form = reactive({
  name:"",
  isVirtual: false,
})

const rules = [(v) => !!v?.trim() || "选手名称不能为空"];

const resetForm = () =>{
  form.name = "";
  form.isVirtual = false;
  formRef.value?.resetValidation();
}

watch(
  () => model.value,
  (open) => {
    if (open) resetForm();
  },
  { flush: "post" }
);

const confirm = async () => {
  const formInstance = formRef.value;
  if (!formInstance || loading.value) return;

  const { valid } = await formInstance.validate();
  if (!valid) return;

  loading.value = true;
  try {
    await store.createPlayer({
      name: form.name.trim(),
      is_virtual: form.isVirtual ? 1 : 0,
    });

    notify.success("新增选手成功");
    model.value = false;
  } catch (err) {
    notify.error(err?.response?.data?.msg || "新增选手失败");
  } finally {
    loading.value = false;
  }
};
</script>
