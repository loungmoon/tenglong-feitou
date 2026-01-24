<script setup>
import { computed } from "vue"

const props = defineProps({
  board: {
    type: Array,
    required: true,
  },
  title: {
    type: String,
    default: "",
  },
  variant: {
    type: String,
    default: "dot", // dot | ring | slash
  },
  rows: {
    type: Number,
    default: 6,
  },
  cols: {
    type: Number,
    default: 39,
  },
})

/* -----------------------------
   Build render grid
----------------------------- */
const grid = computed(() => {
  const out = Array.from({ length: props.cols }, () =>
    Array.from({ length: props.rows }, () => null)
  )

  if (!Array.isArray(props.board)) return out

  props.board.forEach((col, c) => {
    if (!Array.isArray(col) || c >= props.cols) return

    col.forEach((cell, r) => {
      if (r < props.rows) {
        out[c][r] = cell
      }
    })
  })

  return out
})

</script>

<template>
  <div class="derived-road-board">
    <div v-if="title" class="title">
      {{ title }}
    </div>

    <div class="grid">
      <template v-for="c in cols" :key="c">
        <template v-for="r in rows" :key="`${c}-${r}`">
          <div class="cell">
            <div
              v-if="grid[c - 1][r - 1]"
              class="mark"
              :class="[grid[c - 1][r - 1].color === 'R' ? 'red' : 'blue',variant]"
            />
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<style scoped>
/* -----------------------------
   Container
----------------------------- */
.derived-road-board {
  background: #ffffff;
  border: 2px solid #ebd50e;
  padding: 4px;
  width: fit-content;
  user-select: none;
}

.title {
  font-size: 12px;
  font-weight: bold;
  margin-bottom: 4px;
  color: #1e3a8a;
  text-align: center;
}

/* -----------------------------
   Grid
----------------------------- */
.grid {
  display: grid;
  grid-auto-flow: column;
  grid-template-rows: repeat(6, 29px);
  background: #f8fafc;
}

/* -----------------------------
   Cell
----------------------------- */
.cell {
  width: 29px;
  height: 29px;
  border-right: 1px solid #cbd5e1;
  border-bottom: 1px solid #cbd5e1;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* -----------------------------
   Base mark
----------------------------- */
.mark {
  position: relative;
}

/* -----------------------------
   Big Eye (solid dot)
----------------------------- */
.mark.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

/* -----------------------------
   Small Road (hollow ring)
----------------------------- */
.mark.ring {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: transparent;
  border: 1px solid currentColor;
}

/* -----------------------------
   Cockroach (slash)
----------------------------- */
.mark.slash {
   width: 11px;
  height: 2px;
  background: currentColor;
  transform: rotate(-45deg);
  border-radius: 1px;
}

/* -----------------------------
   Colors
----------------------------- */
.red {
  background: #c62828;
  color: #c62828;
}

.blue {
  background: #0d47a1;
  color: #0d47a1;
}

</style>
