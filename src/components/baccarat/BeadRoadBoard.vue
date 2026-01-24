<script setup>
import { computed, watch, ref } from "vue"
import { BeadRoad } from "@/logic/BeadRoad"

const props = defineProps({
  results: {
    type: [String, Array],
    required: true,
  },
})

const label = (color) => {
  if (color === "R") return "闲" // Player
  if (color === "B") return "庄" // Banker
  if (color === "G") return "和" // Tie
  return ""
}

const ROWS = 6
const COLS = 15

const road = new BeadRoad(ROWS)
const columns = ref([])

watch(
  () => props.results,
  (val) => {
    road.init(val)
    columns.value = [...road.columns] // 🔑 force reactivity
  },
  { immediate: true }
)

const grid = computed(() => {
  const out = Array.from({ length: COLS }, () =>
    Array.from({ length: ROWS }, () => null)
  )

  columns.value.forEach((col, c) => {
    if (c >= COLS) return
    col.forEach((cell, r) => {
      if (r < ROWS) out[c][r] = cell
    })
  })

  return out
})
</script>
<template>
  <div class="bead-road">
    <div class="title">BeadRoad</div>

    <div class="grid">
      <template v-for="c in COLS" :key="c">
        <template v-for="r in ROWS" :key="`${c}-${r}`">
          <div class="cell">
            <div
              v-if="grid[c - 1][r - 1]"
              class="bead"
              :class="grid[c - 1][r - 1].color"
            >
              {{ label(grid[c - 1][r - 1].color) }}
            </div>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<style scoped>
.bead-road {
  background: #ffffff;
  border: 3px solid #ebd50e;
  padding: 6px;
  width: fit-content;
  user-select: none;
}

.title {
  font-size: 13px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 6px;
  color: #1e3a8a;
}

.grid {
  display: grid;
  grid-auto-flow: column;
  grid-template-rows: repeat(6, 38px);
  background: #f8fafc;
}

.cell {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid #cbd5e1;
  border-bottom: 1px solid #cbd5e1;
}

/* 🔵🔴🟢 FULL CIRCLE */
.bead {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  color: #ffffff;
  font-size: 14px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Colors */
.bead.R {
  background: #d32f2f; /* Player */
}

.bead.B {
  background: #1565c0; /* Banker */
}

.bead.G {
  background: #2e7d32; /* Tie */
}
</style>

