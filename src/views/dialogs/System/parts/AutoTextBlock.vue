<template>
  <v-checkbox
    :model-value="auto"
    :label="`自动发送文本${index}`"
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

  <v-textarea
    variant="outlined"
    auto-grow
    rows="3"
    label="发送内容"
    :model-value="text"
    @update:model-value="$emit('update:text', $event)"
  />
</template>

<script setup>
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
  text: {
    type: String,
    default: "",
  },
})

defineEmits([
  "update:auto",
  "update:seconds",
  "update:text",
])
</script>
