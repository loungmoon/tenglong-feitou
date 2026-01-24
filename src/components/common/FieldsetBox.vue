<template>
  <div class="fieldset">
    <span class="legend">{{ title }}</span>
    <slot />
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
})
</script>

<style scoped>
.fieldset {
  position: relative;
  border: 1px solid #cfd8dc;
  border-radius: 6px;
  padding: 16px 12px 12px;
}

.legend {
  position: absolute;
  top: -10px;
  left: 12px;
  background: white;
  padding: 0 8px;
  font-size: 13px;
  color: #555;
}
</style>
