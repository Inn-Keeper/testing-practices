import { describe, expect, it } from 'vitest'
import { findMissingTranslationKeys, formatCurrencyForLocale } from './example'

describe('formatCurrencyForLocale', () => {
  it('formats US dollars with two decimal places', () => {
    expect(formatCurrencyForLocale(1234.5, 'en-US', 'USD')).toBe('$1,234.50')
  })

  it('formats Euros with locale-specific grouping and decimal separators', () => {
    expect(formatCurrencyForLocale(1234.5, 'de-DE', 'EUR')).toBe('1.234,50\xa0€')
  })

  it('formats Japanese yen with zero decimal places (a common i18n bug source)', () => {
    expect(formatCurrencyForLocale(1234, 'ja-JP', 'JPY')).toBe('￥1,234')
  })
})

describe('findMissingTranslationKeys', () => {
  it('finds keys present in the base locale but missing from the target', () => {
    const en = { greeting: 'Hello', farewell: 'Goodbye' }
    const es = { greeting: 'Hola' }

    expect(findMissingTranslationKeys(en, es)).toEqual(['farewell'])
  })

  it('returns an empty array when all keys are translated', () => {
    const en = { greeting: 'Hello' }
    const es = { greeting: 'Hola' }

    expect(findMissingTranslationKeys(en, es)).toEqual([])
  })
})
