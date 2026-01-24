<template>
  <BaseDialog
    v-model="model"
    title="设置聊天群拉取数据"
    icon="mdi-cog"
    max-width="900"
    :loading="loading"
    confirmBtn="保存设置"
    :confirm-disabled="!isValid"
    @confirm="save"
  >
    <v-form ref="formRef" v-model="isValid">
      <div class="dialog-body">
        <v-row dense>
          <ImageUploader
            label="开始图片"
            v-model="form.img_start"
            :rules="[required]"
          />
          <ImageUploader
            label="截止图片"
            v-model="form.img_stop"
            :rules="[required]"
          />
        </v-row>
        <v-row dense>
          <v-col cols="12" md="2">
            <v-checkbox v-model="form.active" label="是否启用" />
          </v-col>

          <v-col cols="12" md="2">
            <v-text-field
              v-model="form.group_nickname"
              label="开工群昵称"
              :rules="[required]"
            />
          </v-col>

          <v-col cols="12" md="2">
            <v-text-field
              v-model="form.account"
              label="账号"
              :rules="[required]"
            />
          </v-col>

          <v-col cols="12" md="3">
            <v-text-field
              v-model="form.pull_table_nickname"
              label="拉表机器人昵称"
              :rules="[required]"
            />
          </v-col>

          <v-col cols="12" md="3">
            <v-text-field
              v-model="form.report_bet_groups_nickname"
              label="报注群昵称"
              :rules="[required]"
            />
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="12" md="3" v-for="item in autoToggles" :key="item.key">
            <v-checkbox v-model="form[item.key]" :label="item.label" />
          </v-col>
        </v-row>

        <SettingsSection title="以下图片发送 “开始图片” 后多少秒发出">
          <v-row dense>
            <v-col v-for="i in 3" :key="i" cols="12" md="4">
              <AutoImageBlock :index="i" type="start" v-model="form" />
            </v-col>
          </v-row>
        </SettingsSection>

        <SettingsSection title="以下文本发送 “投注表” 后多少秒发出">
          <v-row dense>
            <v-col v-for="i in 3" :key="i" cols="12" md="4">
              <AutoTextBlock :index="i" v-model="form" />
            </v-col>
          </v-row>
        </SettingsSection>

        <SettingsSection title="以下图片发送 “投发表” 后多少秒发出">
          <v-row dense>
            <v-col v-for="i in 3" :key="i" cols="12" md="4">
              <AutoImageBlock :index="i" type="betreport" v-model="form" />
            </v-col>
          </v-row>
        </SettingsSection>
      </div>
    </v-form>
  </BaseDialog>
</template>
<script setup>
import { ref, reactive, computed, watch } from "vue";
import BaseDialog from "@/components/common/BaseDialog.vue";
import SettingsSection from "./parts/SettingsSection.vue";
import ImageUploader from "./parts/ImageUploader.vue";
import AutoImageBlock from "./parts/AutoImageBlock.vue";
import AutoTextBlock from "./parts/AutoTextBlock.vue";
import { useGroupPullStore } from "@/stores/group.store";
import { useNotify } from "@/composables/useNotifiy";

const model = defineModel(Boolean);
const loading = ref(false);
const formRef = ref(null);
const isValid = ref(false);
const store = useGroupPullStore();
const notify = useNotify();

const required = (v) => !!v || "必填";

/* ---------- Form ---------- */
const form = reactive({
  img_start: "",
  img_stop: "",

  active: false,
  group_nickname: "",
  account: "",
  pull_table_nickname: "",
  report_bet_groups_nickname: "",

  auto_send_bet_report: false,
  auto_send_road: false,
  auto_send_settlement_table: false,
  auto_send_start_img: false,

  // 开始后图片
  auto_send_img1_after_start: false,
  auto_send_img2_after_start: false,
  auto_send_img3_after_start: false,
  second_send_img1_after_start: 0,
  second_send_img2_after_start: 0,
  second_send_img3_after_start: 0,
  img1_after_start: "",
  img2_after_start: "",
  img3_after_start: "",

  // 文本
  auto_send_text1: false,
  auto_send_text2: false,
  auto_send_text3: false,
  second_send_text1: 0,
  second_send_text2: 0,
  second_send_text3: 0,
  text1_after_betreport: "",
  text2_after_betreport: "",
  text3_after_betreport: "",

  // 投注后图片
  auto_send_img1_after_betreport: false,
  auto_send_img2_after_betreport: false,
  auto_send_img3_after_betreport: false,
  second_send_img1_after_betreport: 0,
  second_send_img2_after_betreport: 0,
  second_send_img3_after_betreport: 0,
  img1_after_betreport: "",
  img2_after_betreport: "",
  img3_after_betreport: "",
});

watch(model, async(open)=> {
  if (!open) return;

  await store.fetchSetting();
  Object.assign(form, store.setting);
  formRef.value?.resetValidation();

})

const save = async () => {
  const result = await formRef.value?.validate();
  if (!result?.valid) return;

  try {
    await store.saveSetting(form);
    notify.success("修改成功");
    model.value = false;
  } catch (err) {
    notify.error("保存失败");
  }
};

/* ---------- UI ---------- */
const autoToggles = [
  { key: "auto_send_bet_report", label: "自动发送投注报表" },
  { key: "auto_send_road", label: "自动发送路单" },
  { key: "auto_send_settlement_table", label: "自动发送结算报表" },
  { key: "auto_send_start_img", label: "自动发送开始图片" },
];
</script>
<style scoped>
.dialog-body {
  max-height: calc(100vh - 220px);
  overflow-y: auto;
}
</style>
