const RESULT = {
  BANKER: "BANKER",
  PLAYER: "PLAYER",
  TIE: "TIE",
};

function getMainResult(value) {
  if (value & 4) return RESULT.TIE;
  if (value & 1) return RESULT.BANKER;
  if (value & 2) return RESULT.PLAYER;
  return null;
}

function decodeCell(value) {
  return {
    main: getMainResult(value),

    pair: {
      banker: (value & 8) === 8,
      player: (value & 16) === 16,
      any: (value & 256) === 256,
    },

    lucky6: {
      two: (value & 32) === 32,
      three: (value & 64) === 64,
    },

    perfectPair: (value & 128) === 128,
  };
}

export function buildBaccaratStatistics(values = []) {
  const stats = {
    total: 0,

    banker: 0,
    player: 0,
    tie: 0,

    bankerPair: 0,
    playerPair: 0,

    lucky6_2: 0,
    lucky6_3: 0,
  };

  for (const value of values) {
    const cell = decodeCell(value);

    stats.total++;

    if (cell.main === RESULT.BANKER) stats.banker++;
    if (cell.main === RESULT.PLAYER) stats.player++;
    if (cell.main === RESULT.TIE) stats.tie++;

    if (cell.pair.banker) stats.bankerPair++;
    if (cell.pair.player) stats.playerPair++;

    if (cell.lucky6.two) stats.lucky6_2++;
    if (cell.lucky6.three) stats.lucky6_3++;
  }

  return stats;
}

export function percent(value, total) {
  if (!total) return "0%";
  return Math.round((value / total) * 100) + "%";
}