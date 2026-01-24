<template>
  <ServerSetting v-model="dialog.server" />
  <MCallSetting v-model="dialog.mcall" />
  <ResultSetting v-model="dialog.result" />
  <Logout v-model="dialog.logout" />

  <OddsSetting v-model="dialog.odds" />
  <BillSetting v-model="dialog.bill" />
  <ZeroPlayer v-model="dialog.zero" />
  <AllPlayer v-model="dialog.all" />
  <TableSetting v-model="dialog.table" />
  <ChipsBox v-model="dialog.chips" />
  <RemainPoint v-model="dialog.remain" />
  <FontReport v-model="dialog.fonts" />
  <WayBillSetting v-model="dialog.waybill" />
  <ModifyStation v-model="dialog.station" />
  <CopySetting v-model="dialog.copy" />

  <SummaryFinance v-model="dialog.summary" />
  <DetailFinance v-model="dialog.detail" />
  <BetDetail v-model="dialog.bet" />
  <CoinDetail v-model="dialog.coin" />

  <Statistics v-model="dialog.statistics" />
  <ClearBetSheet v-model="dialog.clear" />
</template>

<script setup>
import { useDialogStore } from "@/stores/dialog.store";
import {
  ServerSetting,
  MCallSetting,
  ResultSetting,
  Logout,
  OddsSetting,
  BillSetting,
  ZeroPlayer,
  AllPlayer,
  TableSetting,
  ChipsBox,
  RemainPoint,
  FontReport,
  WayBillSetting,
  ModifyStation,
  CopySetting,
  SummaryFinance,
  DetailFinance,
  BetDetail,
  CoinDetail,
  Statistics,
  ClearBetSheet,
} from "@/views/dialogs";

const dialog = useDialogStore();
</script>
