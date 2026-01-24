<!-- dialogs/Players/HidePlayer.vue -->
<template>
  <BaseDialog
    v-model="model"
    title="隐藏选手"
    icon="mdi-eye-off"
    icon-color="warning"
    confirm-btn="确认隐藏"
    confirm-color="warning"
    :loading="loading"
    @confirm="confirm"
  >
    <div class="text-body-2 mb-2">
      确定要隐藏选手
      <strong class="text-warning">{{ player?.playername }}</strong>
      吗？
    </div>

    <v-alert
      type="info"
      variant="tonal"
      density="compact"
    >
      没有 ☆ 号的选手将被隐藏
    </v-alert>
  </BaseDialog>
</template>

<script setup>
import { ref } from "vue";
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
const loading = ref(false);

const confirm = async () => {
  if (!props.player) return;

  loading.value = true;
  try {
    await store.hidePlayer(props.player);
    notify.success("修改选手成功");
    model.value = false;
  } catch (e) {
    notify.error(e);
  } finally {
    loading.value = false;
  }
};
</script>


