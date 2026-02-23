<template>
  <BaseDialog
    v-model="model"
    title="确认退出"
    icon="mdi-logout"
    icon-color="error"
    confirm-btn="退出登录"
    confirm-color="error"
    :loading="loading"
    @confirm="confirmLogout"
  >
    <div class="text-center">您确定要退出登录吗？</div>
  </BaseDialog>
</template>

<script setup>
import { ref } from "vue";
import BaseDialog from "@/components/common/BaseDialog.vue";
import { useRouter } from "vue-router";
import { clearToken } from "@/utils/request";
import { useGroupPullStore } from "@/stores/group.store"
import { usePlayerStore } from "@/stores/player.store"
import { useResultSettingStore } from "@/stores/resultsetting.store"

const router = useRouter();
const group = useGroupPullStore();
const player = usePlayerStore();
const resultsetting = useResultSettingStore();

const model = defineModel({ type: Boolean });
const loading = ref(false);

const confirmLogout = async () => {
  if (loading.value) return;

  loading.value = true;
  try {
    model.value = false;
    clearToken();
    group.$reset();
    player.reset();
    resultsetting.reset();

    await router.replace("/login");
  } finally {
    loading.value = false;
  }
};
</script>
