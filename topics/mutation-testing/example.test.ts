import { describe, expect, it } from 'vitest'
import { clamp } from './example'

describe('clamp', () => {
  it('returns the value unchanged when within range', () => {
    expect(clamp(5, 0, 10)).toBe(5)
  })

  it('clamps to min when below range', () => {
    expect(clamp(-5, 0, 10)).toBe(0)
  })

  it('clamps to max when above range', () => {
    expect(clamp(15, 0, 10)).toBe(10)
  })

  it('is inclusive of the min boundary', () => {
    expect(clamp(0, 0, 10)).toBe(0)
  })

  it('is inclusive of the max boundary', () => {
    expect(clamp(10, 0, 10)).toBe(10)
  })
})
