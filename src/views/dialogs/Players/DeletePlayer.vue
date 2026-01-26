<template>
  <BaseDialog
    v-model="model"
    title="删除选手"
    icon="mdi-alert"
    maxWidth="360"
    confirmText="删除"
    confirmColor="error"
    :loading="loading"
    @confirm="confirm"
  >
    <div class="text-body-2">
      确定要删除选手
      <strong class="text-error">{{ player?.playername }}</strong>
      吗？
    </div>
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

const loading = ref(false);

/* reset state when dialog opens */
watch(model, (open) => {
  if (open) {
    loading.value = false;
  }
});

const confirm = async () => {
  if (!props.player || loading.value) return;

  loading.value = true;
  try {
    await store.deletePlayer(props.player.playername);

    notify.success("删除成功");
    model.value = false;
  } catch (err) {
    notify.error(
      err?.response?.data?.msg || "删除失败"
    );
  } finally {
    loading.value = false;
  }
};
</script>
