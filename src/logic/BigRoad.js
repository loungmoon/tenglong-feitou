// BigRoad.js
export class BigRoad {
  constructor(maxRows = 6) {
    this.maxRows = maxRows
    this.reset()
  }

  reset() {
    // visual grid
    this.columns = []

    // logical grid for derived roads
    this.logicalColumns = []

    this.lastColor = null
    this.col = 0
    this.row = 0
    this.startCol = 0
    this.lastCell = null
  }

  /* -----------------------------
     INIT
  ----------------------------- */
  init(sequence = []) {
    this.reset()

    if (Array.isArray(sequence)) {
      sequence.forEach(v => this.push(v))
    } else {
      String(sequence).split("").forEach(v => this.push(v))
    }

    return this.columns
  }

  /* -----------------------------
     RESULT PARSER
  ----------------------------- */
  parseResult(raw) {
    if (!raw) return null

    // object format (future backend-safe)
    if (typeof raw === "object") {
      return {
        color:
          raw.winner === "P" ? "R" :
          raw.winner === "B" ? "B" : null,
        isTie: raw.winner === "T",
        playerPair: !!raw.playerPair,
        bankerPair: !!raw.bankerPair,
      }
    }

    // string format
    const v = raw.toUpperCase()

    const result = {
      color: null,
      isTie: false,
      playerPair: false,
      bankerPair: false,
    }

    if (v.includes("T")) result.isTie = true
    if (v.startsWith("P")) result.color = "R"
    if (v.startsWith("B")) result.color = "B"
    if (v.includes("PP")) result.playerPair = true
    if (v.includes("BP")) result.bankerPair = true

    return result.color || result.isTie ? result : null
  }

  /* -----------------------------
     PUSH RESULT
  ----------------------------- */
  push(raw) {
    const result = this.parseResult(raw)
    if (!result) return

    // 🟢 TIE — overlay only
    if (result.isTie) {
      if (this.lastCell) {
        this.lastCell.tie++
        if (result.playerPair) this.lastCell.playerPair = true
        if (result.bankerPair) this.lastCell.bankerPair = true
      }
      return
    }

    const { color, playerPair, bankerPair } = result

    // first non-tie result
    if (!this.lastColor) {
      this.placeLogical(color)
      this.placeVisual(0, 0, color, playerPair, bankerPair)
      this.lastColor = color
      return
    }

    // same color (continue column)
    if (color === this.lastColor) {
      this.placeLogical(color)

      if (
        this.row < this.maxRows - 1 &&
        !this.getCell(this.col, this.row + 1)
      ) {
        this.row++
      } else {
        this.col++
      }
    }
    // color change (new column)
    else {
      this.placeLogical(color)
      this.col = this.startCol + 1
      this.row = 0
      this.startCol = this.col
      this.lastColor = color
    }

    this.placeVisual(this.col, this.row, color, playerPair, bankerPair)
  }

  /* -----------------------------
     LOGICAL (Derived Roads)
  ----------------------------- */
  placeLogical(color) {
    let col = this.logicalColumns.at(-1)

    if (!col || col[0].color !== color) {
      col = []
      this.logicalColumns.push(col)
    }

    col.push({ color })
  }

  /* -----------------------------
     VISUAL (Big Road UI)
  ----------------------------- */
  placeVisual(col, row, color, playerPair, bankerPair) {
    if (!this.columns[col]) this.columns[col] = []

    const cell = {
      color,
      tie: 0,
      playerPair,
      bankerPair,
    }

    this.columns[col][row] = cell
    this.lastCell = cell
  }

  getCell(col, row) {
    return this.columns[col]?.[row]
  }
}
