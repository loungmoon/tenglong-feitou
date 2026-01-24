<template>
  <v-dialog v-model="model" max-width="900" persistent>
    <v-card rounded="lg">
      <!-- Header -->
      <v-card-title class="bg-grey-lighten-4 py-2">
        <div class="d-flex justify-space-between align-center w-100">
          <div class="d-flex align-center ga-2">
            <v-icon>mdi-cog</v-icon>
            <span class="text-subtitle-2 font-weight-bold">
              设置个人参数
            </span>
          </div>
          <v-btn icon size="small" variant="text" @click="close">
            <v-icon size="18">mdi-close</v-icon>
          </v-btn>
        </div>
      </v-card-title>

      <!-- Body -->
      <v-card-text>
        <v-form ref="formRef" v-model="isValid">
        <v-row>
          <!-- LEFT -->
          <v-col cols="4">
            <v-btn
              block
              size="small"
              color="warning"
              variant="flat"
              class="mb-4"
              :loading="playerStore.loading"
              @click="refreshPlayers"
            >
              刷新选手
            </v-btn>

            <v-select
              v-model="form.player_name"
              :items="playerStore.nameList"
              label="选手名称"
              density="compact"
              hide-details
            />

            <v-sheet
              border
              rounded
              class="mt-3 pa-2"
              height="400"
              elevation="2"
            >
              <div
                v-for="name in playerStore.nameList"
                :key="name"
                class="px-2 py-1"
                :class="name === form.player_name ? 'text-error font-weight-bold' : ''"
              >
                {{ name }}
              </div>
            </v-sheet>
          </v-col>

          <!-- RIGHT -->
          <v-col cols="8">
            <FieldSetBox title="个人占成设置">
              <v-row dense>
                <v-col cols="6">
                  <NumberField
                      v-model="form.bp_personal_share"
                      label="闲庄个人占成比率"
                      required
                    />
                    <NumberField
                      v-model="form.sb_personal_share"
                      label="三宝个人占成比率"
                      required
                    />
                </v-col>
                <v-col cols="6">
                  <NumberField
                      v-model="form.bp_personal_share_upperlimit"
                      label="闲庄个人占成上限"
                      required
                    />
                    <NumberField
                      v-model="form.personal_points_redemption_ratio"
                      label="个人积分兑换比率"
                      required
                    />
                </v-col>
              </v-row>
            </FieldSetBox>

            <FieldSetBox title="个人限红（0 代表不限红）" class="mt-6">
              <v-row dense>
                <v-col cols="6">
                  <NumberField
                      v-model="form.bp_personal_upperlimit"
                      label="闲庄个人上限"
                      required
                    />
                    <NumberField
                      v-model="form.lucky6_personal_upperlimit"
                      label="幸运6个人上限"
                      required
                    />
                </v-col>
                <v-col cols="6">
                   <NumberField
                      v-model="form.sb_personal_upperlimit"
                      label="三宝个人上限"
                      required
                    />
                    <NumberField
                      v-model="form.perfect_pair_upperlimit"
                      label="完美对子个人上限"
                      required
                    />
                </v-col>
              </v-row>
            </FieldSetBox>

            <FieldSetBox title="其它设置" class="mt-6">
              <NumberField
                      v-model="form.zoom_ratio"
                      label="缩放比率"
                      required
                    />
            </FieldSetBox>

            <v-card-actions class="justify-center mt-6">
              <v-btn variant="flat" color="blue" :loading="loading" @click="save">
                保存设置
              </v-btn>
              <v-btn variant="outlined" @click="close">
                关闭
              </v-btn>
            </v-card-actions>
          </v-col>
        </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script setup>
import { ref, watch } from "vue"
import { usePlayerStore } from "@/stores/player.store"
import { setPersonalParameter } from "@/api/system.api"
import { useNotify } from "@/composables/useNotifiy";
import NumberField from "@/components/common/NumberField.vue";

const model = defineModel({ type: Boolean })
const playerStore = usePlayerStore()
const loading = ref(false)
const notify = useNotify();
const formRef = ref(null)
const isValid = ref(false)

/* form */
const form = ref({
  player_name: "",
  bp_personal_share: null,
  bp_personal_share_upperlimit: null,
  sb_personal_share: null,
  personal_points_redemption_ratio: null,
  bp_personal_upperlimit: null,
  sb_personal_upperlimit: null,
  lucky6_personal_upperlimit: null,
  perfect_pair_upperlimit: null,
  zoom_ratio: null,
})


/* open dialog → fetch players */
watch(model, async (open) => {
  if (!open) return

  // auto select first
  form.value.player_name = playerStore.nameList[0] || ""
})

const refreshPlayers = () => {
  playerStore.fetchPlayers(true)
}

/* save */
const save = async () => {
  const result = await formRef.value?.validate()
  if (!result?.valid) return

  if (!form.value.player_name) return

  loading.value = true
  try {
    await setPersonalParameter({ ...form.value })
    notify.success("修改选手成功")
    model.value = false
  } catch (err) {
    notify.error(err)
  } finally {
    loading.value = false
  }
}


const close = () => {
  model.value = false
}
</script>
