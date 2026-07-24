import { bench, describe } from 'vitest'
import { findLinear, findWithSet } from './example'

const haystack = Array.from({ length: 10_000 }, (_, i) => i)
const haystackSet = new Set(haystack)
const needle = 9_999

describe('finding an element in a 10,000-item collection', () => {
  bench('Array.includes (linear scan)', () => {
    findLinear(haystack, needle)
  })

  bench('Set.has (hash lookup)', () => {
    findWithSet(haystackSet, needle)
  })
})
