<template>
<BaseDialog
  v-model="model"
  title="投注表截图"
  icon="mdi-camera"
>
  <v-btn color="primary" @click="handleScreenshot">
    截图
  </v-btn>

  <v-img
    v-if="previewUrl"
    :src="previewUrl"
    max-height="400"
    contain
    class="mt-3 border rounded"
  />
</BaseDialog>

</template>

<script setup>
import { ref } from "vue";
import html2canvas from "html2canvas";
import { useUiStore } from "@/stores/ui.store";
import BaseDialog from "@/components/common/BaseDialog.vue";
import { uploadImageApi, sendBetReportImageApi } from "@/api/opt.api";

const model = defineModel({ type: Boolean });
const loading = ref(false);
const previewUrl = ref("");

const uiStore = useUiStore();

const handleScreenshot = async () => {
  const el = uiStore.betTableEl
  if (!el) {
    console.error("Bet table not found")
    return
  }

  // Screenshot
  const canvas = await html2canvas(el, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
  })

  // Canvas → base64
  previewUrl.value = canvas.toDataURL("image/png")
}

</script>
