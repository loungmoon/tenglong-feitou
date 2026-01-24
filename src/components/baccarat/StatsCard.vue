<script setup>
const props = defineProps({
  title: String,
  stats: {
    type: Object,
    required: true,
  },
  color: {
    type: String,
    default: "red",
  },
})
</script>

<template>
  <v-card
    :color="color"
    variant="flat"
    class="stats-card"
  >
    <v-card-title class="text-center text-white">
      {{ title }}
    </v-card-title>

    <v-card-text class="text-white text-body-2">
      <div class="row"><span>Rounds</span><span>{{ stats.total }}</span></div>
      <div class="row"><span>Player</span><span>{{ stats.player }} ({{ stats.playerPct }}%)</span></div>
      <div class="row"><span>Banker</span><span>{{ stats.banker }} ({{ stats.bankerPct }}%)</span></div>
      <div class="row"><span>Tie</span><span>{{ stats.tie }}({{ stats.tiePct }}%)</span></div>
      <div class="row"><span>PP</span><span>{{ stats.playerPair }}</span></div>
      <div class="row"><span>BP</span><span>{{ stats.bankerPair }}</span></div>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.stats-card {
  width: 190px;
}
.row {
  display: flex;
  justify-content: space-between;
}
</style>
