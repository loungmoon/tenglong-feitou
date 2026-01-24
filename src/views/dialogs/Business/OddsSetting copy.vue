<template>
  <v-dialog v-model="model" max-width="1500" persistent>
    <v-card>
      <!-- Header -->
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

      <!-- Body -->
      <v-card-text>
        <v-row dense>
          <!-- LEFT -->
          <v-col cols="12" md="4">
            <!-- Odds -->
            <FieldSetBox title="赔率设置">
              <v-row dense>
                <v-col cols="6">
                  <v-select
                    v-model="form.banker_odds"
                    label="庄赔率"
                    :items="items"
                    density="compact"
                    variant="outlined"
                  />
                  <v-select
                    v-model="form.tie_odds"
                    label="和赔率"
                    :items="items"
                    density="compact"
                    variant="outlined"
                  />
                  <v-select
                    v-model="form.lucky_6_2_odds"
                    label="幸运6-2赔率"
                    :items="items"
                    density="compact"
                    variant="outlined"
                  />
                  <v-select
                    v-model="form.perfect_pair"
                    label="完美对子"
                    :items="items"
                    density="compact"
                    variant="outlined"
                  />
                </v-col>

                <v-col cols="6">
                  <v-select
                    v-model="form.player_odds"
                    label="闲赔率"
                    :items="items"
                    density="compact"
                    variant="outlined"
                  />
                  <v-select
                    v-model="form.pair_odds"
                    label="对子赔率"
                    :items="items"
                    density="compact"
                    variant="outlined"
                  />
                  <v-select
                    v-model="form.lucky_6_3_odds"
                    label="幸运6-3赔率"
                    :items="items"
                    density="compact"
                    variant="outlined"
                  />
                  <v-select
                    v-model="form.any_pair"
                    label="任意对子"
                    :items="items"
                    density="compact"
                    variant="outlined"
                  />
                </v-col>
              </v-row>
            </FieldSetBox>

            <!-- Rake -->
            <FieldSetBox title="抽水模式" class="mt-4">
              <v-row dense>
                <v-col cols="6">
                  <v-select
                    v-model="form.enable_pumping_mode"
                    label="是否启用抽水模式"
                    :items="YES_NO"
                    item-title="label"
                    item-value="value"
                    density="compact"
                    variant="outlined"
                  />
                  <v-select
                    v-model="form.banker_6points_win_commission_ratio"
                    label="庄六点闲抽水比率"
                    :items="YES_NO"
                    item-title="label"
                    item-value="value"
                    density="compact"
                    variant="outlined"
                  />
                </v-col>

                <v-col cols="6">
                  <v-select
                    v-model="form.desk_enable_pumping_mode"
                    label="赔台是否启用抽水模式"
                    :items="YES_NO"
                    item-title="label"
                    item-value="value"
                    density="compact"
                    variant="outlined"
                  />
                  <v-select
                    v-model="form.banker_win_odds"
                    label="庄闲赌台赔率"
                    :items="items"
                    density="compact"
                    variant="outlined"
                  />
                </v-col>
              </v-row>
            </FieldSetBox>

            <!-- Filter Player -->
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
                  <v-text-field
                    v-model="form.filter_players_setup"
                    type="text"
                    variant="outlined"
                    density="compact"
                    hide-details
                    class="mb-2"
                  />

                  <v-btn-toggle density="compact" class="w-100 justify-between">
                    <v-btn icon class="border rounded w-40" @click="addFilter">
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

          <!-- CENTER -->
          <v-col cols="12" md="4">
            <FieldSetBox title="下注金额设置">
              <v-row dense>
                <v-col cols="6">
                  <v-select
                    v-model="form.pb_min_limit"
                    label="选手个人闲庄最小限制"
                    :items="items"
                    density="compact"
                    variant="outlined"
                  />
                  <v-select
                    v-model="form.sanbao_min_limit"
                    label="选手个人三宝最小限制"
                    :items="items"
                    density="compact"
                    variant="outlined"
                  />
                  <v-select
                    v-model="form.lucky6_min_limit"
                    label="选手个人幸运6最小限制"
                    :items="items"
                    density="compact"
                    variant="outlined"
                  />
                  <v-select
                    v-model="form.perfect_min_limit"
                    label="选手个人完美最小限制"
                    :items="items"
                    density="compact"
                    variant="outlined"
                  />
                  <v-select
                    v-model="form.any_min_limit"
                    label="选手个人任意最小限制"
                    :items="items"
                    density="compact"
                    variant="outlined"
                  />
                </v-col>
                <v-col cols="6">
                  <v-select
                    v-model="form.pb_max_limit"
                    label="选手个人闲庄最大限制"
                    :items="items"
                    density="compact"
                    variant="outlined"
                  />
                  <v-select
                    v-model="form.sanbao_max_limit"
                    label="选手个人三宝最大限制"
                    :items="items"
                    density="compact"
                    variant="outlined"
                  />
                  <v-select
                    v-model="form.lucky6_max_limit"
                    label="选手个人幸运6最大限制"
                    :items="items"
                    density="compact"
                    variant="outlined"
                  />
                  <v-select
                    v-model="form.perfect_max_limit"
                    label="选手个人完美最大限制"
                    :items="items"
                    density="compact"
                    variant="outlined"
                  />
                  <v-select
                    v-model="form.any_max_limit"
                    label="选手个人任意最大限制"
                    :items="items"
                    density="compact"
                    variant="outlined"
                  />
                </v-col>
              </v-row>
            </FieldSetBox>

            <!-- <FieldSetBox title="台面占成设置" class="mt-4">
              <v-row dense>
                <v-col cols="6">
                  <v-select
                    v-model="form.table.rate"
                    label="闲庄台面占成比率"
                    :items="items"
                    density="compact"
                    variant="outlined"
                  />
                  <v-select
                    v-model="form.table.pairRate"
                    label="三宝+6+对子台面占成比率"
                    :items="items"
                    density="compact"
                    variant="outlined"
                  />
                </v-col>
                <v-col cols="6">
                  <v-select
                    v-model="form.table.max"
                    label="闲庄台面占成上限"
                    :items="items"
                    density="compact"
                    variant="outlined"
                  />
                </v-col>
              </v-row>
            </FieldSetBox> -->
          </v-col>

          <!-- RIGHT -->
          <v-col cols="12" md="4">
            <FieldSetBox title="其它设置">
              <v-row dense>
                <v-col cols="6">
                  <v-select
                    v-model="form.points_exchange_ratio"
                    label="积分兑换比例"
                    :items="items"
                    density="compact"
                    variant="outlined"
                  />
                  <v-select
                    v-model="form.show_points"
                    label="是否显示积分"
                    :items="YES_NO"
                    item-title="label"
                    item-value="value"
                    density="compact"
                    variant="outlined"
                  />
                  <v-select
                    v-model="form.pb_max_bet_amount"
                    label="庄闲上盘最大金额"
                    :items="items"
                    density="compact"
                    variant="outlined"
                  />
                  <v-select
                    v-model="form.transfer_small_change"
                    label="是否强制持零找"
                    :items="FORCE_ZERO_MODES"
                    item-title="label"
                    item-value="value"
                    density="compact"
                    variant="outlined"
                  />
                  <v-select
                    v-model="form.enable_Lucky_6"
                    label="是否启用幸运6"
                    :items="YES_NO"
                    item-title="label"
                    item-value="value"
                    density="compact"
                    variant="outlined"
                  />
                  <v-select
                    v-model="form.enable_perfect_pairs"
                    label="是否启用完美对子"
                    :items="YES_NO"
                    item-title="label"
                    item-value="value"
                    density="compact"
                    variant="outlined"
                  />
                  <v-select
                    v-model="form.enable_any_pairs"
                    label="是否启用任意对子"
                    :items="YES_NO"
                    item-title="label"
                    item-value="value"
                    density="compact"
                    variant="outlined"
                  />
                  <v-select
                    v-model="form.pb_bet_calculation_Mode"
                    label="庄闲上盘计算模式"
                    :items="CALC_MODES"
                    item-title="label"
                    item-value="value"
                    density="compact"
                    variant="outlined"
                  />
                </v-col>

                <v-col cols="6">
                  <v-select
                    v-model="form.Integral_statistics_method"
                    label="积分统计方法"
                    :items="POINT_METHODS"
                    item-title="label"
                    item-value="value"
                    density="compact"
                    variant="outlined"
                  />
                  <v-select
                    v-model="form.default_exchange"
                    label="默认兑换"
                    :items="items"
                    density="compact"
                    variant="outlined"
                  />
                  <v-select
                    v-model="form.pb_min_bet_amount"
                    label="庄闲上盘最少金额"
                    :items="items"
                    density="compact"
                    variant="outlined"
                  />
                  <v-select
                    v-model="form.minimum_amount_sold"
                    label="最少减持金额"
                    :items="items"
                    density="compact"
                    variant="outlined"
                  />
                  <v-select
                    v-model="form.change_settings"
                    label="零钱设置"
                    :items="ZERO_SETTINGS"
                    item-title="label"
                    item-value="value"
                    density="compact"
                    variant="outlined"
                  />
                  <v-select
                    v-model="form.enable_road"
                    label="是否启用路单"
                    :items="YES_NO"
                    item-title="label"
                    item-value="value"
                    density="compact"
                    variant="outlined"
                  />
                  <v-select
                    v-model="form.screenshot_mode_bet_form"
                    label="投注表截图模式"
                    :items="SCREENSHOT_MODES"
                    item-title="label"
                    item-value="value"
                    density="compact"
                    variant="outlined"
                  />
                  <v-select
                    v-model="form.should_statistics_truncated"
                    label="是否截取统计"
                    :items="YES_NO"
                    item-title="label"
                    item-value="value"
                    density="compact"
                    variant="outlined"
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
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from "vue";
import {
  YES_NO,
  POINT_METHODS,
  FORCE_ZERO_MODES,
  ZERO_SETTINGS,
  SCREENSHOT_MODES,
  CALC_MODES,
} from "@/composables/options"
const model = defineModel({ type: Boolean });
const loading = ref(false);

const items = [1,2,3,4,5];

const form = ref({

    banker_odds:95,
    tie_odds:800,
    lucky_6_2_odds:1200,
    perfect_pair:2500,
    player_odds:100,
    pair_odds:1100,
    lucky_6_3_odds:2000,
    any_pair:500,

    enable_pumping_mode:0,
    banker_6points_win_commission_ratio:0,
    desk_enable_pumping_mode:1,
    banker_win_odds:0,

    filter_players_setup:"",

    pb_min_limit:50,
    sanbao_min_limit:30,
    lucky6_min_limit:30,
    perfect_min_limit:30,
    any_min_limit:30,
    pb_max_limit:200000,
    sanbao_max_limit:10000,
    lucky6_max_limit:8000,
    perfect_max_limit:5000,
    any_max_limit:10000000,

  // table: {
  //   rate:0,
  //   pairRate:100,
  //   max:0
  // },
  
    points_exchange_ratio:1000,
    Integral_statistics_method:"VALID_TURNOVER",
    show_points:0,
    default_exchange:3,
    pb_max_bet_amount:200000,
    pb_min_bet_amount:3500,
    enable_Lucky_6:1,
    minimum_amount_sold:100,
    enable_perfect_pairs:1,
    enable_road:0,
    enable_any_pairs:0,
    screenshot_mode_bet_form:"BET_USER",
    pb_bet_calculation_Mode:"FLOOR",
    should_statistics_truncated:0,
    change_settings:0,
    transfer_small_change:"NONE",
});

const confirm = async () => {
  loading.value = true;
  try {
    console.log("Submit payload:", form.value);
    model.value = false;
  } finally {
    loading.value = false;
  }
};

const close = () => (model.value = false);
const addFilter = () => {
  form.value.filter.keyword +=1;
};
const removeFilter = () => {
  if (form.value.filter.keyword > 1) {
    form.value.filter.keyword -= 1;
  }
};
</script>
