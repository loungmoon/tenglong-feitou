// src/composables/useBigRoad.js
const MAX_ROWS = 6;

export const RESULT = {
  BANKER: "BANKER",
  PLAYER: "PLAYER",
  TIE: "TIE",
};

export function parseGameHistory(historyStr) {
  return historyStr
    .split("^")
    .filter((v) => v !== "")
    .map(Number);
}

export function getMainResult(value) {
  if (value & 4) return RESULT.TIE;
  if (value & 1) return RESULT.BANKER;
  if (value & 2) return RESULT.PLAYER;
  return null;
}

function createCell(value) {
  return {
    raw: value,
    main: getMainResult(value),
    ties: 0,

    pair: {
      banker: (value & 8) === 8,
      player: (value & 16) === 16,
      any: (value & 256) === 256,
    },

    lucky6: {
      two: (value & 32) === 32,
      three: (value & 64) === 64,
    },

    perfect: (value & 128) === 128,
  };
}

export function buildBigRoad(values) {
  const columns = [];

  let col = 0;
  let row = 0;
  let lastMain = null;
  let startCol = 0;

  for (const value of values) {
    const cell = createCell(value);

    // 🟢 TIE → overlay only
    if (cell.main === RESULT.TIE) {
      if (columns[col]?.[row]) {
        columns[col][row].ties++;
      }
      continue;
    }

    // first non-tie
    if (!lastMain) {
      columns[col] = [];
      columns[col][row] = cell;
      lastMain = cell.main;
      continue;
    }

    // same result → continue column
    if (cell.main === lastMain) {
      if (
        row < MAX_ROWS - 1 &&
        !columns[col]?.[row + 1]
      ) {
        row++;
      } else {
        col++; // 🔑 overflow goes RIGHT
      }
    }
    // different result → new column
    else {
      col = startCol + 1;
      row = 0;
      startCol = col;
      lastMain = cell.main;
    }

    if (!columns[col]) columns[col] = [];
    columns[col][row] = cell;
    lastMain = cell.main;
  }

  return columns;
}

export function buildLogicalBigRoad(values) {
  const columns = [];
  let lastMain = null;

  for (const value of values) {
    const main = getMainResult(value);
    if (!main || main === RESULT.TIE) continue;

    let col = columns.at(-1);

    if (!col || col[0].main !== main) {
      col = [];
      columns.push(col);
    }

    col.push({ main });
    lastMain = main;
  }

  return columns;
}


export function buildBeadRoad(values, rows = 6) {
  const columns = [];
  let col = 0;
  let row = 0;

  for (const value of values) {
    const main = getMainResult(value);
    if (!main) continue;

    if (!columns[col]) columns[col] = [];

    columns[col][row] = {
      main,
      isTie: main === RESULT.TIE,
    };

    row++;

    if (row >= rows) {
      row = 0;
      col++;
    }
  }

  return columns.map(col =>
    Array.from({ length: rows }, (_, r) => col?.[r] ?? null)
  );
}

