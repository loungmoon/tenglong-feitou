<template>
  <v-dialog v-model="model" max-width="1500" persistent>
    <v-card>
      <v-card-title class="bg-gray-100 px-3 py-2">
        <div class="flex justify-between items-center">
          <span class="text-sm font-semibold">
            <v-icon class="mr-1">mdi-cog</v-icon>
            参数的设置
          </span>

          <v-btn icon size="small" variant="text" @click="close">
            <v-icon size="18">mdi-close</v-icon>
          </v-btn>
        </div>
      </v-card-title>

      <v-card-text>
        <v-form ref="formRef" v-model="isValid">
          <v-row dense>
            <!-- LEFT -->
            <v-col cols="12" md="4">
              <FieldSetBox title="赔率设置">
                <v-row dense>
                  <v-col cols="6">
                    <NumberField
                      v-model="form.banker_odds"
                      label="庄赔率"
                      required
                    />
                    <NumberField
                      v-model="form.tie_odds"
                      label="和赔率"
                      required
                    />
                    <NumberField
                      v-model="form.lucky_6_2_odds"
                      label="幸运6-2赔率"
                      required
                    />
                    <NumberField
                      v-model="form.perfect_pair"
                      label="完美对子"
                      required
                    />
                  </v-col>

                  <v-col cols="6">
                    <NumberField
                      v-model="form.player_odds"
                      label="闲赔率"
                      required
                    />
                    <NumberField
                      v-model="form.pair_odds"
                      label="对子赔率"
                      required
                    />
                    <NumberField
                      v-model="form.lucky_6_3_odds"
                      label="幸运6-3赔率"
                      required
                    />
                    <NumberField
                      v-model="form.any_pair"
                      label="任意对子"
                      required
                    />
                  </v-col>
                </v-row>
              </FieldSetBox>

              <FieldSetBox title="抽水模式" class="mt-4">
                <v-row dense>
                  <v-col cols="6">
                    <SelectField
                      v-model="form.enable_pumping_mode"
                      label="是否启用抽水模式"
                      :items="YES_NO"
                      required
                    />
                    <SelectField
                      v-model="form.banker_6points_win_commission_ratio"
                      label="庄六点闲抽水比率"
                      :items="YES_NO"
                      required
                    />
                  </v-col>

                  <v-col cols="6">
                    <SelectField
                      v-model="form.desk_enable_pumping_mode"
                      label="赔台是否启用抽水模式"
                      :items="YES_NO"
                      required
                    />
                    <NumberField
                      v-model="form.banker_win_odds"
                      label="庄闲赌台赔率"
                      required
                    />
                  </v-col>
                </v-row>
              </FieldSetBox>

              <FieldSetBox title="过滤玩家设置" class="mt-4">
                <v-row dense align="center">
                  <v-col cols="7" class="d-flex justify-center">
                    <v-sheet
                      height="160"
                      width="160"
                      border
                      class="d-flex align-center justify-center text-medium-emphasis"
                    >
                      云海
                    </v-sheet>
                  </v-col>

                  <v-col cols="5">
                    <NumberField
                      v-model="form.filter_players_setup"
                      type="text"
                      required
                    />

                    <v-btn-toggle
                      density="compact"
                      class="w-100 justify-between"
                    >
                      <v-btn
                        icon
                        class="border rounded w-40"
                        @click="addFilter"
                      >
                        <v-icon>mdi-plus</v-icon>
                      </v-btn>
                      <v-btn
                        icon
                        class="border rounded w-40"
                        @click="removeFilter"
                      >
                        <v-icon>mdi-minus</v-icon>
                      </v-btn>
                    </v-btn-toggle>
                  </v-col>
                </v-row>
              </FieldSetBox>
            </v-col>

            <v-col cols="12" md="4">
              <FieldSetBox title="下注金额设置">
                <v-row dense>
                  <v-col cols="6">
                    <NumberField
                      v-model="form.pb_min_limit"
                      label="选手个人闲庄最小限制"
                      required
                    />
                    <NumberField
                      v-model="form.sanbao_min_limit"
                      label="选手个人三宝最小限制"
                      required
                    />
                    <NumberField
                      v-model="form.lucky6_min_limit"
                      label="选手个人幸运6最小限制"
                      required
                    />
                    <NumberField
                      v-model="form.perfect_min_limit"
                      label="选手个人完美最小限制"
                      required
                    />
                    <NumberField
                      v-model="form.any_min_limit"
                      label="选手个人任意最小限制"
                      required
                    />
                  </v-col>
                  <v-col cols="6">
                    <NumberField
                      v-model="form.pb_max_limit"
                      label="选手个人闲庄最大限制"
                      required
                    />
                    <NumberField
                      v-model="form.sanbao_max_limit"
                      label="选手个人三宝最大限制"
                      required
                    />
                    <NumberField
                      v-model="form.lucky6_max_limit"
                      label="选手个人幸运6最大限制"
                      required
                    />
                    <NumberField
                      v-model="form.perfect_max_limit"
                      label="选手个人完美最大限制"
                      required
                    />
                    <NumberField
                      v-model="form.any_max_limit"
                      label="选手个人任意最大限制"
                      required
                    />
                  </v-col>
                </v-row>
              </FieldSetBox>
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
            <v-col cols="12" md="4">
              <FieldSetBox title="其它设置">
                <v-row dense>
                  <v-col cols="6">
                    <NumberField
                      v-model="form.points_exchange_ratio"
                      label="积分兑换比例"
                      required
                    />
                    <SelectField
                      v-model="form.show_points"
                      label="是否显示积分"
                      :items="YES_NO"
                      required
                    />
                    <NumberField
                      v-model="form.pb_max_bet_amount"
                      label="庄闲上盘最大金额"
                      required
                    />
                    <SelectField
                      v-model="form.transfer_small_change"
                      label="是否强制持零找"
                      :items="FORCE_ZERO_MODES"
                      required
                    />
                    <SelectField
                      v-model="form.enable_Lucky_6"
                      label="是否启用幸运6"
                      :items="YES_NO"
                      required
                    />
                    <SelectField
                      v-model="form.enable_perfect_pairs"
                      label="是否启用完美对子"
                      :items="YES_NO"
                      required
                    />
                    <SelectField
                      v-model="form.enable_any_pairs"
                      label="是否启用任意对子"
                      :items="YES_NO"
                      required
                    />
                    <SelectField
                      v-model="form.pb_bet_calculation_Mode"
                      label="庄闲上盘计算模式"
                      :items="CALC_MODES"
                      required
                    />
                  </v-col>

                  <v-col cols="6">
                    <SelectField
                      v-model="form.Integral_statistics_method"
                      label="积分统计方法"
                      :items="POINT_METHODS"
                      required
                    />
                    <NumberField
                      v-model="form.default_exchange"
                      label="默认兑换"
                      required
                    />
                    <NumberField
                      v-model="form.pb_min_bet_amount"
                      label="庄闲上盘最少金额"
                      required
                    />
                    <NumberField
                      v-model="form.minimum_amount_sold"
                      label="最少减持金额"
                      required
                    />
                    <SelectField
                      v-model="form.change_settings"
                      label="零钱设置"
                      :items="ZERO_SETTINGS"
                      required
                    />
                    <SelectField
                      v-model="form.enable_road"
                      label="是否启用路单"
                      :items="YES_NO"
                      required
                    />
                    <SelectField
                      v-model="form.screenshot_mode_bet_form"
                      label="投注表截图模式"
                      :items="SCREENSHOT_MODES"
                      required
                    />
                    <SelectField
                      v-model="form.should_statistics_truncated"
                      label="是否截取统计"
                      :items="YES_NO"
                      required
                    />
                  </v-col>
                </v-row>
              </FieldSetBox>

              <div class="flex justify-center">
                <v-btn
                  class="mt-5"
                  color="primary"
                  :loading="loading"
                  :disabled="loading"
                  @click="confirm"
                >
                  保存设置
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed,watch } from "vue";
import {
  YES_NO,
  POINT_METHODS,
  FORCE_ZERO_MODES,
  ZERO_SETTINGS,
  SCREENSHOT_MODES,
  CALC_MODES,
} from "@/composables/options";
import { useGroupPullStore } from "@/stores/group.store"
import { getParameter,setParameter } from "@/api/system.api";
import { useNotify } from "@/composables/useNotifiy";
import NumberField from "@/components/common/NumberField.vue";
import SelectField from "@/components/common/SelectField.vue";

const model = defineModel({ type: Boolean });
const notify = useNotify();
const groupStore = useGroupPullStore()

const loading = ref(false);
const formRef = ref(null);
const isValid = ref(false);

const groupNickname = computed(()=> groupStore.setting.group_nickname)

const form = ref({
  banker_odds: null,
  tie_odds: null,
  lucky_6_2_odds: null,
  perfect_pair: null,
  player_odds: null,
  pair_odds: null,
  lucky_6_3_odds: null,
  any_pair: null,

  enable_pumping_mode: 0,
  banker_6points_win_commission_ratio: 0,
  desk_enable_pumping_mode: 1,
  banker_win_odds: null,

  filter_players_setup: "",

  pb_min_limit: null,
  sanbao_min_limit: null,
  lucky6_min_limit: null,
  perfect_min_limit: null,
  any_min_limit: null,
  pb_max_limit: null,
  sanbao_max_limit: null,
  lucky6_max_limit: null,
  perfect_max_limit: null,
  any_max_limit: null,

  points_exchange_ratio: null,
  Integral_statistics_method: "按有效流水",
  show_points: 0,
  default_exchange: null,
  pb_max_bet_amount: null,
  pb_min_bet_amount: null,
  enable_Lucky_6: 1,
  minimum_amount_sold: null,
  enable_perfect_pairs: 1,
  enable_road: 0,
  enable_any_pairs: 0,
  screenshot_mode_bet_form: "下注用户",
  pb_bet_calculation_Mode: "只舍不入",
  should_statistics_truncated: 0,
  change_settings: "百",
  transfer_small_change: 0,
});

const fetchParameter = async () =>{
  if(!groupNickname.value ) return

  loading.value = true;
  try {
    const res = await getParameter({
      group_nickname : groupNickname.value,
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

  // await groupStore.ensureReady();

  await fetchParameter();
});

const confirm = async () => {
  const result = await formRef.value?.validate();
  if (!result?.valid) return;
  loading.value = true;
  try {
    await setParameter({
      ...form.value,
    });
    notify.success("修改选手成功");
    model.value = false;
  } catch (e) {
    notify.error(e);
  } finally {
    loading.value = false;
  }
};

const close = () => (model.value = false);
const addFilter = () => {
  form.value.filter_players_setup += ",";
};

const removeFilter = () => {
  form.value.filter_players_setup = form.value.filter_players_setup.slice(
    0,
    -1,
  );
};
</script>
