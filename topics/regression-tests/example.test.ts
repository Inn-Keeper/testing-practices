import { describe, expect, it } from 'vitest'
import { formatCurrency } from './example'

describe('formatCurrency', () => {
  it('formats a positive amount', () => {
    expect(formatCurrency(1050)).toBe('$10.50')
  })

  // Regression test: a past version dropped the minus sign for negative
  // amounts, showing "$5.00" instead of "-$5.00" for a refund.
  it('keeps the minus sign for negative amounts (regression)', () => {
    expect(formatCurrency(-500)).toBe('-$5.00')
  })
})
