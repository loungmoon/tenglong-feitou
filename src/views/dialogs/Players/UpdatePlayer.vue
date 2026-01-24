<template>
  <BaseDialog
    v-model="model"
    title="修改选手"
    icon="mdi-account-edit"
    maxWidth="400"
    @confirm="confirm"
  >
    <v-text-field
      ref="input"
      v-model="name"
      label="选手名称"
      variant="outlined"
      density="comfortable"
      readonly
    />

    <v-text-field
      ref="input"
      v-model="new_name"
      label="新的选手名称"
      variant="outlined"
      density="comfortable"
      clearable
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
import { ref, watch } from "vue";
import BaseDialog from "@/components/common/BaseDialog.vue";
import { usePlayerStore } from "@/stores/player.store";
import { useNotify } from "@/composables/useNotifiy";

const model = defineModel({ type: Boolean });

const props = defineProps({
  player: {
    type: Object,
    default: null,
  },
});

const store = usePlayerStore();
const notify = useNotify();

const name = ref("");
const new_name = ref("");
const is_virtual = ref(false);
const loading = ref(false);

watch(model, (open) => {
  if (open && props.player) {
    name.value = props.player.playername;
    new_name.value = "";
    is_virtual.value = !!props.player.is_virtual;
  }
});

const confirm = async () => {
  if (!props.player) return;

  loading.value = true;
  try {
    await store.updatePlayer({
      name: name.value,
      new_name: new_name.value || name.value, // fallback
      is_virtual: is_virtual.value ? 1 : 0,
    });

    notify.success("修改选手成功");
    model.value = false;
  } catch (e) {
    notify.error(e);
  } finally {
    loading.value = false;
  }
};
</script>


