# Smoke Tests

A minimal "did the build basically work" check — run before investing time
in the full suite, to fail fast on a fundamentally broken build.

**When to use it:** as the first, fastest gate in CI, or right after a
deploy, before running the full regression suite.

**Example:** reuses the server from [System Tests](../system-tests/README.md)
and checks only that it starts and answers `/health` — a subset, not a
new implementation.

## References

- [ISTQB Glossary: Smoke Testing](https://glossary.istqb.org/en_US/term/smoke-test-2)
- [Atlassian: Smoke testing](https://www.atlassian.com/continuous-delivery/software-testing/smoke-testing)
