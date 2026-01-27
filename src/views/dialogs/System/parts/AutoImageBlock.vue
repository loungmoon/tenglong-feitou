<template>
  <v-checkbox
    :model-value="auto"
    :label="`自动发送图片${index}`"
    density="compact"
    @update:model-value="$emit('update:auto', $event)"
  />

  <div class="d-flex align-center gap-2 mb-2" style="margin-top: -24px;">
    <v-text-field
      type="number"
      density="compact"
      variant="outlined"
      hide-details
      style="max-width: 100px"
      :disabled="!auto"
      :model-value="seconds"
      @update:model-value="$emit('update:seconds', Number($event))"
    />
    <span class="text-caption">秒后发送</span>
  </div>

  <v-card
    class="image-box mb-2"
    variant="outlined"
    height="110"
    @click="openFile"
  >
    <template v-if="image">
      <div class="img-wrapper">
        <v-img :src="image" height="110" cover />

        <v-btn
          icon="mdi-close"
          size="x-small"
          class="delete-btn"
          @click.stop="removeImage"
        />
      </div>
    </template>

    <template v-else>
      <div class="empty-box">
        <v-icon size="36">mdi-image-plus</v-icon>
        <div class="text-caption">点击上传图片</div>
      </div>
    </template>
  </v-card>

  <input
    ref="inputRef"
    type="file"
    accept="image/*"
    hidden
    @change="onFileChange"
  />
</template>

<script setup>
import { ref } from "vue";
import { uploadImageApi } from "@/api/opt.api";
import { useNotify } from "@/composables/useNotifiy";

defineProps({
  index: {
    type: Number,
    required: true,
  },
  auto: {
    type: Boolean,
    default: false,
  },
  seconds: {
    type: Number,
    default: 0,
  },
  image: {
    type: String,
    default: "",
  },
});

const emit = defineEmits([
  "update:auto",
  "update:seconds",
  "update:image",
]);

const inputRef = ref(null);
const notify = useNotify();

const openFile = () => {
  emit("update:auto", true);
  inputRef.value?.click();
};

const onFileChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const fd = new FormData();
  fd.append("file", file);

  try {
    const res = await uploadImageApi(fd);
    emit("update:image", res.data.data.url);
    notify.success("图片上传成功");
  } catch {
    notify.error("上传失败");
  } finally {
    e.target.value = "";
  }
};

const removeImage = () => {
  emit("update:image", "");
  emit("update:auto", false);
  emit("update:seconds", 0);
};
</script>

<style scoped>
.image-box {
  position: relative;
  cursor: pointer;
}

.empty-box {
  height: 110px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.img-wrapper {
  position: relative;
}

.delete-btn {
  position: absolute;
  top: 4px;
  inset-inline-end: 4px;
}
</style>
