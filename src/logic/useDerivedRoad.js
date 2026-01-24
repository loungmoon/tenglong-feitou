import { ref } from "vue"
import { DerivedRoad } from "./DerivedRoad"
import { BigRoad } from "./BigRoad"

/**
 * Derived Road composable
 * Used for Big Eye / Small / Cockroach
 */
export function useDerivedRoad({ step, rows = 6 }) {
  const board = ref([])

  const evaluator = new DerivedRoad(step)
  const visualRoad = new BigRoad(rows)

  function update(bigRoadLogicalColumns = []) {
    // 1️⃣ Evaluate derived colors (R / B)
    const derivedColors = evaluator.evaluate(bigRoadLogicalColumns)

    // 2️⃣ Convert to BigRoad-compatible sequence
    const sequence = derivedColors
      .map(c => (c === "R" ? "P" : "B"))
      .join("")

    // 3️⃣ Build visual road
    visualRoad.init(sequence)

    // 4️⃣ Force Vue reactivity
    board.value = visualRoad.columns.map(col =>
      col?.map(cell => ({ ...cell }))
    )
  }

  return {
    board,
    update,
  }
}