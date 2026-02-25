<template>
  <v-dialog
    v-model="model"
    :max-width="maxWidth"
    :persistent="computedPersistent"
    scrollable
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
          aria-label="取消"
          :disabled="loading"
          @click="handleClose"
        >
          <v-icon size="18">mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider />

      <v-card-text class="text-body-2 text-black">
        <slot />
      </v-card-text>


       <v-divider />
      <v-card-actions class="justify-center">
        <slot name="actions">
          <v-btn variant="text" :disabled="loading" elevation="2" @click="handleClose" >
            取消
          </v-btn>

          <v-btn
            :loading="loading"
            :disabled="loading || confirmDisabled"
            :color="confirmColor"
            variant="flat"
            elevation="2"
            @click="handleConfirm"
          >
            {{ confirmBtn }}
          </v-btn>
        </slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed } from 'vue'

const model = defineModel({ type: Boolean })

const props = defineProps({
  title: { type: String, required: true },
  icon: { type: String, default: null },
  iconColor: { type: String, default: 'primary' },
  confirmColor: { type: String, default: 'primary' },
  maxWidth: { type: [Number, String], default: 360 },
  loading: { type: Boolean, default: false },
  confirmBtn: { type:String, default: '确定' },
  confirmDisabled:{ type:Boolean, default:false },
  persistent: {type: Boolean, default: false }
})

const emit = defineEmits(['confirm','close'])

const computedPersistent = computed(() => {
  return props.persistent || props.loading
})

const handleClose = () => {
   if (props.loading) return

  emit('close')
  model.value = false
}

const handleConfirm = () => {
  if (props.loading || props.confirmDisabled) return

  emit('confirm')
}
</script>
