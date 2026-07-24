# Contract Tests

Verify that a producer's response and a consumer's expectations agree on a
shared shape — catching breaking API changes without running the full
integrated system.

**When to use it:** any time a service boundary is owned by different teams
or deployed independently (a backend API and its frontend, or two
microservices).

**Example:** `contract.ts` defines the agreed shape as a zod schema;
`example.test.ts` checks a real producer payload against it, and shows a
broken payload failing.

## References

- [Pact: Contract testing](https://docs.pact.io/)
- [Martin Fowler: Consumer-Driven Contracts](https://martinfowler.com/articles/consumerDrivenContracts.html)
- [Zod docs](https://zod.dev/)
