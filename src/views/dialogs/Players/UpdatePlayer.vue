<template>
  <BaseDialog
    v-model="model"
    title="修改选手"
    icon="mdi-account-edit"
    maxWidth="400"
    :loading="loading"
    @confirm="confirm"
  >
    <v-form ref="formRef">
      <v-text-field
        v-model="name"
        label="当前选手名称"
        variant="outlined"
        density="comfortable"
        readonly
      />

      <v-text-field
        v-model="newName"
        label="新的选手名称"
        variant="outlined"
        density="comfortable"
        clearable
        :rules="nameRules"
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

const model = defineModel(Boolean);

const props = defineProps({
  player: {
    type: Object,
    default: null,
  },
});

const store = usePlayerStore();
const notify = useNotify();

const formRef = ref(null);
const loading = ref(false);

const name = ref("");
const newName = ref("");
const isVirtual = ref(false);

const nameRules = [
  (v) => !!v?.trim() || "新的选手名称不能为空",
  (v) => v?.trim() !== name.value || "名称未发生变化",
];

/* Reset & populate when dialog opens */
watch(model, (open) => {
  if (open && props.player) {
    name.value = props.player.playername;
    newName.value = "";
    isVirtual.value = !!props.player.is_virtual;
    formRef.value?.resetValidation();
  }
});

const confirm = async () => {
  if (!props.player) return;

  const { valid } = await formRef.value.validate();
  if (!valid || loading.value) return;

  loading.value = true;
  try {
    await store.updatePlayer({
      name: name.value,
      new_name: newName.value.trim(),
      is_virtual: isVirtual.value ? 1 : 0,
    });

    notify.success("修改选手成功");
    model.value = false;
  } catch (err) {
    notify.error(
      err?.response?.data?.msg || "修改选手失败"
    );
  } finally {
    loading.value = false;
  }
};
</script>
