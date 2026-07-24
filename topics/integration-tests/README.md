# Integration Tests

Verify that two or more real units — modules, classes, services — work
correctly together, as opposed to a unit test's isolated single piece.

**When to use it:** whenever behavior only emerges from collaboration
(a service that depends on a repository, a client that depends on a parser).

**Example:** `userService.ts` depends on `userRepository.ts`;
`example.test.ts` exercises them together instead of mocking the repository.

## References

- [Martin Fowler: IntegrationTest](https://martinfowler.com/bliki/IntegrationTest.html)
- [Kent C. Dodds: The Testing Trophy](https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications)
