<template>
  <BaseDialog
    v-model="model"
    title="置顶选手"
    icon="mdi-arrow-up-bold"
    maxWidth="360"
    confirmText="置顶"
    :loading="loading"
    @confirm="confirm"
  >
    <div class="text-body-2">
      确定要将选手
      <strong class="text-primary">{{ player?.playername }}</strong>
      置顶吗？
    </div>
  </BaseDialog>
</template>

<script setup>
import BaseDialog from "@/components/common/BaseDialog.vue";
import { usePlayerStore } from "@/stores/player.store";
import { useNotify } from "@/composables/useNotifiy";
import { ref } from "vue";

const model = defineModel({ type: Boolean });

const props = defineProps({
  player: {
    type: Object,
    default: null,
  },
});

const store = usePlayerStore();
const notify = useNotify();
const loading = ref(false);

const confirm = async () => {
  if (!props.player) return;

  loading.value = true;
  try {
    await store.topPlayer(props.player);
    notify.success("置顶选手成功");
    model.value = false;
  } catch (e) {
    notify.error(e);
  } finally {
    loading.value = false;
  }
};
</script>

