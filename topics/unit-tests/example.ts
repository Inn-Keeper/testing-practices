const TIER_THRESHOLDS = [
  { minQuantity: 100, rate: 0.2 },
  { minQuantity: 50, rate: 0.1 },
  { minQuantity: 10, rate: 0.05 },
] as const

export function calculateDiscount(unitPrice: number, quantity: number): number {
  if (unitPrice < 0 || quantity < 0) {
    throw new RangeError('unitPrice and quantity must be non-negative')
  }

  const tier = TIER_THRESHOLDS.find((t) => quantity >= t.minQuantity)
  const rate = tier?.rate ?? 0
  return unitPrice * quantity * (1 - rate)
}
