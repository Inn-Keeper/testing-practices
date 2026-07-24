# Stress Tests

Push a system past its expected capacity on purpose, to find where and how
it breaks — unlike [Load Tests](../load-tests/README.md), the point isn't a
clean pass, it's learning the failure mode (slow degradation? hard errors?
crash?).

**When to use it:** to find capacity limits before an unexpected traffic
spike does, and to confirm the system fails safely (returns errors) rather
than catastrophically (crashes, corrupts data).

**Example:** `example.ts` reuses the same server and `autocannon` setup as
[Load Tests](../load-tests/README.md), just with far more concurrent
connections (500 vs. 10) — enough to visibly raise latency even against a
trivial in-process server.

**Run it:** `pnpm run stresstest`. Like Load Tests, this prints numbers for
a human to interpret.

## References

- [autocannon docs](https://github.com/mcollina/autocannon)
- [Google SRE Book: Load and capacity planning](https://sre.google/sre-book/embracing-risk/)
