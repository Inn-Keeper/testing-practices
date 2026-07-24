# Performance Tests

Measure how fast code runs — not just whether it's correct — usually by
comparing implementations or tracking a number over time.

**When to use it:** when choosing between implementations with a real
throughput/latency difference, or to catch a performance regression before
it ships.

**Example:** `example.ts` has two ways to check membership in a 10,000-item
collection; `example.bench.ts` benchmarks them with Vitest's built-in
`bench`. At this size the two are close enough that the result can flip
between runs — a reminder to read benchmark output (ops/sec, percentiles)
rather than trust a single run, and to benchmark at the actual scale that
matters for your case (the gap widens sharply as the collection grows).

**Run it:** `pnpm run bench topics/performance-tests` (a separate mode from
`pnpm test` — benchmarks aren't pass/fail).

## References

- [Vitest: Benchmarking](https://vitest.dev/guide/features.html#benchmarking)
- [MDN: Big O notation and complexity (why Set wins at scale)](https://developer.mozilla.org/en-US/docs/Glossary/Big_O_notation)
