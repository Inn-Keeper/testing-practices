# Unit Tests

Test a single function or class in isolation, with no real dependencies
(database, network, filesystem). Fast, deterministic, and the base of the
testing pyramid.

**When to use it:** for any unit of logic with a clear input/output
contract — the default first test to write for new code.

**Example:** `example.ts` is a tiered discount calculator; `example.test.ts`
covers each tier boundary and an invalid-input case.

## References

- [Vitest: Getting Started](https://vitest.dev/guide/)
- [Martin Fowler: UnitTest](https://martinfowler.com/bliki/UnitTest.html)
- [Kent C. Dodds: Write tests, not too many, mostly integration](https://kentcdodds.com/blog/write-tests)
