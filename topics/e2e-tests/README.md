# End-to-End (E2E) Tests

Drive the real UI the way a user would — typing, clicking, reading what's
on screen — through an actual browser engine.

**When to use it:** for the critical user flows that must work end to end
(checkout, login, the primary action of your app). Slower and more brittle
than lower-level tests, so used sparingly.

**Example:** `fixture.html` is a tiny standalone page; `example.spec.ts`
drives it with Playwright.

**Run it:** `pnpm exec playwright test topics/e2e-tests` (not part of
`pnpm test` — Playwright is a separate runner, kept out of Vitest's glob by
using the `.spec.ts` extension).

## References

- [Playwright docs](https://playwright.dev/docs/intro)
- [Martin Fowler: Practical Test Pyramid](https://martinfowler.com/articles/practical-test-pyramid.html)
