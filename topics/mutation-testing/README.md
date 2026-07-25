# Mutation Testing

Deliberately corrupt the code under test (flip a `<` to `<=`, negate a
condition, change a constant) and re-run the test suite against each
mutant. A mutant that still passes means the tests didn't actually exercise
that logic — passing tests and *thorough* tests are not the same thing,
and code coverage alone can't tell them apart.

**When to use it:** when test coverage numbers look good but you don't
trust them — mutation testing catches tests that execute a line without
actually asserting anything meaningful about it.

**Example:** `example.ts`'s `clamp` is deliberately boundary-heavy;
`example.test.ts` covers each boundary explicitly. Running Stryker against
it produces a 77.78% mutation score, not 100% — and that's the interesting
part. Two mutants survive:

```
if (value < min) return min     →   if (value <= min) return min
if (value > max) return max     →   if (value >= max) return max
```

At the exact boundary (`value === min`), both the original and the mutated
version return the same thing (`min`), just by a different path — one
branch returns it early, the other falls through to `return value`, which
equals `min` anyway. No black-box assertion on `clamp`'s return value can
tell these two versions apart at that input. These are **equivalent
mutants**: syntactically different code with no observable behavioral
difference, a well-known limitation of mutation testing tooling (it can't
generally prove equivalence, only report survival) — not a gap in the test
suite to chase with more tests.

**Run it:** `pnpm run mutationtest` (Stryker, `stryker.conf.json`) — much
slower than `pnpm test` since it reruns the suite once per mutant, so it's
a separate command, not part of the default test run.

## References

- [Stryker Mutator docs](https://stryker-mutator.io/docs/)
- [Stryker: Equivalent mutants](https://stryker-mutator.io/docs/mutation-testing-elements/equivalent-mutants/)
- [Martin Fowler: On the Diminishing Returns of Test Coverage](https://martinfowler.com/bliki/TestCoverage.html)
