# BDD & Specification Styles Topics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build out the "BDD & Specification Styles" category (4 topics: Property-Based Tests, Snapshot Tests, Approval/Golden-Master Tests, Gherkin/BDD Tests) as self-contained `topics/<name>/` folders, following the pattern established by the Test Levels plan.

**Architecture:** Same repo, same conventions as `docs/superpowers/plans/2026-07-24-scaffold-and-test-levels.md`. Property-Based, Snapshot, and Approval/Golden-Master run under Vitest (`example.test.ts`). Gherkin/BDD uses Cucumber, which needs its own TypeScript loader — kept out of both the Vitest and Playwright globs by using `.feature` / `.steps.ts` files, neither of which matches `*.test.ts` or `*.spec.ts`.

**Tech Stack:** fast-check (property-based + reused for fuzz testing later), @cucumber/cucumber, tsx (ESM TypeScript loader Cucumber needs — it doesn't transpile TS itself).

This is the second of several plans covering
`docs/superpowers/specs/2026-07-24-testing-practices-repo-design.md`. Non-Functional, Quality Techniques, and Methodologies/QA Procedures remain.

## Global Constraints

- Same conventions as the previous plan: pnpm, TypeScript strict mode, Vitest test files as `example.test.ts` imported with no extension.
- New file-extension convention for this plan: Cucumber step definitions are `*.steps.ts`, feature files are `*.feature` — neither matches Vitest's `topics/**/*.test.ts` glob or Playwright's `**/*.spec.ts` glob, so no config changes are needed to keep runners from colliding.
- Every topic's `README.md` includes: one-paragraph definition, "When to use it", 2–4 links to authoritative references, and (for topics with their own runner) the exact command to run it.
- Root `README.md` gets each topic added under `### BDD & Specification Styles` as its task lands.

---

### Task 1: Property-Based Tests topic

**Files:**
- Create: `topics/property-based-tests/example.ts`
- Create: `topics/property-based-tests/example.test.ts`
- Create: `topics/property-based-tests/README.md`
- Modify: `package.json` (add `fast-check` devDependency)
- Modify: `README.md`

**Interfaces:**
- Produces: `sortAscending(numbers: number[]): number[]`.
- New dependency: `fast-check` — the standard TypeScript property-based testing library (the TS equivalent of QuickCheck/Hypothesis named in the spec), integrates directly with Vitest's `it`/`describe`.

- [ ] **Step 1: Add the dependency**

Run: `pnpm add -D fast-check`
Expected: added to `package.json` devDependencies and installed.

- [ ] **Step 2: Write the failing test**

`topics/property-based-tests/example.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import fc from 'fast-check'
import { sortAscending } from './example'

describe('sortAscending', () => {
  it('always returns an array of the same length as the input', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), (numbers) => {
        expect(sortAscending(numbers)).toHaveLength(numbers.length)
      }),
    )
  })

  it('always returns a sorted array', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), (numbers) => {
        const sorted = sortAscending(numbers)
        for (let i = 1; i < sorted.length; i++) {
          expect(sorted[i]).toBeGreaterThanOrEqual(sorted[i - 1])
        }
      }),
    )
  })

  it('is idempotent: sorting an already-sorted array changes nothing', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), (numbers) => {
        const once = sortAscending(numbers)
        const twice = sortAscending(once)
        expect(twice).toEqual(once)
      }),
    )
  })
})
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `pnpm test topics/property-based-tests`
Expected: FAIL — `Cannot find module './example'`.

- [ ] **Step 4: Write the implementation**

`topics/property-based-tests/example.ts`:

```ts
export function sortAscending(numbers: number[]): number[] {
  return [...numbers].sort((a, b) => a - b)
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `pnpm test topics/property-based-tests`
Expected: PASS — 3 tests passing (each running 100 generated cases by default).

- [ ] **Step 6: Write the README**

`topics/property-based-tests/README.md`:

```markdown
# Property-Based Tests

Instead of asserting on specific example inputs, state an invariant that
must hold for *any* valid input, and let the framework generate hundreds of
random cases (including edge cases like empty arrays and negative numbers)
to try to break it.

**When to use it:** for logic with a general mathematical or structural
property — sorting, parsing/serializing round-trips, idempotent operations —
where enumerating examples by hand would miss edge cases.

**Example:** `example.ts`'s `sortAscending` is checked against three
properties (`example.test.ts`): output length is preserved, output is
actually sorted, and sorting twice is the same as sorting once.

## References

- [fast-check docs](https://fast-check.dev/)
- [Hypothesis (Python): a similar tool, with a good conceptual intro](https://hypothesis.readthedocs.io/en/latest/)
- [John Hughes: QuickCheck, the original property-based tester](https://www.cs.tufts.edu/~nr/cs257/archive/john-hughes/quick.pdf)
```

- [ ] **Step 7: Add the topic to the root README**

In `README.md`, under `### BDD & Specification Styles`, add:

```markdown
- [Property-Based Tests](topics/property-based-tests/README.md)
```

- [ ] **Step 8: Commit**

```bash
git add topics/property-based-tests package.json pnpm-lock.yaml README.md
git commit -m "Add Property-Based Tests topic"
```

---

### Task 2: Snapshot Tests topic

**Files:**
- Create: `topics/snapshot-tests/example.ts`
- Create: `topics/snapshot-tests/example.test.ts`
- Create: `topics/snapshot-tests/README.md`
- Modify: `README.md`

**Interfaces:**
- Produces: `renderInvoiceSummary(invoice: Invoice): string`.

Snapshot tests don't have a "red" state in the usual TDD sense: the first
run has no baseline to compare against, so Vitest *writes* the snapshot and
reports the test as passing. The steps below reflect that — there's no
"verify it fails" step here.

- [ ] **Step 1: Write the implementation**

`topics/snapshot-tests/example.ts`:

```ts
export interface Invoice {
  id: string
  items: { name: string; price: number }[]
}

export function renderInvoiceSummary(invoice: Invoice): string {
  const total = invoice.items.reduce((sum, item) => sum + item.price, 0)
  const lines = invoice.items.map((item) => `  ${item.name}: $${item.price.toFixed(2)}`)
  return [`Invoice ${invoice.id}`, ...lines, `Total: $${total.toFixed(2)}`].join('\n')
}
```

- [ ] **Step 2: Write the test**

`topics/snapshot-tests/example.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { renderInvoiceSummary } from './example'

describe('renderInvoiceSummary', () => {
  it('renders a stable, human-readable summary', () => {
    const summary = renderInvoiceSummary({
      id: 'INV-1',
      items: [
        { name: 'Widget', price: 9.99 },
        { name: 'Gadget', price: 19.99 },
      ],
    })

    expect(summary).toMatchSnapshot()
  })
})
```

- [ ] **Step 3: Run the test to create the baseline snapshot**

Run: `pnpm test topics/snapshot-tests`
Expected: PASS — output includes "1 written" (Vitest creates
`topics/snapshot-tests/__snapshots__/example.test.ts.snap`).

- [ ] **Step 4: Run it again to confirm it now compares, not just writes**

Run: `pnpm test topics/snapshot-tests`
Expected: PASS — this time matching the committed snapshot rather than
writing a new one.

- [ ] **Step 5: Write the README**

`topics/snapshot-tests/README.md`:

```markdown
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
```

- [ ] **Step 6: Add the topic to the root README**

In `README.md`, under `### BDD & Specification Styles`, add:

```markdown
- [Snapshot Tests](topics/snapshot-tests/README.md)
```

- [ ] **Step 7: Commit**

```bash
git add topics/snapshot-tests README.md
git commit -m "Add Snapshot Tests topic"
```

---

### Task 3: Approval/Golden-Master Tests topic

**Files:**
- Create: `topics/approval-tests/example.ts`
- Create: `topics/approval-tests/approved/example.approved.txt`
- Create: `topics/approval-tests/example.test.ts`
- Create: `topics/approval-tests/README.md`
- Modify: `README.md`

**Interfaces:**
- Produces: `generateReport(rows: { region: string; sales: number }[]): string`.
- Distinction from Snapshot Tests: the baseline here is a plain text file a
  human reads and approves directly (the "golden master"), not a
  framework-managed `.snap` file — the classic technique for characterizing
  legacy code with no spec.

- [ ] **Step 1: Write the implementation**

`topics/approval-tests/example.ts`:

```ts
export function generateReport(rows: { region: string; sales: number }[]): string {
  const header = 'Region | Sales'
  const divider = '-------|------'
  const lines = rows.map((r) => `${r.region} | ${r.sales}`)
  return [header, divider, ...lines].join('\n')
}
```

- [ ] **Step 2: Generate the approved baseline by actually running the function**

Run: `node -e "const rows=[{region:'North',sales:120},{region:'South',sales:95}]; const header='Region | Sales'; const divider='-------|------'; const lines=rows.map(r=>\`\${r.region} | \${r.sales}\`); console.log([header,divider,...lines].join('\n'))"`
Expected output (this exact text becomes the approved file's content):

```
Region | Sales
-------|------
North | 120
South | 95
```

- [ ] **Step 3: Write the approved baseline file**

`topics/approval-tests/approved/example.approved.txt`:

```
Region | Sales
-------|------
North | 120
South | 95
```

- [ ] **Step 4: Write the test**

`topics/approval-tests/example.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { generateReport } from './example'

const approvedPath = fileURLToPath(new URL('./approved/example.approved.txt', import.meta.url))

describe('generateReport', () => {
  it('matches the human-approved golden master', () => {
    const actual = generateReport([
      { region: 'North', sales: 120 },
      { region: 'South', sales: 95 },
    ])
    const approved = readFileSync(approvedPath, 'utf-8')

    expect(actual.trim()).toBe(approved.trim())
  })
})
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `pnpm test topics/approval-tests`
Expected: PASS — 1 test passing. (`.trim()` on both sides absorbs any
trailing-newline difference between the generated string and the text
file, which is the normal source of a false failure here.)

- [ ] **Step 6: Write the README**

`topics/approval-tests/README.md`:

```markdown
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
```

- [ ] **Step 7: Add the topic to the root README**

In `README.md`, under `### BDD & Specification Styles`, add:

```markdown
- [Approval/Golden-Master Tests](topics/approval-tests/README.md)
```

- [ ] **Step 8: Commit**

```bash
git add topics/approval-tests README.md
git commit -m "Add Approval/Golden-Master Tests topic"
```

---

### Task 4: Gherkin/BDD Tests topic

**Files:**
- Create: `topics/gherkin-bdd/features/greeting.feature`
- Create: `topics/gherkin-bdd/greet.ts`
- Create: `topics/gherkin-bdd/steps.steps.ts`
- Create: `topics/gherkin-bdd/README.md`
- Modify: `package.json` (add `@cucumber/cucumber`, `tsx` devDependencies; add a `test:cucumber` script)
- Modify: `README.md`

**Interfaces:**
- Produces: `greet(name: string | undefined): string`.
- New dependencies: `@cucumber/cucumber` — the reference implementation for
  Gherkin/BDD in JS/TS, named in the spec. `tsx` — Cucumber doesn't
  transpile TypeScript itself; `tsx` provides the Node ESM loader hook
  (`--import tsx`) that lets Cucumber import `.steps.ts` files directly.

- [ ] **Step 1: Add the dependencies**

Run: `pnpm add -D @cucumber/cucumber tsx`
Expected: both added to `package.json` devDependencies and installed.

- [ ] **Step 2: Add the run script**

In `package.json`, under `"scripts"`, add:

```json
"test:cucumber": "NODE_OPTIONS=\"--import tsx\" cucumber-js --import 'topics/gherkin-bdd/**/*.steps.ts' 'topics/gherkin-bdd/features/**/*.feature'"
```

- [ ] **Step 3: Write the feature file**

`topics/gherkin-bdd/features/greeting.feature`:

```gherkin
Feature: Greeting a user
  As a visitor
  I want to be greeted by name
  So that the app feels personal

  Scenario: Greeting with a name
    Given a visitor named "Ada"
    When they request a greeting
    Then the greeting should be "Hello, Ada!"

  Scenario: Greeting an anonymous visitor
    Given a visitor with no name
    When they request a greeting
    Then the greeting should be "Hello, stranger!"
```

- [ ] **Step 4: Write the step definitions (they'll fail — no implementation yet)**

`topics/gherkin-bdd/steps.steps.ts`:

```ts
import { Given, When, Then } from '@cucumber/cucumber'
import assert from 'node:assert/strict'
import { greet } from './greet'

let visitorName: string | undefined
let greeting: string

Given('a visitor named {string}', function (name: string) {
  visitorName = name
})

Given('a visitor with no name', function () {
  visitorName = undefined
})

When('they request a greeting', function () {
  greeting = greet(visitorName)
})

Then('the greeting should be {string}', function (expected: string) {
  assert.equal(greeting, expected)
})
```

- [ ] **Step 5: Run to verify it fails**

Run: `pnpm run test:cucumber`
Expected: FAIL — Cucumber reports the scenarios as failing (or erroring)
because `./greet` doesn't exist yet.

- [ ] **Step 6: Write the implementation**

`topics/gherkin-bdd/greet.ts`:

```ts
export function greet(name: string | undefined): string {
  return `Hello, ${name || 'stranger'}!`
}
```

- [ ] **Step 7: Run to verify it passes**

Run: `pnpm run test:cucumber`
Expected: PASS — "2 scenarios (2 passed)", "8 steps (8 passed)".

- [ ] **Step 8: Write the README**

`topics/gherkin-bdd/README.md`:

```markdown
# Gherkin / BDD Tests

Write scenarios in plain-language Given/When/Then steps that both
non-engineers and code can read, then wire each step to real code through
step definitions. The feature file is the spec; the step definitions make
it executable.

**When to use it:** when acceptance criteria need to be readable and
agreed on by non-engineers (product, QA, stakeholders) before — or instead
of — being expressed as a normal test.

**Example:** `features/greeting.feature` describes two scenarios in
Gherkin; `steps.steps.ts` implements the Given/When/Then steps against
`greet.ts`.

**Run it:** `pnpm run test:cucumber` (a separate runner from Vitest —
Cucumber owns `.feature` and `.steps.ts` files, which don't match Vitest's
or Playwright's globs).

## References

- [Cucumber.js docs](https://github.com/cucumber/cucumber-js)
- [Cucumber: Gherkin Reference](https://cucumber.io/docs/gherkin/reference/)
- [Martin Fowler: GivenWhenThen](https://martinfowler.com/bliki/GivenWhenThen.html)
```

- [ ] **Step 9: Add the topic to the root README**

In `README.md`, under `### BDD & Specification Styles`, add:

```markdown
- [Gherkin/BDD Tests](topics/gherkin-bdd/README.md)
```

- [ ] **Step 10: Commit**

```bash
git add topics/gherkin-bdd package.json pnpm-lock.yaml README.md
git commit -m "Add Gherkin/BDD Tests topic"
```

---

## End-of-plan verification

- [ ] Run `pnpm test` — expected: all Vitest topics still pass, including the two new ones (Property-Based, Snapshot) plus Approval/Golden-Master (9 test files total across the repo so far).
- [ ] Run `pnpm run test:cucumber` — expected: 2 scenarios passing.
- [ ] Run `pnpm exec tsc --noEmit` — expected: no type errors.
- [ ] Confirm `README.md`'s "BDD & Specification Styles" section lists all 4 topics.
