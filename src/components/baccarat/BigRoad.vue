<!-- components/BigRoad.vue -->
<template>
  <v-sheet class="big-road-wrapper" elevation="2">
    <div class="big-road" ref="roadEl">
      <div
        v-for="(column, cIndex) in displayColumns"
        :key="cIndex"
        class="column"
      >
        <div v-for="rowIndex in MAX_ROWS" :key="rowIndex" class="cell">
          <!-- CELL CONTENT -->
          <template v-if="column[rowIndex - 1]">
            <div class="ring" :class="column[rowIndex - 1].main?.toLowerCase()">
              <!-- tie count -->
              <span v-if="column[rowIndex - 1].ties > 0" class="tie-dot">
                {{ column[rowIndex - 1].ties }}
              </span>
            </div>

            <div>
              <span v-if="column[rowIndex - 1].pair.banker" class="pair-dot banker-pair"></span>
              <span v-if="column[rowIndex - 1].pair.player" class="pair-dot player-pair"></span>
              <span v-if="column[rowIndex - 1].lucky6.two" class="lucky6-gold"></span>
              <span v-if="column[rowIndex - 1].lucky6.three" class="lucky6-gold strong"></span>
              <span v-if="column[rowIndex - 1].pair.any" class="any-pair-dot"></span>
              <span v-if="column[rowIndex - 1].perfect" class="perfect-ring"></span>
            </div>
          </template>
        </div>
      </div>
    </div>
  </v-sheet>
</template>

<script setup>
import { computed, ref, watch, nextTick } from "vue";

const props = defineProps({
  road: {
    type: Array,
    required: true,
  },
});

/* ===== CONSTANTS ===== */
const MAX_ROWS = 6;
const DEFAULT_COLS = 40; // casino default width
const CELL_WIDTH = 34;

/* ===== REFS ===== */
const roadEl = ref(null);

/* ===== ALWAYS SHOW FIXED COLUMNS ===== */
const displayColumns = computed(() => {
  const cols = [];
  for (let i = 0; i < DEFAULT_COLS; i++) {
    cols[i] = props.road[i] ?? [];
  }
  return cols;
});

/* ===== FIND LAST USED COLUMN ===== */
const lastUsedColIndex = computed(() => {
  for (let i = props.road.length - 1; i >= 0; i--) {
    if (props.road[i] && props.road[i].length > 0) {
      return i;
    }
  }
  return 0;
});

/* ===== AUTO SCROLL LIKE CASINO ===== */
watch(
  () => props.road,
  async () => {
    await nextTick();
    if (!roadEl.value) return;

    roadEl.value.scrollTo({
      left: lastUsedColIndex.value * CELL_WIDTH,
      behavior: "smooth",
    });
  },
  { deep: true },
);
</script>

<style scoped>
.big-road-wrapper {
  background: #fff7cc;
  border: 4px solid #ffcc00;
  border-radius: 8px;
  overflow: hidden;
}

/* road container */
.big-road {
  display: flex;
  white-space: nowrap;
}

/* column */
.column {
  display: flex;
  flex-direction: column;
}

/* cell grid */
.cell {
  width: 34px;
  height: 34px;
  padding: 2px;
  border: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

/* main circle */
.ring {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #fff;
  border: none;
  box-sizing: border-box;
  position: relative;
}

/* banker / player */
.ring.banker {
   box-shadow: 0 0 0 3px #d32f2f;
}

.ring.player {
   box-shadow: 0 0 0 3px #1976d2;
}

.tie-dot {
  position: absolute;
  top: -2px;
  right: -2px;

  width: 12px;
  height: 12px;
  border-radius: 50%;

  background:#2e7d32;

  color: #fff;
  font-size: 8px;
  font-weight: 700;

  display: flex;
  align-items: center;
  justify-content: center;

  line-height: 1;
  box-sizing: border-box;
}

.pair-dot {
  position: absolute;
  width: 7px;
  height: 7px;
  border-radius: 50%;
}

.banker-pair {
  background: #d32f2f;
  top: 3px;
  left: 3px;
}

.player-pair {
  background: #1976d2;
  bottom: 3px;
  right: 3px;
}
.perfect-ring {
  position: absolute;
  inset: 1px;
  border-radius: 50%;
  border: 2px solid rgb(255, 174, 0);
  box-shadow: 0 0 4px rgba(255, 215, 0, 0.8);
}

.any-pair-dot {
  position: absolute;
  width: 7px;
  height: 7px;
  background: #2e7d32;
  border-radius: 50%;
  bottom: 3px;
  left: 3px;
}

.lucky6-gold {
  position: absolute;
  inset: 6px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255,215,0,0.35) 0%,
    rgba(46,125,50,0.5) 60%,
    transparent 70%
  );
}

.lucky6-gold.strong{
   background: radial-gradient(
    circle,
    rgba(255, 136, 0, 0.35) 0%,
    rgba(190, 19, 13, 0.5) 60%,
    transparent 70%
  );
}

</style>
