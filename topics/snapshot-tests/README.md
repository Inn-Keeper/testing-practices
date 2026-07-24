# Snapshot Tests

Capture a piece of output once, commit it as the expected baseline, and
have every future test run diff against it. A change in output fails the
test until a human reviews the diff and explicitly updates the snapshot.

**When to use it:** for output that's tedious to assert on field-by-field
(serialized objects, rendered markup, formatted text) but where you still
want to catch unintended changes.

**Example:** `example.ts` renders an invoice summary string;
`example.test.ts` snapshots it. The baseline lives in
`__snapshots__/example.test.ts.snap`, committed alongside the test.

**Updating a snapshot on purpose:** `pnpm exec vitest run topics/snapshot-tests -u`

## References

- [Vitest: Snapshot Testing](https://vitest.dev/guide/snapshot.html)
- [Jest: Snapshot Testing (the pattern Vitest's API is compatible with)](https://jestjs.io/docs/snapshot-testing)
