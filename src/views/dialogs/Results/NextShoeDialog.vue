<template>
  <BaseDialog
    v-model="model"
    title="进入下一靴"
    confirmText="确认"
    :loading="loading"
    @confirm="confirm"
  >
    <div class="text-center text-body-1">
      确认在
      <span class="font-weight-bold text-primary">
        【 台号 {{ deskNumber }} 】
      </span>
      进入下一靴？
    </div>
  </BaseDialog>
</template>

<script setup>
import { ref,computed } from "vue";
import BaseDialog from "@/components/common/BaseDialog.vue";
import { useGroupPullStore } from "@/stores/group.store";
import { proceedNextShoeApi } from "@/api/opt.api";
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
const groupStore = useGroupPullStore();

const groupNickName = computed(
  ()=> groupStore.setting.group_nickname
)

const confirm = async () => {
  loading.value = true;

  if(!groupNickName.value){
    return;
  }
  try {
    const res = await proceedNextShoeApi({
      group_nickname: groupNickName.value,
      desk_number: deskNumber,
    });

    notify.success(res.msg || "成功进入下一靴");
    emit("success");
    model.value = false;
  } catch (e) {
    notify.error("进入下一靴失败");
  } finally {
    loading.value = false;
  }
};
</script>
