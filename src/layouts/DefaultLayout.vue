<template>
  <v-app>
    <AppNavbar
      :menus="menus"
      :stats-date="statsDate"
      :summary="summary"
      @action="dialog.open"
    />

     <v-main class="main-scroll">
      <v-container fluid class="pa-2">
        <v-row dense>

          <!-- LEFT: Main -->
          <v-col cols="12" md="7" lg="9">
            <Dashbord />
          </v-col>

          <!-- RIGHT: CONTROL PANEL -->
          <v-col cols="12" md="5" lg="3">
            <AppControlPanel />
          </v-col>

        </v-row>
      </v-container>
    </v-main>

    <DialogContainer />

  </v-app>
</template>

<script setup>
import { onMounted ,watch, ref } from "vue";
import AppNavbar from "@/components/layout/AppNavbar.vue";
import Dashbord from "@/views/Dashboard.vue"
import AppControlPanel from "@/components/layout/control-panel/ControlPanel.vue";
import DialogContainer from "@/components/dialogs/DialogContainer.vue";
import { useDialogStore } from "@/stores/dialog.store";
import { useResultSettingStore } from "@/stores/resultsetting.store";
import { useGroupPullStore } from "@/stores/group.store";
import { usePlayerStore } from "@/stores/player.store";

import menus from '@/config/menus'

const dialog = useDialogStore();
const groupStore = useGroupPullStore();
const resultstore = useResultSettingStore();
const playerStore = usePlayerStore();

const groupReady = ref(false);

onMounted(async () => {
  await groupStore.ensureReady()
  groupReady.value = true;

  await resultstore.fetchSetting()
  await resultstore.getDeskInfo()
});

watch(
  () => groupStore.setting.group_nickname,
  async (newVal, oldVal) => {
    if (!groupReady.value) return;
    if (!newVal || newVal === oldVal) return;

    playerStore.resetStore();
    await playerStore.fetchPlayers(true);
  }
);

const summary = { total: "1115", n: "1000", misc: "105", hedge: "10" };

const statsDate = '2025-12-13'
</script>


<style scoped>
.main-scroll {
  height: calc(100vh - 64px); /* navbar height */
  overflow-y: auto;
}
</style>