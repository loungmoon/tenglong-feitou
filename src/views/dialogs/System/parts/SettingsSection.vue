<template>
  <v-card class="pa-4 mb-4" elevation="4">
    <v-card-title class="text-subtitle-1 font-weight-bold pa-0 mb-3">
      {{ title }}
    </v-card-title>

    <v-divider class="mb-3" />

    <slot />
  </v-card>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
});
</script>
