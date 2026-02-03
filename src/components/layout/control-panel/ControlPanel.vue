<template>
  <v-container fluid class="pa-1">
    <ActionPlayerPanel />

    <DeskInfoResultPanel />

    <CurrentTable />
    <BottomActions  />
  </v-container>
</template>

<script setup>

import ActionPlayerPanel from "./ActionPlayerPanel.vue";
import DeskInfoResultPanel from "./DeskInfoResultPanel.vue";
import CurrentTable from "./CurrentTable.vue";
import BottomActions from "./BottomActions.vue";


</script>
