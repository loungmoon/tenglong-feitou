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
      <strong class="text-warning">
        {{ player?.playername }}
      </strong>
      吗？
    </div>

    <v-alert
      type="error"
      variant="tonal"
      density="compact"
    >
    <v-icon size="small">mdi-star-off-outline</v-icon>
       号为隐藏选手
    </v-alert>
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

watch(model, (open) => {
  if (open) {
    loading.value = false;
  }
});

const confirm = async () => {
  if (!props.player || loading.value) return;

  loading.value = true;
  try {
    await store.hidePlayer(props.player);

    notify.success("隐藏选手成功");
    model.value = false;
  } catch (err) {
    notify.error(
      err?.response?.data?.msg || "隐藏选手失败"
    );
  } finally {
    loading.value = false;
  }
};
</script>
