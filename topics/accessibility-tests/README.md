# Accessibility Tests

Automatically check rendered markup against WCAG rules — missing labels,
missing alt text, invalid ARIA usage — the mechanically-checkable subset of
accessibility. It doesn't replace manual screen-reader testing, but it
catches the common mistakes automatically on every run.

**When to use it:** any UI component or page, as a baseline gate — treat a
clean axe-core run as necessary, not sufficient, for accessibility.

**Example:** `form.ts` builds a signup form with a properly associated
`<label>`; `example.test.ts` runs axe-core against it and asserts zero
violations. The scan is scoped to `runOnly: ['label', 'aria-valid-attr',
'image-alt']` — component-level rules — because full-page rules like
`region` (page content must sit inside a landmark) don't make sense
against an isolated fragment; run the full rule set when scanning a whole
page instead.

## References

- [axe-core docs](https://github.com/dequelabs/axe-core)
- [WCAG 2.2 quick reference](https://www.w3.org/WAI/WCAG22/quickref/)
- [Deque University: axe rules](https://dequeuniversity.com/rules/axe/)
