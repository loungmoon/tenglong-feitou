<template>
  <v-dialog v-model="model" max-width="1200" persistent>
    <v-card height="700">
      <v-card-title class="bg-grey-lighten-4">
        <div class="d-flex align-center w-100">
          <v-icon class="mr-2">mdi-cog</v-icon>
          <span class="text-subtitle-1 font-weight-medium">
            飞牌登记
          </span>

          <v-spacer />

          <v-btn
            icon
            variant="text"
            size="small"
            @click="model = false"
          >
            <v-icon size="18">mdi-close</v-icon>
          </v-btn>
        </div>
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-0 h-100">
        <v-row no-gutters class="h-100">

          <!-- LEFT PANEL -->
          <v-col cols="3" class="pa-3 border-r">
            <!-- Date -->
            <v-text-field
              v-model="date"
              type="date"
              label="日期"
              density="compact"
            />

            <!-- Boot -->
            <v-select
              v-model="boot"
              :items="boots"
              label="第几靴"
              density="compact"
            />

            <v-btn
              block
              class="my-2"
              color="yellow-lighten-4"
              @click="queryCurrent"
            >
              查询某天某靴
            </v-btn>

            <v-checkbox
              v-model="queryAll"
              label="查询登记靴局"
              density="compact"
            />

            <v-btn
              block
              class="mb-4"
              color="yellow-lighten-4"
              @click="queryAllBoots"
            >
              查询某天所有靴局
            </v-btn>

            <!-- Info -->
            <div class="text-purple font-weight-bold mb-1">
              靴局
            </div>
            <div class="text-blue">
              本局：未开奖
            </div>

            <!-- Amount -->
            <v-text-field
              v-model="amount"
              label="飞牌金额"
              density="compact"
            />

            <!-- Direction -->
            <v-select
              v-model="side"
              :items="sides"
              label="飞牌向庄"
              density="compact"
            />

            <!-- Note -->
            <v-textarea
              v-model="note"
              label="飞牌备注"
              rows="2"
              density="compact"
            />

            <v-btn
              block
              color="pink"
              class="mt-3"
              :loading="loading"
              @click="submit"
            >
              飞牌登记
            </v-btn>
          </v-col>

          <!-- RIGHT CONTENT -->
          <v-col cols="9" class="bg-grey-lighten-2">
            <!-- Reserved for table / result -->
          </v-col>

        </v-row>
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="model = false">
          关闭
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from 'vue'

const model = defineModel({ type: Boolean })

/* Form state */
const date = ref(new Date().toISOString().slice(0, 10))
const boot = ref(1)
const boots = [1, 2, 3, 4, 5]
const queryAll = ref(false)

const amount = ref('')
const side = ref('庄')
const sides = ['庄', '闲']
const note = ref('')

const loading = ref(false)

/* Actions */
const queryCurrent = () => {
  console.log('query current', date.value, boot.value)
}

const queryAllBoots = () => {
  console.log('query all boots', date.value)
}

const submit = async () => {
  loading.value = true
  try {
    await new Promise(r => setTimeout(r, 1500)) // API wait
    console.log({
      date: date.value,
      boot: boot.value,
      amount: amount.value,
      side: side.value,
      note: note.value,
    })
    model.value = false
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.border-r {
  border-right: 1px solid #ccc;
}
</style>
