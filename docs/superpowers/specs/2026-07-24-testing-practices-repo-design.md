# Design: Software Testing Practices Reference Repo

Date: 2026-07-24

## Purpose

A learning repo covering the most important software testing practices in
modern development, where AI tools generate a large share of the code. For
each practice: a short reference write-up with links to authoritative
sources, and — where a code example is meaningful — a small, runnable
TypeScript example.

This repo absorbs and replaces `software-testing-summary.html`, which is
retired once its content is redistributed into topic folders and the
metrics table below.

## Architecture

Single git repo, single npm package. No monorepo tooling — one `package.json`
at the root is enough for a set of small, independent examples.

- **Test runner:** Vitest + TypeScript (strict mode). `vitest.config.ts`
  discovers tests under `topics/**/*.test.ts`. `npm test` runs everything
  that has a runnable example.
- **Layout:** `topics/<kebab-case-name>/`, one folder per practice:
  - `README.md` — definition, when to use it, 2–4 links to authoritative
    references (official docs, the relevant tool's site, or a canonical
    article).
  - `example.ts` + `example.test.ts` — present only for topics where a code
    example is meaningful (see table below). Process/methodology/procedure
    topics get README.md only.
- **Root `README.md`** — table of contents linking every topic, plus a
  **Quality Metrics** reference table (Test Coverage, Mutation Score, Defect
  Density, Defect Escape Rate, MTTR/MTBF, Flakiness Rate, Test Execution
  Time, Cyclomatic Complexity, Code Churn, DORA Metrics). Metrics aren't
  testing *approaches*, so they stay a table, not folders.

## Topics

### Test Levels by Scope (all get code examples)

| Topic | Example approach | New dependency |
|---|---|---|
| Unit Tests | pure function (discount calculation) | none |
| Integration Tests | service class + in-memory repository | none |
| Component Tests | DOM component rendered and queried | `@testing-library/dom`, `jsdom` |
| Contract Tests | zod schema as a consumer/producer contract | `zod` |
| E2E Tests | Playwright driving a tiny static page | `@playwright/test` |
| System Tests | Node `http` server, multiple subsystems together | none (`node:http`) |
| Smoke Tests | health-check request against the same server | none |
| Regression Tests | test pinned to a previously-fixed bug | none |
| Acceptance Tests / UAT | — | reference-only |

### BDD & Specification Styles

| Topic | Example approach | New dependency |
|---|---|---|
| Gherkin/BDD Tests | feature file + step definitions | `@cucumber/cucumber` |
| Property-Based Tests | invariant checked over generated inputs | `fast-check` |
| Snapshot Tests | Vitest's built-in `toMatchSnapshot` | none |
| Approval/Golden-Master Tests | output compared against a fixture file | none |

### Non-Functional Testing

| Topic | Example approach | New dependency |
|---|---|---|
| Performance Tests | Vitest's built-in `bench` | none |
| Load Tests | script hitting the repo's own server | `autocannon` |
| Stress Tests | same tool pushed past capacity | reuses autocannon |
| Soak/Endurance Tests | short illustrative run + note on real-world duration | reuses autocannon |
| Security Tests | injection-payload unit test (XSS/SQLi strings) | none; SAST/DAST tools are reference links only |
| Accessibility Tests | axe-core scan of rendered DOM | `axe-core` |
| Usability Tests | — | reference-only |
| Compatibility Tests | Playwright run across configured browsers | reuses Playwright |
| Localization/i18n Tests | native `Intl` formatting + locale-key parity check | none |
| Chaos Engineering | fault-injection wrapper unit test | none; production chaos tools are reference links |

### Test Quality & Robustness Techniques

| Topic | Example approach | New dependency |
|---|---|---|
| Mutation Testing | Stryker run against the Unit Tests topic | `@stryker-mutator/core` + vitest runner |
| Fuzz Testing | fast-check in unstructured/arbitrary mode | reuses fast-check |
| Flaky Test Detection | intermittent test + Vitest `--retry` | none |
| Visual Regression Testing | Playwright `toHaveScreenshot` | reuses Playwright |

### Approaches & Methodologies (reference-only)

TDD, BDD (as a process), ATDD, Exploratory Testing, Risk-Based Testing,
Shift-Left Testing. These describe *how* you approach testing, not a
distinct technique with its own code — README.md only.

### QA Procedures & Processes (reference-only)

Test Planning, Test Case Design, Code Review / Peer Review, Static Analysis
& Linting, Defect Triage, Release/Regression Checklists, Traceability
Matrix, Canary Releases & Feature Flags, Post-Incident Reviews.
README.md only.

## Dependencies

New devDependencies beyond `vitest` + `typescript`, each tied to a topic
that names the tool explicitly:

`@testing-library/dom`, `jsdom`, `zod`, `@playwright/test`,
`@cucumber/cucumber`, `fast-check`, `autocannon`, `axe-core`,
`@stryker-mutator/core` (+ vitest runner).

## Testing / verification

- `npm test` (Vitest) must pass for every topic that has an `example.test.ts`
  — this is the repo's own regression suite and the way a reader confirms
  each example still works.
- Topics with their own runner (Cucumber, Playwright, Stryker) get a
  documented command in their README (e.g. `npx cucumber-js`,
  `npx playwright test`, `npx stryker run`) since they don't run under plain
  `vitest`.
- No CI pipeline is being set up as part of this design — out of scope
  unless requested later.

## Out of scope

- AI-specific testing techniques (evals, LLM-output verification, AI code
  review workflows) — explicitly excluded; the AI-generated-code framing is
  motivation only, content stays general-purpose testing fundamentals.
- CI/CD wiring, linting/formatting config for the repo's own source.
- Any production-grade setup (Pact broker, real load-test infrastructure,
  cross-browser device farms) — examples are illustrative, not
  production tooling; each README links to the real-world tool.
