export function formatCurrencyForLocale(amount: number, locale: string, currency: string): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount)
}

export function findMissingTranslationKeys(
  base: Record<string, string>,
  target: Record<string, string>,
): string[] {
  return Object.keys(base).filter((key) => !(key in target))
}
