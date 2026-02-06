// DerivedRoad.js
export class DerivedRoad {
  constructor(step, { useZhiLuo = true } = {}) {
    this.step = step
    this.useZhiLuo = useZhiLuo
  }

  evaluate(bigRoad = []) {
    const derived = []

    for (let col = this.step; col < bigRoad.length; col++) {
      const column = bigRoad[col]
      if (!column?.length) continue

      column.forEach((_, row) => {
        if (col === this.step && row === 0) return

        const color = row === 0
          ? this.evaluateHead(bigRoad, col)
          : this.evaluateBody(bigRoad, col, row)

        derived.push(color)
      })
    }

    return derived
  }

  evaluateHead(bigRoad, col) {
    const leftHeight = this.getHeight(bigRoad[col - 1])
    const refHeight = this.getHeight(bigRoad[col - 1 - this.step])
    return leftHeight === refHeight ? "R" : "B"
  }

  evaluateBody(bigRoad, col, row) {
    const current = bigRoad[col]
    const ref = bigRoad[col - this.step]

    const hasSameRow = ref && row < ref.length
    const isZhiLuo = this.useZhiLuo && ref && current.length > ref.length && row >= ref.length

    return hasSameRow || isZhiLuo ? "R" : "B"
  }

  getHeight(column) {
    return column?.length ?? 0
  }
}
