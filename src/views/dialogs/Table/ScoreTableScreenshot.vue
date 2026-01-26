<template>
  <BaseDialog
    v-model="model"
    title="投注表截图"
    icon="mdi-camera"
    :loading="loading"
    maxWidth="500"
    @confirm="handleConfirm"
  >
    <div v-if="previewUrl" class="preview-wrapper">
      <img :src="previewUrl" class="preview-img" />
    </div>

    <div v-else class="text-caption text-grey">
      正在生成截图…
    </div>
  </BaseDialog>
</template>

<script setup>
import { ref, watch } from "vue"
import html2canvas from "html2canvas"
import { useUiStore } from "@/stores/ui.store"
import BaseDialog from "@/components/common/BaseDialog.vue"
import { uploadImageApi, sendScoreReportImageApi } from "@/api/opt.api"

const model = defineModel({ type: Boolean })
const loading = ref(false)
const previewUrl = ref(null)
const imageBlob = ref(null)

const uiStore = useUiStore()

/* 📸 Take screenshot when dialog opens */
watch(model, async (open) => {
  if (!open) {
    previewUrl.value = null
    imageBlob.value = null
    return
  }

  try {
    const el = uiStore.scoreTableEl
    if (!el) throw new Error("Bet table not found")

    const canvas = await html2canvas(el, {
      scale: 2,
      backgroundColor: "#ffffff",
    })

    previewUrl.value = canvas.toDataURL("image/png")

    imageBlob.value = await new Promise(resolve =>
      canvas.toBlob(resolve, "image/png")
    )
  } catch (e) {
    console.error("Screenshot error:", e)
  }
})

/* 🚀 Confirm = upload + send */
const handleConfirm = async () => {
  if (!imageBlob.value) return

  loading.value = true
  try {
    const formData = new FormData()
    formData.append("file", imageBlob.value, "bet-table.png")

    const uploadRes = await uploadImageApi(formData)

    const imageUrl =
      uploadRes?.data?.data?.data?.url ||
      uploadRes?.data?.data?.url ||
      uploadRes?.data?.url

    if (!imageUrl) throw new Error("Upload failed")

    await sendScoreReportImageApi({ imageUrl })

    model.value = false
  } catch (e) {
    console.error("Upload error:", e)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.preview-wrapper {
  display: flex;
  justify-content: center;
  padding: 8px;
}

.preview-img {
  max-width: 100%;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
