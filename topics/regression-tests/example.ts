export function formatCurrency(amountInCents: number): string {
  const sign = amountInCents < 0 ? '-' : ''
  const absolute = Math.abs(amountInCents)
  const dollars = Math.floor(absolute / 100)
  const cents = String(absolute % 100).padStart(2, '0')
  return `${sign}$${dollars}.${cents}`
}
