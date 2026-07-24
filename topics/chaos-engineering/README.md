# Chaos Engineering

Deliberately inject failure into a system to verify it degrades gracefully,
instead of hoping it does. Production chaos engineering (Chaos Monkey,
Gremlin) kills real infrastructure; this example shrinks the same idea down
to a single function call that fails on command.

**When to use it:** anywhere resilience (retries, circuit breakers,
fallbacks) is supposed to exist — this is how you prove it actually works,
rather than assuming the happy path is the only path.

**Example:** `example.ts`'s `fetchWithRetry` is tested (`example.test.ts`)
against an operation that's wrapped to fail a controlled number of times
before succeeding — deterministic fault injection, not real randomness.

## References

- [Principles of Chaos Engineering](https://principlesofchaos.org/)
- [Netflix: Chaos Monkey](https://netflix.github.io/chaosmonkey/)
- [Gremlin: Chaos Engineering docs](https://www.gremlin.com/docs)
