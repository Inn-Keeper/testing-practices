# Visual Regression

Compare a screenshot of the rendered UI against a saved baseline
pixel-for-pixel, and fail if they diverge beyond a threshold — catches
unintended visual changes (a broken layout, a missing style) that
functional assertions like "the button exists" can't see.

**When to use it:** for UI that's visually load-bearing and easy to break
silently with a CSS change — a design system component, a checkout page,
anything where "it rendered" isn't the same as "it looks right."

**Example:** `fixture.html` is a static pricing card; `example.spec.ts`
uses Playwright's `toHaveScreenshot()` against a baseline committed at
`example.spec.ts-snapshots/`.

**Run it:** `pnpm exec playwright test topics/visual-regression`. To
intentionally update the baseline after a real visual change:
`pnpm exec playwright test topics/visual-regression --update-snapshots`.

Baselines are rendered per-OS (font rendering/anti-aliasing differ across
platforms) — regenerate them on whichever machine is the source of truth
for this repo if a run fails only due to environment, not an actual
regression.

## References

- [Playwright: Visual comparisons](https://playwright.dev/docs/test-snapshots)
- [Percy / Chromatic (common hosted visual-regression services)](https://www.chromatic.com/)
