<template>
  <BaseDialog
    v-model="model"
    title="修改靴局"
    icon="mdi-cash-edit"
    :loading="loading"
    @confirm="confirm"
  >
    <v-card-text>
      <v-text-field
        density="compact"
        label="台号"
        v-model="localForm.deskNumber"
        readonly
      />
      <v-text-field
        v-model.number="localForm.shoe"
        label="靴号"
        type="number"
        density="compact"
      />

      <v-text-field
        v-model.number="localForm.round"
        label="局号"
        type="number"
        density="compact"
      />
    </v-card-text>
  </BaseDialog>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import BaseDialog from "@/components/common/BaseDialog.vue";
import { editShoeApi } from "@/api/opt.api";
import { useNotify } from "@/composables/useNotifiy";
import { useGroupPullStore } from "@/stores/group.store";

const model = defineModel({ type: Boolean });

const props = defineProps({
  deskNumber: {
    type: [Number, String],
    required: true,
  },
  round: {
    type: [Number, String],
    default: null,
  },
  shoe: {
    type: [Number, String],
    default: null,
  },
});

const emit = defineEmits(["success"]);

const loading = ref(false);
const notify = useNotify();
const groupStore = useGroupPullStore();
const groupNickName = computed(() => groupStore.setting?.group_nickname ?? null);

const localForm = ref({
  deskNumber: null,
  shoe: null,
  round: null,
});

watch(
  () => model.value,
  (open) => {
    if (!open) return
    localForm.value.deskNumber = props.deskNumber
    localForm.value.shoe = props.shoe
    localForm.value.round = props.round
  }
)

const confirm = async () => {
  if (loading.value) return;

  if (!localForm.value.shoe || !localForm.value.round) {
    notify.error("请输入靴号和局号");
    return;
  }

  if (!groupNickName.value) {
  notify.error("群组信息未加载，请刷新页面");
  return;
}


  loading.value = true;
  try {
    const res = await editShoeApi({
      desk_number: Number(localForm.value.deskNumber),
      shoe: Number(localForm.value.shoe),
      round: Number(localForm.value.round),
      group_nickname: groupNickName.value
    });

    notify.success(res.msg);
    emit("success", res.data || null);
    model.value = false;
  } catch (err) {
    notify.error(err.response?.data?.message);
  } finally {
    loading.value = false;
  }
};
</script>
