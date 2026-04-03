export function calculateMatches(userNumbers, drawnNumbers) {
  return userNumbers.filter(n => drawnNumbers.includes(n)).length
}

export function runDraw(allEntries) {
  const drawn = []
  while (drawn.length < 5) {
    const num = Math.floor(Math.random() * 45) + 1
    if (!drawn.includes(num)) drawn.push(num)
  }
  return drawn.sort((a, b) => a - b)
}

export function algorithmicDraw(allScores) {
  // Weighted by least frequent scores
  const freq = {}
  allScores.flat().forEach(n => { freq[n] = (freq[n] || 0) + 1 })
  const sorted = Array.from({ length: 45 }, (_, i) => i + 1)
    .sort((a, b) => (freq[a] || 0) - (freq[b] || 0))
  return sorted.slice(0, 5).sort((a, b) => a - b)
}