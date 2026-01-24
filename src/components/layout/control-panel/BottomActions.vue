<template>
  <v-row dense>
    <!-- Left -->
    <v-col cols="6">
      <v-btn
        block
        color="pink-lighten-4"
        class="mb-2"
        @click="dlgImport = true"
      >
        导入表格
      </v-btn>

      <v-btn
        block
        height="80"
        color="pink-lighten-4"
        class="text-caption font-weight-medium"
        @click="dlgLottery = true"
      >
        开奖计算
      </v-btn>
    </v-col>

    <!-- Right -->
    <v-col cols="6">
      <v-btn
        block
        color="pink-lighten-4"
        class="mb-2"
        @click="dlgBetShot = true"
      >
        投注表截图
      </v-btn>

      <v-btn
        block
        color="pink-lighten-4"
        class="mb-2"
        @click="dlgScoreShot = true"
      >
        分数表截图
      </v-btn>

      <v-btn
        block
        color="pink-lighten-4"
        @click="dlgNextRound = true"
      >
        进入下局
      </v-btn>
    </v-col>
  </v-row>

  <!-- DIALOGS -->
  <ImportTable v-model="dlgImport" />
  <LotteryCalculate v-model="dlgLottery" />
  <BetTableScreenshot v-model="dlgBetShot" />
  <ScoreTableScreenshot v-model="dlgScoreShot" />
  <NextRounds v-model="dlgNextRound" />
</template>

<script setup>
import { ref } from 'vue'

import {
  ImportTable,
  LotteryCalculate,
  BetTableScreenshot,
  ScoreTableScreenshot,
  NextRounds
} from '@/views/dialogs'

const dlgImport = ref(false)
const dlgLottery = ref(false)
const dlgBetShot = ref(false)
const dlgScoreShot = ref(false)
const dlgNextRound = ref(false)
</script>
