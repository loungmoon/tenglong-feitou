<template>
  <v-sheet class="derived-road-wrapper" elevation="2">
    <div class="derived-road" ref="roadEl">
      <div
        v-for="(column, cIndex) in displayColumns"
        :key="cIndex"
        class="column"
      >
        <div v-for="rowIndex in maxRows" :key="rowIndex" class="cell">
          <template v-if="column[rowIndex - 1]">
            <!-- Big Eye: dot -->
            <span
              v-if="type === 'bigEye' && column[rowIndex - 1] === 'R'"
              class="big-eye red-dot"
            ></span>
            <span
              v-else-if="type === 'bigEye' && column[rowIndex - 1] === 'B'"
              class="big-eye blue-dot"
            ></span>

            <!-- Small Road: ring -->
            <span
              v-if="type === 'small' && column[rowIndex - 1] === 'R'"
              class="small-ring red-ring"
            ></span>
            <span
              v-else-if="type === 'small' && column[rowIndex - 1] === 'B'"
              class="small-ring blue-ring"
            ></span>

            <!-- Cockroach Road: slash -->
            <span
              v-if="type === 'cockroach' && column[rowIndex - 1] === 'R'"
              class="cockroach red-slash"
            ></span>
            <span
              v-else-if="type === 'cockroach' && column[rowIndex - 1] === 'B'"
              class="cockroach blue-slash"
            ></span>
          </template>
        </div>
      </div>
    </div>
  </v-sheet>
</template>

<script setup>
import { computed, ref, watch, nextTick } from "vue";

const props = defineProps({
  road: { type: Array, required: true }, // 2D grid
  type: { type: String, required: true }, // bigEye / small / cockroach
  maxRows: { type: Number, default: 6 },
  defaultCols: { type: Number, default: 40 },
  cellWidth: { type: Number, default: 28 },
});

const roadEl = ref(null);

const displayColumns = computed(() => {
  const cols = [];
  for (let i = 0; i < props.defaultCols; i++) {
    cols[i] = props.road[i] ?? [];
  }
  return cols;
});

const lastUsedColIndex = computed(() => {
  for (let i = props.road.length - 1; i >= 0; i--) {
    if (props.road[i]?.length) return i;
  }
  return 0;
});

watch(
  () => props.road,
  async () => {
    await nextTick();
    if (!roadEl.value) return;
    roadEl.value.scrollTo({
      left: lastUsedColIndex.value * props.cellWidth,
      behavior: "smooth",
    });
  },
  { deep: true },
);
</script>

<style scoped>
.derived-road-wrapper {
  background: #fff7cc;
  border: 4px solid #ffcc00;
  border-radius: 6px;
  overflow: hidden;
}

.derived-road {
  display: flex;
  white-space: nowrap;
}

.column {
  display: flex;
  flex-direction: column;
}

.cell {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border: 1px solid #e0e0e0;
}

/* ===== Big Eye: dot ===== */
.big-eye {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: block;
}
.red-dot {
  background-color: #d32f2f;
}
.blue-dot {
  background-color: #1976d2;
}

/* ===== Small Road: ring ===== */
.small-ring {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid;
  box-sizing: border-box;
}
.red-ring {
  border-color: #d32f2f;
}
.blue-ring {
  border-color: #1976d2;
}

/* ===== Cockroach Road: slash ===== */
.cockroach {
  width: 14px;
  height: 14px;
  display: block;
  position: relative;
}
.red-slash::before,
.blue-slash::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-top: 2px solid;
  transform: rotate(45deg);
}
.red-slash::before {
  border-color: #d32f2f;
}
.blue-slash::before {
  border-color: #1976d2;
}
</style>
