<template>
  <BaseDialog
    v-model="model"
    title="进入下一局"
    confirmText="确认进入下一局？"
    icon="mdi-skip-next-circle"
    :loading="loading"
    @confirm="confirm"
  >
    <div class="text-center text-body-1">
      确认在
      <span class="font-weight-bold text-primary">
        【 台号 {{ deskNumber }} 】
      </span>
      进入下一局？
    </div>
  </BaseDialog>
</template>

<script setup>
import { ref } from "vue";
import BaseDialog from "@/components/common/BaseDialog.vue";
import { nextRoundApi } from "@/api/opt.api";
import { useNotify } from "@/composables/useNotifiy";

const model = defineModel({ type: Boolean });

const { deskNumber } = defineProps({
  deskNumber: {
    type: [Number, String],
    required: true,
  },
});

const emit = defineEmits(["success"]);

const loading = ref(false);
const notify = useNotify();

const confirm = async () => {
  loading.value = true;
  try {
    const res = await nextRoundApi({
      desk_number: deskNumber,
    });

    notify.success(res.msg || "成功进入下一局");
    emit("success", res.data);
    model.value = false;
  } catch (err) {
    notify.error("进入下一局失败");
  } finally {
    loading.value = false;
  }
};
</script>
