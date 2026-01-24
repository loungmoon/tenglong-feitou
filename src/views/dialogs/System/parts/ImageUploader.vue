<template>
  <v-col cols="12" md="6">
    <v-card
      variant="outlined"
      class="image-box"
      height=auto
      @click="selectFile"
    >
      <!-- Image -->
      <template v-if="modelValue">
        <v-img :src="modelValue" height="140" cover />
      </template>

      <!-- Empty -->
      <template v-else>
        <div class="empty-box">
          <v-icon size="48">mdi-image-plus</v-icon>
          <div class="text-caption mt-2">{{ label }}</div>
        </div>
      </template>

      <!-- Delete -->
      <v-btn
        v-if="modelValue"
        icon="mdi-close"
        size="x-small"
        class="delete-btn"
        @click.stop="clear"
      />

      <!-- Hidden input -->
      <input
        ref="inputRef"
        type="file"
        accept="image/*"
        hidden
        @change="onFileChange"
      />
    </v-card>
  </v-col>
</template>

<script setup>
import { ref } from "vue";
import { uploadImageApi } from "@/api/opt.api";
import { useNotify } from "@/composables/useNotifiy";

/* ---------- Props ---------- */
const props = defineProps({
  modelValue: String,
  label: {
    type: String,
    default: "Upload image",
  },
});

/* ---------- Emits ---------- */
const emit = defineEmits(["update:modelValue"]);

/* ---------- State ---------- */
const inputRef = ref(null);
const loading = ref(false);
const notify = useNotify();

/* ---------- Open file ---------- */
const selectFile = () => {
  inputRef.value?.click();
};

/* ---------- Upload ---------- */
const onFileChange = async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("image", file);

  loading.value = true;
  try {
    const res = await uploadImageApi(formData);
    emit("update:modelValue", res.data.url);
    notify.success("Image uploaded");
  } catch {
    notify.error("Upload failed");
  } finally {
    loading.value = false;
  }
};

/* ---------- Clear ---------- */
const clear = () => {
  emit("update:modelValue", "");
  if (inputRef.value) inputRef.value.value = "";
};
</script>


<style scoped>
.image-box {
  position: relative;
  cursor: pointer;
}

.empty-box {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.delete-btn {
  position: absolute;
  top: 4px;
  right: 4px;
}
</style>
