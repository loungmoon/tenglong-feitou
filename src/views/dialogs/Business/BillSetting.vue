<template>
  <v-dialog v-model="model" max-width="900" persistent>
    <v-card rounded="lg">
      <v-card-title class="bg-grey-lighten-4 py-2">
        <div class="d-flex justify-space-between align-center w-100">
          <div class="d-flex align-center ga-2">
            <v-icon>mdi-cog</v-icon>
            <span class="text-subtitle-2 font-weight-bold"> 设置个人参数 </span>
          </div>
          <v-btn icon size="small" variant="text" @click="close">
            <v-icon size="18">mdi-close</v-icon>
          </v-btn>
        </div>
      </v-card-title>

      <v-card-text>
        <v-form ref="formRef" v-model="isValid">
          <v-row>
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
              <v-alert
                type="error"
                variant="text"
                density="compact"
                class="mb-2 border"
              >
                <v-icon size="small">mdi-star-off-outline</v-icon>
                号为隐藏选手
              </v-alert>

              <v-sheet
                border
                rounded
                class="mt-1 pa-2 overflow-y-auto"
                height="250"
              >
                <v-list density="compact">
                  <v-list-item
                    v-for="p in playerStore.list"
                    :key="p.playername"
                    color="primary"
                    :active="playerStore.selected?.playername === p.playername"
                    @click="playerStore.select(p.playername)"
                  >
                    <template #prepend>
                      <v-icon
                        :icon="p.is_hide ? 'mdi-star-off-outline' : 'mdi-star'"
                      />
                    </template>

                    <v-list-item-title>
                      {{ p.playername }}
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-sheet>
              <v-text-field
                v-model="groupNickname"
                label="开工群昵称"
                density="compact"
                variant="outlined"
                class="mt-4"
                readonly
              >
              </v-text-field>
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
                <v-btn
                  variant="flat"
                  color="blue"
                  :loading="loading"
                  @click="save"
                >
                  保存设置
                </v-btn>
                <v-btn variant="outlined" @click="close"> 关闭 </v-btn>
              </v-card-actions>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script setup>
import { ref, watch, computed } from "vue";
import { usePlayerStore } from "@/stores/player.store";
import { useGroupPullStore } from "@/stores/group.store"
import { setPersonalParameter, getPersonalParameter } from "@/api/system.api";
import { useNotify } from "@/composables/useNotifiy";
import NumberField from "@/components/common/NumberField.vue";


const model = defineModel({ type: Boolean });

const playerStore = usePlayerStore();
const groupStore = useGroupPullStore()
const notify = useNotify();

const loading = ref(false);
const formRef = ref(null);
const isValid = ref(false);

const groupNickname = computed(()=> groupStore.setting.group_nickname)

const selectedPlayerName = computed(
  () => playerStore.selected?.playername || ""
);

/* form */
const form = ref({
  bp_personal_share: null,
  bp_personal_share_upperlimit: null,
  sb_personal_share: null,
  personal_points_redemption_ratio: null,
  bp_personal_upperlimit: null,
  sb_personal_upperlimit: null,
  lucky6_personal_upperlimit: null,
  perfect_pair_upperlimit: null,
  zoom_ratio: null,
});

const fetchPersonalParameter = async () =>{
  if(!selectedPlayerName.value || !groupNickname.value ) return

  loading.value = true;
  try {
    const res = await getPersonalParameter({
      group_nickname : groupNickname.value,
      player_name : selectedPlayerName.value
    });

    Object.assign(form.value, res.data || {});
  } catch (err) {
     notify.error(err || "获取个人参数失败");
  }finally{
     loading.value = false;
  }
}

watch(model, async (open) => {
  if (!open) return;

  await groupStore.ensureReady();

  await playerStore.fetchPlayers();

   if (!playerStore.selected && playerStore.list.length) {
    playerStore.setSelectedByName(playerStore.list[0].playername);
  }

  await fetchPersonalParameter();
});

watch(selectedPlayerName,
  async (name) => {
    if (name) {
      await fetchPersonalParameter();
    }
  }
);

const refreshPlayers = () => {
  playerStore.fetchPlayers(true);
};

/* save */
const save = async () => {
  const result = await formRef.value?.validate();
  if (!result?.valid) return;

  loading.value = true;
  try {
    await setPersonalParameter({
      ...form.value,
      group_nickname: groupNickname.value,
      player_name: selectedPlayerName.value,
    });
    notify.success("修改选手成功");
    model.value = false;
  } catch (err) {
    notify.error(err);
  } finally {
    loading.value = false;
  }
};

const close = () => {
  model.value = false;
};
</script>
