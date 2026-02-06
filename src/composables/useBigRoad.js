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
  let baseCol = 0;

  for (const value of values) {
    const cell = createCell(value);

    // 🟢 Tie → attach
    if (cell.main === RESULT.TIE) {
      if (columns[col]?.[row]) {
        columns[col][row].ties++;
      }
      continue;
    }

    // first result
    if (!lastMain) {
      columns[col] = [];
      columns[col][row] = cell;
      lastMain = cell.main;
      continue;
    }

    // same result → down
    if (cell.main === lastMain) {
      // try to go down
      if (row + 1 < MAX_ROWS && !columns[col]?.[row + 1]) {
        row++;
      } else {
        // bottom hit OR collision → go right
        col++;
      }
    }
    // different → new column
    else {
      baseCol++; // move main column
      col = baseCol; // reset near first column
      row = 0;
      lastMain = cell.main;
    }

    if (!columns[col]) columns[col] = [];
    columns[col][row] = cell;
    lastMain = cell.main;
  }

  return columns;
}

export function normalizeBigRoad(columns, maxRows = 6) {
  return columns.map(col =>
    Array.from({ length: maxRows }, (_, r) => col?.[r] ?? null)
  )
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

