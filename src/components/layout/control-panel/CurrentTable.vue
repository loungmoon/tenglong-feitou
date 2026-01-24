<template>
  <v-card class="mb-2" elevation="5">
    <v-card-title class="text-subtitle-2 mb-4"> 打前台台面（双击可复制文字） </v-card-title>

    <v-card-text>
      <v-row justify="space-between" class="text-purple mb-5">
        <span>3靴3局</span>
        <v-btn size="small" variant="outlined"> 台面截图 </v-btn>
      </v-row>

      <v-row justify="space-between" class="mt-4 text-blue">
        <span>本局飞</span>
        <v-btn size="small" color="success"> 红卡停正 </v-btn>
      </v-row>

      <v-row align="center" class="mt-3">
        <v-col cols="4">
          <v-btn block size="small" color="pink" @click="FcrDlg = true">
            飞牌登记
          </v-btn>
        </v-col>

        <v-col cols="4" class="text-center">
          <v-checkbox label="三宝台面显示" density="compact" hide-details />
        </v-col>

        <v-col cols="4">
          <v-btn block size="small" color="purple" @click="BaccaractDlg = true"> 路单 </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
  <FlyCardRegister v-model="FcrDlg"/>
  <BaccaractScoreboard v-model="BaccaractDlg" />
</template>

<script setup>
import { ref } from "vue";
import FlyCardRegister from "@/views/dialogs/Others/FlyCardRegister.vue";
import BaccaractScoreboard from "@/views/dialogs/Others/BaccaractScoreboard.vue";
const FcrDlg = ref(false);
const BaccaractDlg = ref(false);
</script>
