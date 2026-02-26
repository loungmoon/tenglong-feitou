<template>
  <BaseDialog
    v-model="model"
    title="需要同步提示!"
    icon="mdi-cog"
    max-width="500"
    :loading="loading"
    @confirm="confirm"
  >
    <v-card-text class="text-black">
      您需要将所有选手的剩余分同步给初始分吗?
    </v-card-text>
  </BaseDialog>
</template>

<script setup>
import { ref, computed } from "vue";
import BaseDialog from "@/components/common/BaseDialog.vue";
import { synchronizePoints } from "@/api/system.api";
import { useNotify } from "@/composables/useNotifiy";
import { useGroupPullStore } from "@/stores/group.store";

const model = defineModel({ type: Boolean });
const loading = ref(false);
const notify = useNotify();
const groupStore = useGroupPullStore();

const groupNickname = computed(() => groupStore.setting.group_nickname);

const confirm = async () => {
  if (loading.value) return;

  if (!groupNickname.value) {
    notify.error("未找到群昵称");
    return;
  }

  loading.value = true;
  try {
    const res = await synchronizePoints({
      group_nickname: groupNickname.value,
    });

    notify.success(res.msg);
    model.value = false;
  } catch (err) {
    notify.error(err?.message || "修改失败，请稍后再试");
  } finally {
    loading.value = false;
  }
};
</script>
