<script setup>
const model = defineModel();
const props = defineProps({
  label: String,
  required: Boolean,
});

const rules = props.required
  ? [(v) => v !== null && v !== "" || "必填"]
  : [];
</script>

<template>
  <v-text-field
    v-model.number="model"
    :label="label"
    type="number"
    density="compact"
    variant="outlined"
    clearable
    :rules="rules"
  />
</template>
