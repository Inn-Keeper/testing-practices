# Compatibility Tests

Verify the same functionality works across different browsers, devices, or
operating systems — anything that behaves subtly differently despite
looking like "the same web platform."

**When to use it:** for any feature that leans on a platform API with a
history of inconsistent support (here, the native `<dialog>` element) —
run it for real in each target browser engine instead of assuming parity.

**Example:** `fixture.html` uses the native `<dialog>` element;
`example.spec.ts` runs the same scenario against Chromium, Firefox, and
WebKit via Playwright's `projects` config (`playwright.config.ts`, shared
with [E2E Tests](../e2e-tests/README.md), which now also runs cross-browser
for free).

**Run it:** `pnpm exec playwright test topics/compatibility-tests`.

## References

- [Playwright: Projects](https://playwright.dev/docs/test-projects)
- [Can I use: <dialog>](https://caniuse.com/dialog)
- [BrowserStack (a common commercial cross-browser/device testing service)](https://www.browserstack.com/)
