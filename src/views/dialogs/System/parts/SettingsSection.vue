<template>
  <div class="mt-4">
    <div class="section-title">
      {{ title }}
    </div>

    <slot />
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
});
</script>

<style scoped>
.section-title {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 8px;
}
</style>
