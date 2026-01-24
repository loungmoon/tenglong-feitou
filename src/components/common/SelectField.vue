<script setup>
const model = defineModel()

const props = defineProps({
  label: String,
  items: {
    type: Array,
    required: true,
  },
  required: Boolean,
})

const rules = props.required
  ? [
      v =>
        v !== null && v !== undefined && v !== "" || "必填",
    ]
  : []
</script>

<template>
  <v-select
    v-model="model"
    :label="label"
    :items="items"
    item-title="label"
    item-value="value"
    variant="outlined"
    density="compact"
    :rules="rules"
  />
</template>
