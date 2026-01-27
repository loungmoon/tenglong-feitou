<template>
  <v-col cols="12" md="6">
    <div class="text-caption mb-1">{{ label }}</div>

    <v-card
      class="image-box"
      variant="outlined"
      @click="openFile"
    >
      <template v-if="modelValue">
        <div class="img-wrapper">
          <v-img :src="modelValue" cover/>

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
      hidden
      accept="image/*"
      @change="onFileChange"
    />
  </v-col>
</template>

<script setup>
import { ref } from "vue";
import { uploadImageApi } from "@/api/opt.api";
import { useNotify } from "@/composables/useNotifiy";

const modelValue = defineModel(String);
defineProps({ label: String });

const inputRef = ref(null);
const notify = useNotify();

const openFile = () => inputRef.value.click();

const onFileChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const fd = new FormData();
  fd.append("file", file);

  try {
    const res = await uploadImageApi(fd);
    modelValue.value = res.data.data.url;
    notify.success("图片上传成功");
  } catch {
    notify.error("上传失败");
  } finally {
    inputRef.value.value = "";
  }
};

const removeImage = () => {
  modelValue.value = "";
};
</script>

<style scoped>
.image-box {
  position: relative;
  cursor: pointer;
}

.img-wrapper {
  position: relative;
  height: 140px;
}

.delete-btn {
  position: absolute;
  top: 4px;
  inset-inline-end: 4px; /* RTL-safe */
  z-index: 10;
}

.empty-box {
  height: 160px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

</style>
