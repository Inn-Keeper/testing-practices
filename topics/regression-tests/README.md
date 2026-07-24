# Regression Tests

A test pinned to a specific bug that was previously fixed, so the exact
failure can never silently come back.

**When to use it:** every time you fix a bug — write the test that would
have caught it, before or as part of the fix, and keep it in the suite
permanently.

**Example:** `example.ts`'s `formatCurrency` once dropped the minus sign
for negative amounts; `example.test.ts` locks that case in.

## References

- [ISTQB Glossary: Regression Testing](https://glossary.istqb.org/en_US/term/regression-testing-1)
- [Martin Fowler: Test Coverage](https://martinfowler.com/bliki/TestCoverage.html)
