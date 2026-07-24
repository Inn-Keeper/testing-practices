# Localization / i18n Tests

Verify that dates, numbers, currency, and text render correctly per locale,
and that no translation key is silently missing.

**When to use it:** any app that ships in more than one locale — catches
both formatting bugs (wrong decimal/grouping separators, wrong currency
symbol) and incomplete translations before they reach users.

**Example:** `example.ts` uses the native `Intl.NumberFormat` for
locale-correct currency formatting, and a plain key-diff for translation
completeness; `example.test.ts` covers three locales plus a missing-key
case.

## References

- [MDN: Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat)
- [W3C: Internationalization (i18n) Techniques](https://www.w3.org/International/techniques/authoring-html)
