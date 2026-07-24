# Property-Based Tests

Instead of asserting on specific example inputs, state an invariant that
must hold for *any* valid input, and let the framework generate hundreds of
random cases (including edge cases like empty arrays and negative numbers)
to try to break it.

**When to use it:** for logic with a general mathematical or structural
property — sorting, parsing/serializing round-trips, idempotent operations —
where enumerating examples by hand would miss edge cases.

**Example:** `example.ts`'s `sortAscending` is checked against three
properties (`example.test.ts`): output length is preserved, output is
actually sorted, and sorting twice is the same as sorting once.

## References

- [fast-check docs](https://fast-check.dev/)
- [Hypothesis (Python): a similar tool, with a good conceptual intro](https://hypothesis.readthedocs.io/en/latest/)
- [John Hughes: QuickCheck, the original property-based tester](https://www.cs.tufts.edu/~nr/cs257/archive/john-hughes/quick.pdf)
