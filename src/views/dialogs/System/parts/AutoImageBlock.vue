<template>
  <div>
    <!-- Enable -->
    <v-checkbox
      v-model="form[enableKey]"
      :label="`自动发送图 ${index}`"
      density="compact"
    />

    <!-- Seconds -->
    <div class="d-flex align-center gap-2 mb-2">
      <v-text-field
        v-model.number="form[secondKey]"
        density="compact"
        variant="outlined"
        hide-details
        style="max-width: 80px"
        :rules="form[enableKey] ? [positive] : []"
      />
      <span class="text-caption">秒后发送</span>
    </div>

    <!-- Image Card -->
    <v-card
      class="image-box mb-2"
      variant="outlined"
      height="110"
      @click="openFile"
    >
      <template v-if="form[imgKey]">
        <v-img :src="form[imgKey]" height="110" cover />
        <v-btn
          icon="mdi-close"
          size="x-small"
          class="delete-btn"
          @click.stop="removeImage"
        />
      </template>

      <template v-else>
        <div class="empty-box">
          <v-icon size="36">mdi-image-plus</v-icon>
          <div class="text-caption mt-1">点击上传图片</div>
        </div>
      </template>
    </v-card>

    <!-- Hidden Input -->
    <input
      ref="inputRef"
      type="file"
      accept="image/*"
      hidden
      @change="onFileChange"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { uploadImageApi } from "@/api/opt.api";
import { useNotify } from "@/composables/useNotifiy";

/* ---------- Props ---------- */
const props = defineProps({
  modelValue: Object,
  index: Number,
  type: {
    type: String,
    validator: v => ["start", "betreport"].includes(v),
  },
});

/* ---------- Emits ---------- */
const emit = defineEmits(["update:modelValue"]);

/* ---------- Form ---------- */
const form = props.modelValue;

const suffix =
  props.type === "start" ? "after_start" : "after_betreport";

const enableKey = `auto_send_img${props.index}_${suffix}`;
const secondKey = `second_send_img${props.index}_${suffix}`;
const imgKey = `img${props.index}_${suffix}`;

/* ---------- State ---------- */
const inputRef = ref(null);
const loading = ref(false);
const notify = useNotify();

/* ---------- Rules ---------- */
const positive = v => v > 0 || "Must be greater than 0";

/* ---------- Actions ---------- */
const openFile = () => {
  form[enableKey] = true;
  inputRef.value?.click();
};

const onFileChange = async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const fd = new FormData();
  fd.append("image", file);

  loading.value = true;
  try {
    const res = await uploadImageApi(fd);

    form[imgKey] = res.data.url;
    emit("update:modelValue", { ...form });

    notify.success("Image uploaded");
  } catch {
    notify.error("Upload failed");
  } finally {
    loading.value = false;
  }
};

const removeImage = () => {
  form[imgKey] = "";
  emit("update:modelValue", { ...form });
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
