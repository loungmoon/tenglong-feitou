// Baccarat derived road evaluator
// Used for Big Eye (1), Small (2), Cockroach (3)

export class DerivedRoad {
  constructor(step, { useZhiLuo = true } = {}) {
    this.step = step
    this.useZhiLuo = useZhiLuo
  }

  /* -----------------------------
     Public API
  ----------------------------- */
  evaluate(bigRoadColumns = []) {
    const result = []

    for (let col = this.step; col < bigRoadColumns.length; col++) {
      const currentColumn = bigRoadColumns[col]
      if (!currentColumn || currentColumn.length === 0) continue

      for (let row = 0; row < currentColumn.length; row++) {
        // Skip first derived position
        if (col === this.step && row === 0) continue

        const color =
          row === 0
            ? this.evaluateHead(bigRoadColumns, col)
            : this.evaluateBody(bigRoadColumns, col, row)

        result.push(color)
      }
    }

    return result
  }

  /* -----------------------------
     Helpers
  ----------------------------- */

  getHeight(column) {
    return column?.length ?? 0
  }

  /* -----------------------------
     Head (路头)
     Compare column heights
  ----------------------------- */
  evaluateHead(columns, colIndex) {
    const leftHeight = this.getHeight(columns[colIndex - 1])
    const refHeight = this.getHeight(columns[colIndex - 1 - this.step])

    return leftHeight === refHeight ? "R" : "B"
  }

  /* -----------------------------
     Body (路中)
     Compare row existence / 直落
  ----------------------------- */
  evaluateBody(columns, colIndex, rowIndex) {
    const current = columns[colIndex]
    const reference = columns[colIndex - this.step]

    const sameRowExists =
      reference && rowIndex < reference.length

    const isZhiLuo =
      this.useZhiLuo &&
      reference &&
      current.length > reference.length &&
      rowIndex >= reference.length

    return sameRowExists || isZhiLuo ? "R" : "B"
  }
}
