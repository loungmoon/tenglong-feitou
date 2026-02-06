// useDerivedRoadGrid.js
export function buildDerivedBigRoad(flatArray, maxRows = 6) {
  const columns = []

  flatArray.forEach((color) => {
    if (columns.length === 0) {
      columns.push([color])
      return
    }

    const lastCol = columns[columns.length - 1]

    // if last column full or color differs from first color of last column → new column
    if (lastCol.length >= maxRows || color !== lastCol[0]) {
      columns.push([color])
    } else {
      lastCol.push(color)
    }
  })

  return columns
}
