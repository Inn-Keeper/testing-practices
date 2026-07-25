import { describe, expect, it } from 'vitest'
import fc from 'fast-check'
import { parseQueryString } from './example'

describe('parseQueryString', () => {
  it('parses well-formed pairs', () => {
    expect(parseQueryString('a=1&b=2')).toEqual({ a: '1', b: '2' })
  })

  it('never throws on arbitrary, unstructured input', () => {
    fc.assert(
      fc.property(fc.string(), (input) => {
        expect(() => parseQueryString(input)).not.toThrow()
      }),
    )
  })
})
