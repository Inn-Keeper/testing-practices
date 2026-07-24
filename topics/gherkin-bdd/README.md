# Gherkin / BDD Tests

Write scenarios in plain-language Given/When/Then steps that both
non-engineers and code can read, then wire each step to real code through
step definitions. The feature file is the spec; the step definitions make
it executable.

**When to use it:** when acceptance criteria need to be readable and
agreed on by non-engineers (product, QA, stakeholders) before — or instead
of — being expressed as a normal test.

**Example:** `features/greeting.feature` describes two scenarios in
Gherkin; `steps.steps.ts` implements the Given/When/Then steps against
`greet.ts`.

**Run it:** `pnpm run test:cucumber` (a separate runner from Vitest —
Cucumber owns `.feature` and `.steps.ts` files, which don't match Vitest's
or Playwright's globs).

## References

- [Cucumber.js docs](https://github.com/cucumber/cucumber-js)
- [Cucumber: Gherkin Reference](https://cucumber.io/docs/gherkin/reference/)
- [Martin Fowler: GivenWhenThen](https://martinfowler.com/bliki/GivenWhenThen.html)
