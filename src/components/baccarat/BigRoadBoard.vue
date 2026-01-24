<script setup>
import { computed } from "vue";

const props = defineProps({
  columns: {
    type: Array,
    required: true,
  },
});

const ROWS = 6;
const COLS = 28;

/* -----------------------------
   Build render grid from columns
----------------------------- */
const grid = computed(() => {
  const out = Array.from({ length: COLS }, () =>
    Array.from({ length: ROWS }, () => null),
  );

  props.columns.forEach((col, c) => {
    if (c >= COLS) return;
    col.forEach((cell, r) => {
      if (r < ROWS) out[c][r] = cell;
    });
  });

  return out;
});
</script>

<template>
  <div class="big-road-board">
    <div class="title">Big Road</div>

    <div class="grid">
      <template v-for="c in COLS" :key="c">
        <template v-for="r in ROWS" :key="`${c}-${r}`">
          <div class="cell">
            <div
              v-if="grid[c - 1][r - 1]"
              class="circle"
              :class="grid[c - 1][r - 1].color === 'R' ? 'red' : 'blue'"
            >
              <!-- Tie -->
              <span v-if="grid[c - 1][r - 1].tie" class="tie">
                {{ grid[c - 1][r - 1].tie }}
              </span>

              <!-- Player Pair -->
              <span
                v-if="grid[c - 1][r - 1].playerPair"
                class="pair pair-player"
              />

              <!-- Banker Pair -->
              <span
                v-if="grid[c - 1][r - 1].bankerPair"
                class="pair pair-banker"
              />
            </div>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<style scoped>
/* -----------------------------
   Board container
----------------------------- */
.big-road-board {
  background: #ffffff;
  border: 3px solid #ebd50e;
  padding: 6px;
  width: fit-content;
  user-select: none;
}

.title {
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 4px;
  color: #1e3a8a;
}

/* -----------------------------
   Grid
----------------------------- */
.grid {
  display: grid;
  grid-auto-flow: column;
  grid-template-rows: repeat(6, 40px);
  background: #f8fafc;
}

/* -----------------------------
   Cell
----------------------------- */
.cell {
  width: 40px;
  height: 40px;
  border-right: 1px solid #cbd5e1;
  border-bottom: 1px solid #cbd5e1;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* -----------------------------
   Main circle
----------------------------- */
.circle {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #ffffff;
  border: 2px solid;
  position: relative;
}

.red {
  border-color: #c62828;
}

.blue {
  border-color: #0d47a1;
}

/* -----------------------------
   Tie count
----------------------------- */
.tie {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: bold;
  color: #2e7d32;
}

/* -----------------------------
   Pair dots
----------------------------- */
.pair {
  width: 6px;
  height: 6px;
  background: #ffffff;
  /* border: 1px solid #000000; */
  border-radius: 50%;
  position: absolute;
}

.pair-player {
  top: -2px;
  left: 2px;
  background-color: #0d47a1;
}

.pair-banker {
  bottom: -2px;
  right: 2px;
  background-color: #c62828;
}
</style>
