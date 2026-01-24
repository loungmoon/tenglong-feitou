<template>
  <BaseDialog
    v-model="model"
    title="新增选手"
    icon="mdi-account-plus"
    :loading="loading"
    @confirm="confirm"
  >
    <v-text-field
      v-model="name"
      label="选手名称"
      :rules="rules"
      variant="outlined"
      density="comfortable"
    />

    <v-checkbox
      v-model="is_virtual"
      label="是否虚拟"
      color="success"
      density="compact"
    />
  </BaseDialog>
</template>

<script setup>
import { ref } from "vue";
import BaseDialog from "@/components/common/BaseDialog.vue";
import { usePlayerStore } from "@/stores/player.store";
import { useNotify } from "@/composables/useNotifiy";

const model = defineModel({ type: Boolean });

const notify = useNotify();
const store = usePlayerStore();

const name = ref("");
const is_virtual = ref(false); //（0 不是 1 是）
const loading = ref(false);

const rules = [(v) => !!v || "选手名称不能为空"];

const confirm = async () => {
  if (!name.value) return;

  loading.value = true;
  try {
    await store.createPlayer({
      name: name.value,
      is_virtual: is_virtual.value ? 1 : 0,
    });
    notify.success("新增选手成功");
     name.value = null,
     is_virtual.value = false
    model.value = false;
  } catch (err) {
    notify.error(err);
  } finally {
    loading.value = false;
  }
};
</script>
