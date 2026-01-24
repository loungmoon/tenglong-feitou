<template>
  <v-dialog v-model="model" max-width="1200" persistent>
    <v-card height="700">
      <v-card-title class="bg-grey-lighten-4">
        <div class="d-flex align-center w-100">
          <v-icon class="mr-2">mdi-cog</v-icon>
          <span class="text-subtitle-1 font-weight-medium">
            Baccaract Scoreboard
          </span>

          <v-spacer />

          <v-btn icon variant="text" size="small" @click="model = false">
            <v-icon size="18">mdi-close</v-icon>
          </v-btn>
        </div>
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-5 h-100 table-bg">
        <!-- Big Road -->
        <BigRoadBoard :columns="bigRoadVisual" />

        <!-- Big Eye -->
        <div class="derived-row full mt-2">
          <DerivedRoadBoard
            title="Big Eye"
            :board="bigEye.board.value"
            variant="dot"
          />
        </div>

        <!-- Small + Cockroach -->
        <div class="derived-row">
          <DerivedRoadBoard
            title="Small"
            :board="small.board.value"
            variant="ring"
            :cols="19"
          />
          <DerivedRoadBoard
            title="Cockroach"
            :board="cockroach.board.value"
            variant="slash"
            :cols="19"
          />
        </div>

    

        <v-row >
          <!-- LEFT: ROADS -->
               <!-- Bead Road -->
          <v-col cols="6">
            <BeadRoad :results="results" class="mt-1" />
          </v-col>

          <!-- RIGHT: STATS -->
          <v-col cols="6" class="d-flex flex-row ga-2 mt-1">
            <StatsCard title="Today" :stats="todayStats" color="red-darken-2" />
            <StatsCard
              title="Yesterday"
              :stats="todayStats"
              color="blue-darken-2"
            />
            <StatsCard
              title="Before"
              :stats="todayStats"
              color="green-darken-2"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from "vue";
import { BigRoad } from "@/logic/BigRoad";
import { useDerivedRoad } from "@/logic/useDerivedRoad";
import { useBaccaratStats } from "@/logic/useBaccaratStats";

import BigRoadBoard from "@/components/baccarat/BigRoadBoard.vue";
import DerivedRoadBoard from "@/components/baccarat/DerivedRoadBoard.vue";
import BeadRoad from "@/components/baccarat/BeadRoadBoard.vue";
import StatsCard from "@/components/baccarat/StatsCard.vue";
const model = defineModel({ type: Boolean });

/* -----------------------------
   Game Results
----------------------------- */
const results = ref([
  "P",
  "P",
  "P",
  "B",
  "PP",
  "BPP",
  "T",
  "P",
  "BP",
  "B",
  "B",
  "P",
  "T",
  "B",
  "B",
  "B",
  "P",
  "T"
]);

/* -----------------------------
   Big Road
----------------------------- */
const bigRoad = new BigRoad(6);

const bigRoadVisual = ref([]);
const bigRoadLogical = ref([]);

const { stats: todayStats } = useBaccaratStats(results);

watch(
  results,
  (val) => {
    bigRoad.init(val);

    // force Vue reactivity
    bigRoadVisual.value = bigRoad.columns.map((col) =>
      col ? col.map((cell) => ({ ...cell })) : [],
    );

    bigRoadLogical.value = bigRoad.logicalColumns.map((col) => [...col]);
  },
  { immediate: true },
);

/* -----------------------------
   Derived Roads
----------------------------- */
const bigEye = useDerivedRoad({ step: 1 });
const small = useDerivedRoad({ step: 2 });
const cockroach = useDerivedRoad({ step: 3 });

watch(
  bigRoadLogical,
  (val) => {
    bigEye.update(val);
    small.update(val);
    cockroach.update(val);
  },
  { immediate: true },
);
</script>

<style scoped>
.table-bg {
  background: #1e3a8a; /* casino green */
}

.derived-row {
  display: flex;
  gap: 8px;
}

.full {
  margin-bottom: 6px;
}
</style>
