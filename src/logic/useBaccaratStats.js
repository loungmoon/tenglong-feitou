import { computed } from "vue"

export function useBaccaratStats(results) {
  const stats = computed(() => {
    let total = 0
    let player = 0
    let banker = 0
    let tie = 0
    let playerPair = 0
    let bankerPair = 0

    results.value.forEach(r => {
      if (r.includes("T")) tie++
      if (r.startsWith("P")) player++
      if (r.startsWith("B")) banker++
      if (r.includes("PP")) playerPair++
      if (r.includes("BP")) bankerPair++
      total++
    })

    return {
      total,
      player,
      banker,
      tie,
      playerPair,
      bankerPair,
      playerPct: total ? Math.round((player / total) * 100) : 0,
      bankerPct: total ? Math.round((banker / total) * 100) : 0,
      tiePct: total ? Math.round((tie / total) * 100) : 0,
    }
  })

  return { stats }
}
