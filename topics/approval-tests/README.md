# Approval / Golden-Master Tests

Run existing (often legacy, unspecified) code once, have a human review and
approve the output, and commit that output as the "golden master." Future
runs fail if the output changes, until a human re-approves the new output.

**When to use it:** characterizing legacy code with no tests and no clear
spec, before refactoring it — the golden master proves the refactor didn't
change behavior.

**Example:** `example.ts`'s `generateReport` output for a fixed input is
committed as `approved/example.approved.txt`; `example.test.ts` compares
against it directly (no snapshot framework, just a text file — the
distinguishing trait of this technique vs. [Snapshot Tests](../snapshot-tests/README.md)).

## References

- [ApprovalTests.com: the technique, explained](https://approvaltests.com/)
- [Michael Feathers: Working Effectively with Legacy Code (originates this pattern)](https://www.oreilly.com/library/view/working-effectively-with/0131177052/)
