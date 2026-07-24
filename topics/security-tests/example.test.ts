import { describe, expect, it } from 'vitest'
import { escapeHtml } from './example'

const XSS_PAYLOADS = [
  '<script>alert(1)</script>',
  '"><img src=x onerror=alert(1)>',
  "<svg/onload=alert('xss')>",
]

describe('escapeHtml', () => {
  it.each(XSS_PAYLOADS)('neutralizes the markup in %j', (payload) => {
    expect(escapeHtml(payload)).not.toMatch(/[<>]/)
  })

  it('leaves plain text unchanged', () => {
    expect(escapeHtml('Hello, world!')).toBe('Hello, world!')
  })

  it('escapes ampersands so entities cannot be forged', () => {
    expect(escapeHtml('Tom & Jerry')).toBe('Tom &amp; Jerry')
  })
})
