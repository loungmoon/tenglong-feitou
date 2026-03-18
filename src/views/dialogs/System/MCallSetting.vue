<template>
  <BaseDialog
    v-model="model"
    title="设置聊天群拉取数据"
    icon="mdi-cog"
    max-width="850"
    :loading="loading"
    confirm-btn="保存设置"
    @confirm="save"
  >
    <div v-if="nicknameLoading" class="nickname-loader-overlay">
      <v-progress-circular indeterminate color="primary" size="64" />
    </div>

    <v-form ref="formRef" v-model="isValid">
      <div class="dialog-body">
        <v-row dense>
          <ImageUploader v-model="form.img_start" label="开始图片" />
          <ImageUploader v-model="form.img_stop" label="截止图片" />
        </v-row>

        <!-- Base Info -->
        <v-row dense>
          <v-col cols="12" md="2">
            <v-checkbox v-model="form.active" label="是否启用" />
          </v-col>

          <v-col cols="12" md="2" class="mt-2 text-black">
            <v-text-field
              v-model="form.group_nickname"
              variant="outlined"
              density="compact"
              label="开工群昵称"
              :rules="requiredData"
              :loading="nicknameLoading"
              @blur="handleNicknameFetch"
              @keyup.enter="handleNicknameFetch"
            >
              <!-- <template #append>
                <v-btn
                  icon="mdi-magnify"
                  size="small"
                  variant="text"
                  @click="handleNicknameFetch"
                />
              </template> -->
            </v-text-field>
          </v-col>

          <v-col cols="12" md="2" class="mt-2 text-black">
            <v-text-field
              v-model="form.account"
              variant="outlined"
              density="compact"
              label="账号"
            />
          </v-col>

          <v-col cols="12" md="3" class="mt-2 text-black">
            <v-text-field
              v-model="form.pull_table_nickname"
              variant="outlined"
              density="compact"
              label="拉表机器人昵称"
              clearable
            />
          </v-col>

          <v-col cols="12" md="3" class="mt-2 text-black">
            <v-text-field
              v-model="form.report_bet_groups_nickname"
              variant="outlined"
              density="compact"
              label="报注群昵称"
              clearable
            />
          </v-col>
        </v-row>

        <!-- Toggles -->
        <v-row dense style="margin-top: -34px">
          <v-col v-for="item in autoToggles" :key="item.key" cols="12" md="3">
            <v-checkbox v-model="form[item.key]" :label="item.label" />
          </v-col>
        </v-row>

        <!-- Auto Images After Start -->
        <SettingsSection title="以下图片发送“开始图片”后多少秒发出">
          <v-row dense>
            <v-col v-for="i in 3" :key="i" cols="12" md="4">
              <AutoImageBlock
                :index="i"
                v-model:auto="form[`auto_send_img${i}_after_start`]"
                v-model:seconds="form[`second_send_img${i}_after_start`]"
                v-model:image="form[`img${i}_after_start`]"
              />
            </v-col>
          </v-row>
        </SettingsSection>

        <!-- Auto Text -->
        <SettingsSection title="以下文本发送“投注表”后多少秒发出">
          <v-row dense>
            <v-col v-for="i in 3" :key="i" cols="12" md="4">
              <AutoTextBlock
                :index="i"
                v-model:auto="form[`auto_send_text${i}`]"
                v-model:seconds="form[`second_send_text${i}`]"
                v-model:text="form[`text${i}_after_betreport`]"
              />
            </v-col>
          </v-row>
        </SettingsSection>

        <!-- Auto Images After Bet Report -->
        <SettingsSection title="以下图片发送“投发表”后多少秒发出">
          <v-row dense>
            <v-col v-for="i in 3" :key="i" cols="12" md="4">
              <AutoImageBlock
                :index="i"
                v-model:auto="form[`auto_send_img${i}_after_betreport`]"
                v-model:seconds="form[`second_send_img${i}_after_betreport`]"
                v-model:image="form[`img${i}_after_betreport`]"
              />
            </v-col>
          </v-row>
        </SettingsSection>
      </div>
    </v-form>
  </BaseDialog>
</template>

<script setup>
import { ref, watch } from "vue";
import { useGroupPullStore } from "@/stores/group.store";
import { useNotify } from "@/composables/useNotifiy";

import BaseDialog from "@/components/common/BaseDialog.vue";
import SettingsSection from "./parts/SettingsSection.vue";
import ImageUploader from "./parts/ImageUploader.vue";
import AutoImageBlock from "./parts/AutoImageBlock.vue";
import AutoTextBlock from "./parts/AutoTextBlock.vue";

const model = defineModel(Boolean);
const store = useGroupPullStore();
const notify = useNotify();

const loading = ref(false);
const nicknameLoading = ref(false);

const formRef = ref(null);
const isValid = ref(false);

const form = ref({});

let originalNickname = "";

function getDefaultForm(nickname = "") {
  return {
    group_nickname: nickname,
    active: false,
    account: "",
    pull_table_nickname: "",
    report_bet_groups_nickname: "",

    img_start: "",
    img_stop: "",

    auto_send_bet_report: false,
    auto_send_road: false,
    auto_send_settlement_table: false,
    auto_send_start_img: false,

    img1_after_start: "",
    img2_after_start: "",
    img3_after_start: "",
    auto_send_img1_after_start: false,
    auto_send_img2_after_start: false,
    auto_send_img3_after_start: false,
    second_send_img1_after_start: 0,
    second_send_img2_after_start: 0,
    second_send_img3_after_start: 0,

    text1_after_betreport: "",
    text2_after_betreport: "",
    text3_after_betreport: "",
    auto_send_text1: false,
    auto_send_text2: false,
    auto_send_text3: false,
    second_send_text1: 0,
    second_send_text2: 0,
    second_send_text3: 0,

    img1_after_betreport: "",
    img2_after_betreport: "",
    img3_after_betreport: "",
    auto_send_img1_after_betreport: false,
    auto_send_img2_after_betreport: false,
    auto_send_img3_after_betreport: false,
    second_send_img1_after_betreport: 0,
    second_send_img2_after_betreport: 0,
    second_send_img3_after_betreport: 0,
  };
}

// function debounce(fn, delay = 500) {
//   let timer;
//   return (...args) => {
//     clearTimeout(timer);
//     timer = setTimeout(() => fn(...args), delay);
//   };
// }

const requiredData = [
  (v) => !!v || "必填",
  (v) => (v && v.trim().length > 0) || "不能为空",
];

watch(model, async (open) => {
  if (!open) return;

  await store.ensureReady();

  form.value = { ...store.setting };
  originalNickname = store.setting.group_nickname;
});

const handleNicknameFetch = async () => {
  const val = form.value.group_nickname;

  if (!val || !val.trim()) return;
  if (val === originalNickname) return;

  try {
    nicknameLoading.value = true;

    store.setting.group_nickname = val;

    const data = await store.fetchSetting({ force: true });

    if (data) {
      form.value = {
        ...getDefaultForm(val),
        ...store.setting,
      };
    } else {
      form.value = getDefaultForm(val);
    }

    originalNickname = val;
  } finally {
    nicknameLoading.value = false;
  }
};

// watch(
//   () => form.value.group_nickname,
//   debounce(async (val) => {
//     if (!val || !val.trim()) return;
//     if (val === originalNickname) return;

//     try {
//       nicknameLoading.value = true;

//       store.setting.group_nickname = val;

//       const data = await store.fetchSetting({ force: true });

//       if (data) {
//         // ✅ has data
//         form.value = { ...store.setting };
//       } else {
//         // ✅ no data → CLEAR FORM
//         form.value = getDefaultForm(val);
//       }

//       originalNickname = val;
//     } finally {
//       nicknameLoading.value = false;
//     }
//   }, 500),
// );

const save = async () => {
  const result = await formRef.value?.validate();
  if (!result?.valid) return;

  const nicknameChanged = form.value.group_nickname !== originalNickname;

  try {
    loading.value = true;
    await store.saveSetting(form.value);

    if (nicknameChanged) {
      await store.reload(); // this calls get API again ONCE
    }
    notify.success("保存成功");
    model.value = false;
  } catch (err) {
    notify.error("保存失败");
  } finally {
    loading.value = false;
  }
};

const autoToggles = [
  { key: "auto_send_bet_report", label: "自动发送投注报表" },
  { key: "auto_send_road", label: "自动发送路单" },
  { key: "auto_send_settlement_table", label: "自动发送结算报表" },
  { key: "auto_send_start_img", label: "自动发送开始图片" },
];
</script>

<style scoped>
.nickname-loader-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.6); /* semi-transparent overlay */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}
</style>
