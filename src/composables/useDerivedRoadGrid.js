export function buildDerivedBigRoad(flatArray, maxRows = 6) {
  const columns = []

  let col = 0
  let row = 0
  let lastColor = null
  let startCol = 0

  flatArray.forEach(color => {
    if (!color) return

    // first value
    if (!lastColor) {
      columns[col] = []
      columns[col][row] = color
      lastColor = color
      return
    }

    // same color → go down if possible
    if (color === lastColor) {
      if (
        row < maxRows - 1 &&
        !columns[col]?.[row + 1]
      ) {
        row++
      } else {
        col++ // right-bottom
      }
    }
    // different color → new column
    else {
      col = startCol + 1
      row = 0
      startCol = col
      lastColor = color
    }

    if (!columns[col]) columns[col] = []
    columns[col][row] = color
    lastColor = color
  })

  return columns
}
