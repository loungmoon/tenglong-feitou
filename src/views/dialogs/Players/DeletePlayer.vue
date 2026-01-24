<template>
  <BaseDialog
    v-model="model"
    title="删除选手"
    icon="mdi-alert"
    maxWidth="360"
    confirmText="删除"
    confirmColor="error"
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
import { ref } from 'vue'    
import BaseDialog from '@/components/common/BaseDialog.vue'
import { usePlayerStore } from "@/stores/player.store";
import { useNotify } from "@/composables/useNotifiy";

const notify = useNotify();
const store = usePlayerStore();

const model = defineModel({ type: Boolean })
const props = defineProps({ player: {
  type: Object,
  default: null
} })
const loading = ref(false)

const confirm = async () => {
  if (!props.player) return;
  loading.value = true
  try {
    await store.deletePlayer(props.player.playername)
    notify.success("删除成功")
    model.value = false
  } catch (e) {
    notify.error(e)
  } finally {
    loading.value = false
  }
}
</script>
