export class BeadRoad {
  constructor(rows = 6) {
    this.rows = rows
    this.columns = []
  }

  reset() {
    this.columns = []
  }

  init(results = []) {
    this.reset()

    if (!results) return this.columns

    const list = Array.isArray(results)
      ? results
      : String(results).split("")

    let col = []

    for (const raw of list) {
      const cell = this.parseResult(raw)
      if (!cell) continue

      col.push(cell)

      if (col.length === this.rows) {
        this.columns.push(col)
        col = []
      }
    }

    if (col.length) this.columns.push(col)

    return this.columns
  }

  /* -----------------------------
     Parse backend result
  ----------------------------- */
  parseResult(raw) {
    if (!raw) return null

    // Object format
    if (typeof raw === "object") {
      return {
        color:
          raw.winner === "P" ? "R" :
          raw.winner === "B" ? "B" :
          raw.winner === "T" ? "G" : null,
        playerPair: !!raw.playerPair,
        bankerPair: !!raw.bankerPair,
      }
    }

    // String format
    const v = raw.toUpperCase()

    const cell = {
      color: null,
      playerPair: false,
      bankerPair: false,
    }

    if (v.includes("T")) cell.color = "G"
    else if (v.startsWith("P")) cell.color = "R"
    else if (v.startsWith("B")) cell.color = "B"

    if (v.includes("PP")) cell.playerPair = true
    if (v.includes("BP")) cell.bankerPair = true

    return cell.color ? cell : null
  }
}
