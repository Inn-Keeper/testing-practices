# Soak / Endurance Tests

Run a system under sustained, moderate load for a long time — hours or
days, not seconds — to catch problems that only appear gradually: memory
leaks, connection pool exhaustion, log/disk growth, clock drift.

**When to use it:** before a long-lived deployment goes live, especially
for anything that holds open connections or accumulates state over time.

**Example:** `example.ts` reuses the same server and `autocannon` setup as
[Load Tests](../load-tests/README.md); the only real difference from a
production soak test is duration (seconds here vs. hours/days for real).

**Run it:** `pnpm run soaktest`.

## References

- [autocannon docs](https://github.com/mcollina/autocannon)
- [Wikipedia: Soak testing](https://en.wikipedia.org/wiki/Soak_testing)
