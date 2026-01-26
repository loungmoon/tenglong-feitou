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
        v-model="name"
        label="选手名称"
        variant="outlined"
        density="comfortable"
        :rules="rules"
      />

      <v-checkbox
        v-model="isVirtual"
        label="是否虚拟"
        color="success"
        density="compact"
      />
    </v-form>
  </BaseDialog>
</template>

<script setup>
import { ref, watch } from "vue";
import BaseDialog from "@/components/common/BaseDialog.vue";
import { usePlayerStore } from "@/stores/player.store";
import { useNotify } from "@/composables/useNotifiy";

const model = defineModel({ type: Boolean });

const store = usePlayerStore();
const notify = useNotify();

const formRef = ref(null);
const name = ref("");
const isVirtual = ref(false);
const loading = ref(false);

const rules = [(v) => !!v?.trim() || "选手名称不能为空"];

watch(model, (open) => {
  if (open) {
    name.value = "";
    isVirtual.value = false;
    formRef.value?.resetValidation();
  }
});

const confirm = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  loading.value = true;
  try {
    await store.createPlayer({
      name: name.value.trim(),
      is_virtual: isVirtual.value ? 1 : 0,
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
