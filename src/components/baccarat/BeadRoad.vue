<template>
  <v-sheet class="bead-road-frame">
    <div class="bead-road">
      <div
        v-for="(col, cIndex) in displayColumns"
        :key="cIndex"
        class="column"
      >
        <div
          v-for="rowIndex in MAX_ROWS"
          :key="rowIndex"
          class="cell"
        >
          <div
            v-if="col[rowIndex - 1]"
            class="dot"
            :class="col[rowIndex - 1].main.toLowerCase()"
          >
            {{ getLabel(col[rowIndex - 1].main) }}
          </div>
        </div>
      </div>
    </div>
  </v-sheet>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  road: { type: Array, required: true },
});

const MAX_ROWS = 6;
const FIXED_COLS = 20;

const displayColumns = computed(() =>
  Array.from({ length: FIXED_COLS }, (_, i) => props.road[i] ?? [])
);

function getLabel(main) {
  if (main === "BANKER") return "庄";
  if (main === "PLAYER") return "闲";
  if (main === "TIE") return "和";
  return "";
}
</script>

<style scoped>
.bead-road-frame {
  background: #fff7cc;
  border: 4px solid #ffcc00;
  border-radius: 8px;
  overflow: hidden;
}

.bead-road {
  display: flex;
}

.column {
  width: 40px;
  flex-shrink: 0;
}

.cell {
  width: 40px;
  height: 40px;
  border: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dot {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 17px;
  font-weight: bold;
}

.banker { background: #d32f2f; }
.player { background: #1976d2; }
.tie { background: #2e7d32; }
</style>
