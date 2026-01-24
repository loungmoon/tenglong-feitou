<template>

    <v-checkbox
      v-model="form[enableKey]"
      :label="`自动发送文本 ${index}`"
      density="compact"
    />

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

    <v-textarea
      v-model="form[textKey]"
      variant="outlined"
      auto-grow
      rows="3"
      :rules="form[enableKey] ? [required] : []"
      label="发送内容"
    />
  
</template>

<script setup>
const props = defineProps({
  modelValue: Object,
  index: Number,
});

const form = props.modelValue;

const enableKey = `auto_send_text${props.index}`;
const secondKey = `second_send_text${props.index}`;
const textKey = `text${props.index}_after_betreport`;

const required = v => !!v || "必填";
const positive = v => v > 0 || "必须大于 0";
</script>
