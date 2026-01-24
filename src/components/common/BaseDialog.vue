<template>
  <v-dialog
    v-model="model"
    :max-width="maxWidth"
    scrollable
    persistent
    :retain-focus="false"
  >
    <v-card rounded="lg">
      <v-card-title class="d-flex align-center justify-space-between">
        <div class="d-flex align-center">
          <v-icon
            v-if="icon"
            :color="iconColor"
            class="mr-2"
          >
            {{ icon }}
          </v-icon>

          <span class="text-subtitle-1 font-weight-bold">
            {{ title }}
          </span>
        </div>

        <v-btn
          icon
          size="small"
          variant="text"
          @click="close"
        >
          <v-icon size="18">mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider />

      <v-card-text class="text-body-2 text-medium-emphasis">
        <slot />
      </v-card-text>


       <v-divider />
      <v-card-actions class="justify-center">
        <slot name="actions">
          <v-btn variant="text" @click="close" elevation="2">
            取消
          </v-btn>

          <v-btn
            :loading="loading"
            :disabled="loading"
            :color="confirmColor"
            variant="flat"
            elevation="2"
            @click="$emit('confirm')"
          >
            {{ confirmBtn }}
          </v-btn>
        </slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
const model = defineModel()

defineProps({
  title: { type: String, required: true },
  icon: { type: String, default: null },
  iconColor: { type: String, default: 'primary' },
  confirmColor: { type: String, default: 'primary' },
  maxWidth: { type: [Number, String], default: 360 },
  loading: { type: Boolean, default: false },
  confirmBtn: { type:String, default: '确定' }
})

defineEmits(['confirm'])

const close = () => {
  model.value = false
}
</script>
