# Interactive Playground

A static, browser-runnable demo that reuses a real, already-tested function
(`escapeHtml` from [Security Tests](../security-tests/README.md)) live: type
any string, including an XSS payload, and the page runs the exact assertion
the automated test suite runs — `escapeHtml(input)` contains no bare `<` or
`>` — against arbitrary, adversarial input a human chooses on the spot. A
small [Kaplay](https://kaplayjs.com/) character reacts to the outcome. It
always passes, because `escapeHtml` is correct — that's the point: this
proves the guarantee holds under arbitrary input, in the spirit of
[Property-Based Tests](../property-based-tests/README.md) and
[Fuzz Testing](../fuzz-testing/README.md), rather than just for the fixed
payload list the unit test happens to check.

**When to use it:** as a teaching/demo aid for a security property that's
easy to state but easy to doubt — "does this actually hold for *any*
input?" — letting someone try to break it themselves instead of reading a
test file.

**Example:** `playground.ts` imports `escapeHtml` unmodified from
`../security-tests/example.ts`, wires it to a text input and "Run test"
button in `playground.html`, and asserts `!/[<>]/.test(escapeHtml(input))`
— the same check `security-tests/example.test.ts` makes with
`.not.toMatch(/[<>]/)` — against whatever the user typed.

**Run it:** open `playground.html` directly in a browser (it's a static
file, no server needed). The bundled script is built locally via
`pnpm run build:playground` (esbuild) and committed to
`dist/playground.bundle.js`, since this repo's `vercel.json` disables any
build step and serves everything as-is.

<!-- ponytail: this is the only topic that needs a bundler/build step, so
committing the built bundle by hand was the simplest option for one page.
If more playground-style pages get added later, it'd be worth wiring up a
real Vercel `buildCommand` (e.g. `pnpm run build:playground`) instead of
committing bundles manually each time. -->

## References

- [KAPLAY.js docs](https://kaplayjs.com/docs/)
- [esbuild docs](https://esbuild.github.io/)
- [OWASP: Cross-Site Scripting (XSS) Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
