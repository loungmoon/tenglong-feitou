<template>
  <component :is="layout">
    <router-view />
  </component>
  <v-snackbar
      v-model="notify.show"
      :color="notify.color"
      :timeout="notify.timeout"
      location="center"
    >
      {{ notify.text }}
    </v-snackbar>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { notifyState as notify } from '@/composables/useNotifiy'

const route = useRoute()

const layout = computed(() =>
  route.meta.layout === 'default' ? DefaultLayout : 'div'
)
</script>
