import { describe, expect, it } from 'vitest'
import { calculateDiscount } from './example'

describe('calculateDiscount', () => {
  it('applies no discount below the smallest tier', () => {
    expect(calculateDiscount(10, 9)).toBe(90)
  })

  it('applies the 5% tier at the boundary quantity', () => {
    expect(calculateDiscount(10, 10)).toBe(95)
  })

  it('applies the 10% tier', () => {
    expect(calculateDiscount(10, 50)).toBe(450)
  })

  it('applies the 20% tier', () => {
    expect(calculateDiscount(10, 100)).toBe(800)
  })

  it('rejects a negative quantity', () => {
    expect(() => calculateDiscount(10, -1)).toThrow(RangeError)
  })
})
