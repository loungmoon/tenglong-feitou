<template>
  <v-card class="mb-2" elevation="5">
    <v-card-text>
      <v-row align="center">
        <v-col cols="4">
          <v-card variant="tonal" color="#d38054" class="text-center">
            <div class="text-caption">台面筹码</div>
            <div class="text-h6 font-weight-bold">-20,000</div>
          </v-card>
        </v-col>

        <v-col cols="8" class="text-right text-[#0d47a1]">
          <div>选手名称</div>
          <div>代理名称</div>
          <div>初始积分</div>
        </v-col>
      </v-row>

      <v-row justify="space-around" class="text-[#d38054] my-3">
        <span>显示: 5</span>
        <span>总赢: 0</span>
        <span>总输: 1</span>
      </v-row>

      <div class="text-center text-[#0d47a1] my-5">
        <div>非虚拟剩余分汇总: 59285</div>
        <div>非虚拟初始分汇总: 80400</div>
      </div>

      <v-row class="d-flex justify-between" dense>
        <v-col cols="12" md="3">
          <v-text-field
            v-model="form.shoe"
            label="靴"
            density="compact"
            hide-details
          />
        </v-col>

        <v-col cols="12" md="3">
          <v-text-field
            v-model="form.round"
            label="局"
            density="compact"
            hide-details
          />
        </v-col>

        <v-col cols="12" md="3">
          <v-text-field
            v-model="deskNumber"
            label="台号"
            density="compact"
            hide-details
          />
        </v-col>
      </v-row>

      <v-row dense class="mt-4">
        <v-col cols="4">
          <v-btn block size="small" color="grey" @click="dlgNextShoe = true"
            >进入下一靴</v-btn
          >
        </v-col>
        <v-col cols="4">
          <v-btn block size="small" color="grey" @click="dlgNextRound = true"
            >开始下注</v-btn
          >
        </v-col>
        <v-col cols="4">
          <v-btn block size="small" color="grey" @click="dlgEditShoe = true"
            >修改靴局</v-btn
          >
        </v-col>
        <v-col cols="6">
          <v-btn block size="small" color="grey" @click="dlgLock = true"
            >锁定靴局</v-btn
          >
        </v-col>
        <v-col cols="6">
          <v-btn block size="small" color="grey" @click="dlgLast = true"
            >最近一局</v-btn
          >
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>

  <!-- Main Result -->
  <v-card class="mb-2" elevation="5">
    <v-card-title class="d-flex align-center justify-space-between">
      <span>开奖区</span>
      <v-checkbox
        v-model="disabled"
        label="关闭"
        density="compact"
        hide-details
      />
    </v-card-title>

    <v-card-text>
      <v-btn-toggle
        v-model="mainResult"
        divided
        density="comfortable"
        class="w-100 mb-3"
      >
        <v-btn value="banker" color="error" class="flex-1"> 庄 </v-btn>

        <v-btn value="tie" color="green" class="flex-1"> 和 </v-btn>

        <v-btn value="player" color="blue" class="flex-1"> 闲 </v-btn>
      </v-btn-toggle>

      <v-row dense>
        <v-col cols="6">
          <v-checkbox
            v-model="bankerPair"
            label="庄对"
            density="compact"
            hide-details
            color="#fff"
            class="bg-error rounded pa-1"
          />
        </v-col>

        <v-col cols="6">
          <v-checkbox
            v-model="playerPair"
            label="闲对"
            density="compact"
            hide-details
            color="#ffffff"
            class="bg-blue rounded pa-1"
          />
        </v-col>
      </v-row>
      <v-btn
        block
        :loading="loading"
        :disabled="disabled"
        size="large"
        color="#d17b4d"
        @click="submitResult"
        class="mt-4"
      >
        确认开奖
      </v-btn>
    </v-card-text>
  </v-card>

  <NextShoe
    v-model="dlgNextShoe"
    :desk-number="deskNumber"
    @success="refreshDesk"
  />
  <NextRound
    v-model="dlgNextRound"
    :desk-number="deskNumber"
    @success="handleNextRound"
  />

  <EditShoe
    v-model="dlgEditShoe"
    :desk-number="deskNumber"
    :round="form.round"
    :shoe="form.shoe"
    @success="handleEditShoe"
  />

  <LockBootRound v-model="dlgLock" />
  <LastRound v-model="dlgLast" />
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useResultSettingStore } from "@/stores/resultsetting.store";
import { useNotify } from "@/composables/useNotifiy";
import { drawLotteryApi } from "@/api/opt.api";
import { useGroupPullStore } from "@/stores/group.store";
import {
  NextShoe,
  NextRound,
  EditShoe,
  LockBootRound,
  LastRound,
} from "@/views/dialogs";

const notify = useNotify();
const store = useResultSettingStore();

const dlgNextShoe = ref(false);
const dlgNextRound = ref(false);
const dlgEditShoe = ref(false);
const dlgLock = ref(false);
const dlgLast = ref(false);

const loading = ref(false);
const disabled = ref(false);

const groupStore = useGroupPullStore();
const groupNickName = computed(() => groupStore.setting.group_nickname);

const form = ref({
  shoe: null,
  round: null,
});

watch(
  () => store.info,
  (info) => {
    form.value.shoe = info.shoe ?? null;
    form.value.round = info.round ?? null;
  },
  { immediate: true },
);

const deskNumber = computed({
  get: () => store.setting.desk_number,
  set: (val) => {
    store.setting.desk_number = val;
  },
});

const mainResult = ref(null);
const bankerPair = ref(false);
const playerPair = ref(false);

const resultCode = computed(() => {
  let sum = 0;

  if (mainResult.value === "banker") sum += 1;
  if (mainResult.value === "player") sum += 2;
  if (mainResult.value === "tie") sum += 4;
  if (bankerPair.value) sum += 8;
  if (playerPair.value) sum += 16;

  return sum;
});

const refreshDesk = async () => {
  mainResult.value = null;
  bankerPair.value = false;
  playerPair.value = false;
  await store.getDeskInfo();
};

const handleNextRound = async (data) => {
  form.value.round = Number(data.round);
  form.value.shoe = Number(data.shos);
  await refreshDesk();
};

const handleEditShoe = async (data) => {
  form.value.shoe = data.shoe;
  form.value.round = data.round;
  await refreshDesk();
};

/* submit */
const submitResult = async () => {
  if (!form.value.shoe || !form.value.round) {
    notify.error("请输入靴号和局号");
    return;
  }

  const hasMain = !!mainResult.value;
  const hasPair = bankerPair.value || playerPair.value;

  if (!hasMain && !hasPair) {
    notify.error("请选择庄 / 闲 / 和（或对子）");
    return;
  }

  const payload = {
    desk_number: Number(deskNumber.value),
    shoe: Number(form.value.shoe),
    round: Number(form.value.round),
    result: resultCode.value,
    group_nickname: groupNickName.value
  };

  loading.value = true;
  try {
    await drawLotteryApi(payload);
    notify.success("开奖成功");

    await refreshDesk();
  } catch (err) {
    console.error(err);
    notify.error("接口无响应 / 请求超时");
  } finally {
    loading.value = false;
  }
};
</script>
