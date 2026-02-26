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
            />
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
            <v-col v-for="i in 3" :key="i"  cols="12" md="4">
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
const formRef = ref(null);
const isValid = ref(false);

const form = ref({});

let originalNickname = "";

const requiredData = [
  v => !!v || '必填',
  v => (v && v.trim().length > 0) || '不能为空',
]

watch(model, async (open) => {
  if (!open) return;

  await store.ensureReady();

  form.value = { ...store.setting };
  originalNickname = store.setting.group_nickname;
});

const save = async () => {
  const result = await formRef.value?.validate();
  if (!result?.valid) return;

   const nicknameChanged =
    form.value.group_nickname !== originalNickname;

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
