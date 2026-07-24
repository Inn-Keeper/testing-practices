import { describe, expect, it } from 'vitest'
import fc from 'fast-check'
import { sortAscending } from './example'

describe('sortAscending', () => {
  it('always returns an array of the same length as the input', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), (numbers) => {
        expect(sortAscending(numbers)).toHaveLength(numbers.length)
      }),
    )
  })

  it('always returns a sorted array', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), (numbers) => {
        const sorted = sortAscending(numbers)
        for (let i = 1; i < sorted.length; i++) {
          expect(sorted[i]).toBeGreaterThanOrEqual(sorted[i - 1])
        }
      }),
    )
  })

  it('is idempotent: sorting an already-sorted array changes nothing', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), (numbers) => {
        const once = sortAscending(numbers)
        const twice = sortAscending(once)
        expect(twice).toEqual(once)
      }),
    )
  })
})
