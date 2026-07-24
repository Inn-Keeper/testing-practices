# System Tests

Test the whole application as one running system — multiple internal
subsystems (routing, storage) exercised together through its real interface
— but still within a single process, not a full production-like
deployment.

**When to use it:** to check that internal subsystems are wired together
correctly, above integration-test scope but below a full E2E/UAT
environment.

**Example:** `server.ts` is a small in-process HTTP server with a couple of
routes and an in-memory store; `example.test.ts` exercises create-then-read
across the whole thing.

## References

- [ISTQB Glossary: System Testing](https://glossary.istqb.org/en_US/term/system-testing)
- [Martin Fowler: Practical Test Pyramid](https://martinfowler.com/articles/practical-test-pyramid.html)
