<template>
  <v-card elevation="0">
    <v-card-title class="text-subtitle-1 font-weight-bold pa-0 mb-3">
      {{ title }}
    </v-card-title>

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
