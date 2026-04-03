export function calculatePrizePool(subscriberCount, plan = 'monthly') {
  const pricePerUser = plan === 'yearly' ? 99.99 / 12 : 9.99
  const total = subscriberCount * pricePerUser
  return {
    total: total.toFixed(2),
    fiveMatch: (total * 0.40).toFixed(2),
    fourMatch: (total * 0.35).toFixed(2),
    threeMatch: (total * 0.25).toFixed(2),
  }
}