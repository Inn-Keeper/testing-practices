# Non-Functional Testing Topics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build out the "Non-Functional Testing" category (10 topics: Performance, Load, Stress, Soak/Endurance, Security, Accessibility, Usability, Compatibility, Localization/i18n, Chaos Engineering) as self-contained `topics/<name>/` folders.

**Architecture:** Same repo, same conventions as the previous two plans. Performance uses Vitest's built-in `bench` (files named `*.bench.ts`, run via `vitest bench`, no new dependency). Load/Stress/Soak share one new dependency (`autocannon`) and are run as standalone scripts via `tsx` — not part of `pnpm test`, since throughput numbers aren't a deterministic pass/fail signal, only a human-reviewed result (documented explicitly in each README). Security, Localization, and Chaos Engineering are plain Vitest tests with no new dependency. Accessibility reuses `jsdom` (already added for Component Tests) plus a new `axe-core` dependency. Compatibility reuses Playwright, extended to run across multiple browser engines via `playwright.config.ts` projects — which also gives the existing E2E topic cross-browser coverage for free. Usability is reference-only.

**Tech Stack:** autocannon, axe-core, tsx (already added), Playwright (already added, extended with multi-browser projects).

This is the third of several plans covering
`docs/superpowers/specs/2026-07-24-testing-practices-repo-design.md`. Test Quality & Robustness Techniques and Methodologies/QA Procedures remain after this.

## Global Constraints

- Same conventions as prior plans: pnpm, TypeScript strict mode, Vitest test files as `example.test.ts` imported with no extension.
- New file-extension convention: Vitest benchmark files are `*.bench.ts`, run via `pnpm run bench` (`vitest bench`) — doesn't match `topics/**/*.test.ts`, no config change needed to keep it out of `pnpm test`.
- Load/Stress/Soak scripts are run directly (`tsx topics/<name>/example.ts`), not asserted on in an automated pass/fail sense — their READMEs say so explicitly, matching how these are actually used in practice (a human reads the numbers).
- Every topic's `README.md` includes: one-paragraph definition, "When to use it", 2–4 links to authoritative references, and (for topics with their own run command) that exact command.
- Root `README.md` gets each topic added under `### Non-Functional Testing` as its task lands.
- This external volume writes macOS `._name` AppleDouble shadow files alongside every real file (established in the scaffold plan); any new Vitest sub-config (e.g. `benchmark`) needs the same `**/._*` exclusion as `test.exclude`.

---

### Task 1: Performance Tests topic

**Files:**
- Create: `topics/performance-tests/example.ts`
- Create: `topics/performance-tests/example.bench.ts`
- Create: `topics/performance-tests/README.md`
- Modify: `vitest.config.ts` (add a `benchmark` block with the same AppleDouble exclusion as `test.exclude`)
- Modify: `package.json` (add a `bench` script)
- Modify: `README.md`

**Interfaces:**
- Produces: `findLinear(haystack: number[], needle: number): boolean` and `findWithSet(haystackSet: Set<number>, needle: number): boolean` — two implementations of the same lookup, benchmarked side by side.

- [ ] **Step 1: Add the `benchmark` block to `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['topics/**/*.test.ts'],
    // ponytail: this external volume writes a macOS AppleDouble "._name"
    // shadow file alongside every real file; exclude them or Vitest treats
    // them as test files and fails on the binary content.
    exclude: ['**/node_modules/**', '**/._*'],
  },
  benchmark: {
    exclude: ['**/node_modules/**', '**/._*'],
  },
})
```

- [ ] **Step 2: Add the `bench` script**

In `package.json`, under `"scripts"`, add:

```json
"bench": "vitest bench"
```

- [ ] **Step 3: Write the implementation**

`topics/performance-tests/example.ts`:

```ts
export function findLinear(haystack: number[], needle: number): boolean {
  return haystack.includes(needle)
}

export function findWithSet(haystackSet: Set<number>, needle: number): boolean {
  return haystackSet.has(needle)
}
```

- [ ] **Step 4: Write the benchmark**

`topics/performance-tests/example.bench.ts`:

```ts
import { bench, describe } from 'vitest'
import { findLinear, findWithSet } from './example'

const haystack = Array.from({ length: 10_000 }, (_, i) => i)
const haystackSet = new Set(haystack)
const needle = 9_999

describe('finding an element in a 10,000-item collection', () => {
  bench('Array.includes (linear scan)', () => {
    findLinear(haystack, needle)
  })

  bench('Set.has (hash lookup)', () => {
    findWithSet(haystackSet, needle)
  })
})
```

- [ ] **Step 5: Run the benchmark**

Run: `pnpm run bench topics/performance-tests`
Expected: a results table with both benchmark names, showing `Set.has` with a
higher ops/sec than `Array.includes` for this size of collection.

- [ ] **Step 6: Write the README**

`topics/performance-tests/README.md`:

```markdown
# Performance Tests

Measure how fast code runs — not just whether it's correct — usually by
comparing implementations or tracking a number over time.

**When to use it:** when choosing between implementations with a real
throughput/latency difference, or to catch a performance regression before
it ships.

**Example:** `example.ts` has two ways to check membership in a 10,000-item
collection; `example.bench.ts` benchmarks them with Vitest's built-in
`bench`.

**Run it:** `pnpm run bench topics/performance-tests` (a separate mode from
`pnpm test` — benchmarks aren't pass/fail).

## References

- [Vitest: Benchmarking](https://vitest.dev/guide/features.html#benchmarking)
- [MDN: Big O notation and complexity (why Set beats Array here)](https://developer.mozilla.org/en-US/docs/Glossary/Big_O_notation)
```

- [ ] **Step 7: Add the topic to the root README**

In `README.md`, under `### Non-Functional Testing`, add:

```markdown
- [Performance Tests](topics/performance-tests/README.md)
```

- [ ] **Step 8: Commit**

```bash
git add topics/performance-tests vitest.config.ts package.json README.md
git commit -m "Add Performance Tests topic"
```

---

### Task 2: Localization/i18n Tests topic

**Files:**
- Create: `topics/localization-tests/example.ts`
- Create: `topics/localization-tests/example.test.ts`
- Create: `topics/localization-tests/README.md`
- Modify: `README.md`

**Interfaces:**
- Produces: `formatCurrencyForLocale(amount: number, locale: string, currency: string): string` and `findMissingTranslationKeys(base: Record<string, string>, target: Record<string, string>): string[]`.

- [ ] **Step 1: Write the failing test**

`topics/localization-tests/example.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { findMissingTranslationKeys, formatCurrencyForLocale } from './example'

describe('formatCurrencyForLocale', () => {
  it('formats US dollars with two decimal places', () => {
    expect(formatCurrencyForLocale(1234.5, 'en-US', 'USD')).toBe('$1,234.50')
  })

  it('formats Euros with locale-specific grouping and decimal separators', () => {
    expect(formatCurrencyForLocale(1234.5, 'de-DE', 'EUR')).toBe('1.234,50\xa0€')
  })

  it('formats Japanese yen with zero decimal places (a common i18n bug source)', () => {
    expect(formatCurrencyForLocale(1234, 'ja-JP', 'JPY')).toBe('￥1,234')
  })
})

describe('findMissingTranslationKeys', () => {
  it('finds keys present in the base locale but missing from the target', () => {
    const en = { greeting: 'Hello', farewell: 'Goodbye' }
    const es = { greeting: 'Hola' }

    expect(findMissingTranslationKeys(en, es)).toEqual(['farewell'])
  })

  it('returns an empty array when all keys are translated', () => {
    const en = { greeting: 'Hello' }
    const es = { greeting: 'Hola' }

    expect(findMissingTranslationKeys(en, es)).toEqual([])
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm test topics/localization-tests`
Expected: FAIL — `Cannot find module './example'`.

- [ ] **Step 3: Write the implementation**

`topics/localization-tests/example.ts`:

```ts
export function formatCurrencyForLocale(amount: number, locale: string, currency: string): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount)
}

export function findMissingTranslationKeys(
  base: Record<string, string>,
  target: Record<string, string>,
): string[] {
  return Object.keys(base).filter((key) => !(key in target))
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm test topics/localization-tests`
Expected: PASS — 5 tests passing. (If the exact grouping/currency-symbol
characters differ from what's shown above on the machine running this, it's
because those strings come from the ICU data built into Node — adjust the
expected string to match the actual output, the behavior being tested is
still correct.)

- [ ] **Step 5: Write the README**

`topics/localization-tests/README.md`:

```markdown
# Localization / i18n Tests

Verify that dates, numbers, currency, and text render correctly per locale,
and that no translation key is silently missing.

**When to use it:** any app that ships in more than one locale — catches
both formatting bugs (wrong decimal/grouping separators, wrong currency
symbol) and incomplete translations before they reach users.

**Example:** `example.ts` uses the native `Intl.NumberFormat` for
locale-correct currency formatting, and a plain key-diff for translation
completeness; `example.test.ts` covers three locales plus a missing-key
case.

## References

- [MDN: Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat)
- [W3C: Internationalization (i18n) Techniques](https://www.w3.org/International/techniques/authoring-html)
```

- [ ] **Step 6: Add the topic to the root README**

In `README.md`, under `### Non-Functional Testing`, add:

```markdown
- [Localization/i18n Tests](topics/localization-tests/README.md)
```

- [ ] **Step 7: Commit**

```bash
git add topics/localization-tests README.md
git commit -m "Add Localization/i18n Tests topic"
```

---

### Task 3: Security Tests topic

**Files:**
- Create: `topics/security-tests/example.ts`
- Create: `topics/security-tests/example.test.ts`
- Create: `topics/security-tests/README.md`
- Modify: `README.md`

**Interfaces:**
- Produces: `escapeHtml(input: string): string`.

- [ ] **Step 1: Write the failing test**

`topics/security-tests/example.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { escapeHtml } from './example'

const XSS_PAYLOADS = [
  '<script>alert(1)</script>',
  '"><img src=x onerror=alert(1)>',
  "<svg/onload=alert('xss')>",
]

describe('escapeHtml', () => {
  it.each(XSS_PAYLOADS)('neutralizes the markup in %j', (payload) => {
    expect(escapeHtml(payload)).not.toMatch(/[<>]/)
  })

  it('leaves plain text unchanged', () => {
    expect(escapeHtml('Hello, world!')).toBe('Hello, world!')
  })

  it('escapes ampersands so entities cannot be forged', () => {
    expect(escapeHtml('Tom & Jerry')).toBe('Tom &amp; Jerry')
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm test topics/security-tests`
Expected: FAIL — `Cannot find module './example'`.

- [ ] **Step 3: Write the implementation**

`topics/security-tests/example.ts`:

```ts
const HTML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

export function escapeHtml(input: string): string {
  return input.replace(/[&<>"']/g, (char) => HTML_ESCAPES[char] ?? char)
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm test topics/security-tests`
Expected: PASS — 5 tests passing.

- [ ] **Step 5: Write the README**

`topics/security-tests/README.md`:

```markdown
# Security Tests

Test that code correctly handles hostile input — here, a battery of known
XSS payloads against an output-encoding function. Broader security testing
(SAST static analysis, DAST dynamic scanning, penetration testing) is
tooling-heavy and out of scope for a single code example — see the
references instead.

**When to use it:** anywhere untrusted input reaches an HTML/SQL/shell
context — the encoding or parameterization at that boundary is exactly
what this kind of test verifies.

**Example:** `example.ts`'s `escapeHtml` is tested against real XSS payload
strings (`example.test.ts`) to confirm none of them survive as executable
markup.

## References

- [OWASP: Cross-Site Scripting (XSS) Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [OWASP ZAP (DAST tool)](https://www.zaproxy.org/)
- [Semgrep (SAST tool)](https://semgrep.dev/)
```

- [ ] **Step 6: Add the topic to the root README**

In `README.md`, under `### Non-Functional Testing`, add:

```markdown
- [Security Tests](topics/security-tests/README.md)
```

- [ ] **Step 7: Commit**

```bash
git add topics/security-tests README.md
git commit -m "Add Security Tests topic"
```

---

### Task 4: Chaos Engineering topic

**Files:**
- Create: `topics/chaos-engineering/example.ts`
- Create: `topics/chaos-engineering/example.test.ts`
- Create: `topics/chaos-engineering/README.md`
- Modify: `README.md`

**Interfaces:**
- Produces: `ChaosError` and `fetchWithRetry(operation: () => Promise<string>, maxAttempts: number): Promise<string>`.

- [ ] **Step 1: Write the failing test**

`topics/chaos-engineering/example.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { ChaosError, fetchWithRetry } from './example'

function injectFailures(succeedOnAttempt: number, result: string) {
  let attempts = 0
  return async () => {
    attempts += 1
    if (attempts < succeedOnAttempt) {
      throw new ChaosError(`Injected failure on attempt ${attempts}`)
    }
    return result
  }
}

describe('fetchWithRetry', () => {
  it('recovers from injected failures within the retry budget', async () => {
    const operation = injectFailures(3, 'ok')

    await expect(fetchWithRetry(operation, 5)).resolves.toBe('ok')
  })

  it('gives up once failures exceed the retry budget', async () => {
    const operation = injectFailures(10, 'ok')

    await expect(fetchWithRetry(operation, 3)).rejects.toThrow(ChaosError)
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm test topics/chaos-engineering`
Expected: FAIL — `Cannot find module './example'`.

- [ ] **Step 3: Write the implementation**

`topics/chaos-engineering/example.ts`:

```ts
export class ChaosError extends Error {}

export async function fetchWithRetry(operation: () => Promise<string>, maxAttempts: number): Promise<string> {
  let lastError: unknown
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error
    }
  }
  throw lastError
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm test topics/chaos-engineering`
Expected: PASS — 2 tests passing.

- [ ] **Step 5: Write the README**

`topics/chaos-engineering/README.md`:

```markdown
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
```

- [ ] **Step 6: Add the topic to the root README**

In `README.md`, under `### Non-Functional Testing`, add:

```markdown
- [Chaos Engineering](topics/chaos-engineering/README.md)
```

- [ ] **Step 7: Commit**

```bash
git add topics/chaos-engineering README.md
git commit -m "Add Chaos Engineering topic"
```

---

### Task 5: Accessibility Tests topic

**Files:**
- Create: `topics/accessibility-tests/form.ts`
- Create: `topics/accessibility-tests/example.test.ts`
- Create: `topics/accessibility-tests/README.md`
- Modify: `package.json` (add `axe-core` devDependency)
- Modify: `README.md`

**Interfaces:**
- Produces: `createSignupForm(container: HTMLElement): void`.
- New dependency: `axe-core` — the tool named in the spec for accessibility
  testing; runs against a jsdom document the same way Component Tests
  already does (per-file `@vitest-environment jsdom` pragma).

- [ ] **Step 1: Add the dependency**

Run: `pnpm add -D axe-core`
Expected: added to `package.json` devDependencies and installed.

- [ ] **Step 2: Write the failing test**

`topics/accessibility-tests/example.test.ts`:

```ts
// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import axe from 'axe-core'
import { createSignupForm } from './form'

describe('createSignupForm', () => {
  it('has no accessibility violations', async () => {
    document.body.innerHTML = ''
    createSignupForm(document.body)

    const results = await axe.run(document.body)

    expect(results.violations).toEqual([])
  })
})
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `pnpm test topics/accessibility-tests`
Expected: FAIL — `Cannot find module './form'`.

- [ ] **Step 4: Write the implementation**

`topics/accessibility-tests/form.ts`:

```ts
export function createSignupForm(container: HTMLElement): void {
  const label = document.createElement('label')
  label.setAttribute('for', 'email')
  label.textContent = 'Email address'

  const input = document.createElement('input')
  input.type = 'email'
  input.id = 'email'

  container.appendChild(label)
  container.appendChild(input)
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `pnpm test topics/accessibility-tests`
Expected: PASS — 1 test passing.

If axe-core reports a violation unrelated to the label/input association
(e.g. a rule that needs real layout, which jsdom doesn't provide), narrow
the scan to the rules that matter for this example:
`axe.run(document.body, { runOnly: ['label', 'aria-valid-attr', 'image-alt'] })`
and note the reason in the README.

- [ ] **Step 6: Write the README**

`topics/accessibility-tests/README.md`:

```markdown
# Accessibility Tests

Automatically check rendered markup against WCAG rules — missing labels,
missing alt text, invalid ARIA usage — the mechanically-checkable subset of
accessibility. It doesn't replace manual screen-reader testing, but it
catches the common mistakes automatically on every run.

**When to use it:** any UI component or page, as a baseline gate — treat a
clean axe-core run as necessary, not sufficient, for accessibility.

**Example:** `form.ts` builds a signup form with a properly associated
`<label>`; `example.test.ts` runs axe-core against it and asserts zero
violations.

## References

- [axe-core docs](https://github.com/dequelabs/axe-core)
- [WCAG 2.2 quick reference](https://www.w3.org/WAI/WCAG22/quickref/)
- [Deque University: axe rules](https://dequeuniversity.com/rules/axe/)
```

- [ ] **Step 7: Add the topic to the root README**

In `README.md`, under `### Non-Functional Testing`, add:

```markdown
- [Accessibility Tests](topics/accessibility-tests/README.md)
```

- [ ] **Step 8: Commit**

```bash
git add topics/accessibility-tests package.json pnpm-lock.yaml README.md
git commit -m "Add Accessibility Tests topic"
```

---

### Task 6: Load Tests topic

**Files:**
- Create: `topics/load-tests/example.ts`
- Create: `topics/load-tests/README.md`
- Modify: `package.json` (add `autocannon` devDependency; add a `loadtest` script)
- Modify: `README.md`

**Interfaces:**
- Consumes: `startServer(): { server: Server; url: string }` from `topics/system-tests/server.ts`.
- New dependency: `autocannon` — pure-JS HTTP load generator, no external
  binary; the tool named in the spec for load testing.

- [ ] **Step 1: Add the dependency and script**

Run: `pnpm add -D autocannon`
Expected: added to `package.json` devDependencies and installed. If
`autocannon` doesn't ship its own TypeScript types (check for a type error
when writing Step 2), also run `pnpm add -D @types/autocannon`.

In `package.json`, under `"scripts"`, add:

```json
"loadtest": "tsx topics/load-tests/example.ts"
```

- [ ] **Step 2: Write the script**

`topics/load-tests/example.ts`:

```ts
import autocannon from 'autocannon'
import { startServer } from '../system-tests/server'

async function main() {
  const { server, url } = startServer()

  const result = await autocannon({
    url: `${url}/health`,
    connections: 10,
    duration: 2,
  })

  server.close()

  console.log(`Requests/sec: ${result.requests.average}`)
  console.log(`Latency (ms), avg: ${result.latency.average}, p99: ${result.latency.p99}`)
  console.log(`Errors: ${result.errors}, Timeouts: ${result.timeouts}`)
}

main()
```

- [ ] **Step 3: Run it**

Run: `pnpm run loadtest`
Expected: prints requests/sec, latency, and zero errors/timeouts — this is
a load test's normal expected shape at 10 concurrent connections against an
in-process server. There's no pass/fail assertion here; a human reads the
numbers (see the README).

- [ ] **Step 4: Write the README**

`topics/load-tests/README.md`:

```markdown
# Load Tests

Send traffic at a system under a realistic, expected load and measure
throughput and latency — not to break it (that's [Stress Tests](../stress-tests/README.md)),
but to confirm it performs acceptably under normal conditions.

**When to use it:** before a launch or a traffic-sensitive change, against
a staging environment sized like production.

**Example:** `example.ts` starts the [System Tests](../system-tests/README.md)
server in-process and points `autocannon` at its `/health` endpoint for a
short, illustrative run.

**Run it:** `pnpm run loadtest`. This prints numbers for a human to read,
not a pass/fail result — real load testing sets throughput/latency
thresholds specific to the system under test, which this generic example
doesn't have.

## References

- [autocannon docs](https://github.com/mcollina/autocannon)
- [k6 docs (a common production load-testing tool)](https://grafana.com/docs/k6/latest/)
- [Grafana: Load testing basics](https://grafana.com/load-testing/)
```

- [ ] **Step 5: Add the topic to the root README**

In `README.md`, under `### Non-Functional Testing`, add:

```markdown
- [Load Tests](topics/load-tests/README.md)
```

- [ ] **Step 6: Commit**

```bash
git add topics/load-tests package.json pnpm-lock.yaml README.md
git commit -m "Add Load Tests topic"
```

---

### Task 7: Stress Tests topic

**Files:**
- Create: `topics/stress-tests/example.ts`
- Create: `topics/stress-tests/README.md`
- Modify: `package.json` (add a `stresstest` script)
- Modify: `README.md`

**Interfaces:**
- Consumes: `startServer()` from `topics/system-tests/server.ts`, and
  `autocannon` (already added in Task 6).

- [ ] **Step 1: Add the script**

In `package.json`, under `"scripts"`, add:

```json
"stresstest": "tsx topics/stress-tests/example.ts"
```

- [ ] **Step 2: Write the script**

`topics/stress-tests/example.ts`:

```ts
import autocannon from 'autocannon'
import { startServer } from '../system-tests/server'

async function main() {
  const { server, url } = startServer()

  // Stress testing means pushing connections well past expected production
  // load to find the point where the system degrades or errors.
  const result = await autocannon({
    url: `${url}/health`,
    connections: 500,
    duration: 3,
  })

  server.close()

  console.log(`Requests/sec: ${result.requests.average}`)
  console.log(`Latency (ms), avg: ${result.latency.average}, p99: ${result.latency.p99}`)
  console.log(`Errors: ${result.errors}, Timeouts: ${result.timeouts}`)
  console.log(`Non-2xx responses: ${result['2xx'] !== result.requests.total ? 'yes — see result.statusCodeStats' : 'none'}`)
}

main()
```

- [ ] **Step 3: Run it**

Run: `pnpm run stresstest`
Expected: prints numbers, likely showing higher latency than the Load Tests
run at 10 connections — that latency growth under pressure is exactly what
a stress test is looking for. Occasional errors/timeouts at 500 connections
against a single in-process Node server are expected and fine for this
illustrative example, not a bug to fix.

- [ ] **Step 4: Write the README**

`topics/stress-tests/README.md`:

```markdown
# Stress Tests

Push a system past its expected capacity on purpose, to find where and how
it breaks — unlike [Load Tests](../load-tests/README.md), the point isn't a
clean pass, it's learning the failure mode (slow degradation? hard errors?
crash?).

**When to use it:** to find capacity limits before an unexpected traffic
spike does, and to confirm the system fails safely (returns errors) rather
than catastrophically (crashes, corrupts data).

**Example:** `example.ts` reuses the same server and `autocannon` setup as
[Load Tests](../load-tests/README.md), just with far more concurrent
connections (500 vs. 10).

**Run it:** `pnpm run stresstest`. Like Load Tests, this prints numbers for
a human to interpret.

## References

- [autocannon docs](https://github.com/mcollina/autocannon)
- [Google SRE Book: Load and capacity planning](https://sre.google/sre-book/embracing-risk/)
```

- [ ] **Step 5: Add the topic to the root README**

In `README.md`, under `### Non-Functional Testing`, add:

```markdown
- [Stress Tests](topics/stress-tests/README.md)
```

- [ ] **Step 6: Commit**

```bash
git add topics/stress-tests package.json README.md
git commit -m "Add Stress Tests topic"
```

---

### Task 8: Soak/Endurance Tests topic

**Files:**
- Create: `topics/soak-tests/example.ts`
- Create: `topics/soak-tests/README.md`
- Modify: `package.json` (add a `soaktest` script)
- Modify: `README.md`

**Interfaces:**
- Consumes: `startServer()` from `topics/system-tests/server.ts`, and
  `autocannon` (already added in Task 6).

- [ ] **Step 1: Add the script**

In `package.json`, under `"scripts"`, add:

```json
"soaktest": "tsx topics/soak-tests/example.ts"
```

- [ ] **Step 2: Write the script**

`topics/soak-tests/example.ts`:

```ts
import autocannon from 'autocannon'
import { startServer } from '../system-tests/server'

async function main() {
  const { server, url } = startServer()

  // Real soak tests run for hours or days at moderate, sustained load to
  // catch slow leaks (memory growth, connection exhaustion, clock drift)
  // that a short run can't reveal. This example runs for a few seconds
  // only, to stay runnable as part of this repo — the technique is
  // identical, just the duration differs by orders of magnitude.
  const result = await autocannon({
    url: `${url}/health`,
    connections: 10,
    duration: 5,
  })

  server.close()

  console.log(`Requests/sec: ${result.requests.average}`)
  console.log(`Latency (ms), avg: ${result.latency.average}, p99: ${result.latency.p99}`)
  console.log(`Errors: ${result.errors}, Timeouts: ${result.timeouts}`)
  console.log('(A real soak test would run this same shape for hours, watching for drift over time.)')
}

main()
```

- [ ] **Step 3: Run it**

Run: `pnpm run soaktest`
Expected: prints numbers similar to the Load Tests run, plus the closing
note about real soak test duration.

- [ ] **Step 4: Write the README**

`topics/soak-tests/README.md`:

```markdown
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
```

- [ ] **Step 5: Add the topic to the root README**

In `README.md`, under `### Non-Functional Testing`, add:

```markdown
- [Soak/Endurance Tests](topics/soak-tests/README.md)
```

- [ ] **Step 6: Commit**

```bash
git add topics/soak-tests package.json README.md
git commit -m "Add Soak/Endurance Tests topic"
```

---

### Task 9: Compatibility Tests topic

**Files:**
- Create: `topics/compatibility-tests/fixture.html`
- Create: `topics/compatibility-tests/example.spec.ts`
- Create: `topics/compatibility-tests/README.md`
- Modify: `playwright.config.ts` (add `projects` for chromium, firefox, webkit)
- Modify: `README.md`

**Interfaces:**
- Adding `projects` to the shared `playwright.config.ts` means every
  existing `.spec.ts` file (currently just E2E Tests) now runs once per
  browser project instead of once total. This is a real improvement (free
  cross-browser coverage for E2E), not a regression, but Step 2 below
  re-verifies the E2E topic still passes under the new config before
  building Compatibility Tests on top of it.

- [ ] **Step 1: Install the additional browser engines**

Run: `pnpm exec playwright install firefox webkit`
Expected: both browser binaries downloaded (chromium is already installed
from the E2E Tests topic).

- [ ] **Step 2: Add multi-browser projects to the shared Playwright config**

`playwright.config.ts`:

```ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './topics',
  testMatch: '**/*.spec.ts',
  testIgnore: '**/._*',
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
})
```

- [ ] **Step 3: Re-verify the E2E topic still passes across all three browsers**

Run: `pnpm exec playwright test topics/e2e-tests`
Expected: PASS — 3 passed (1 test × 3 projects).

- [ ] **Step 4: Write the fixture**

`topics/compatibility-tests/fixture.html`:

```html
<!doctype html>
<html lang="en">
  <body>
    <button id="open">Open dialog</button>
    <dialog id="dialog">
      <p>Native dialog content</p>
      <button id="close">Close</button>
    </dialog>
    <script>
      document.getElementById('open').addEventListener('click', () => {
        document.getElementById('dialog').showModal()
      })
      document.getElementById('close').addEventListener('click', () => {
        document.getElementById('dialog').close()
      })
    </script>
  </body>
</html>
```

- [ ] **Step 5: Write the test**

`topics/compatibility-tests/example.spec.ts`:

```ts
import { test, expect } from '@playwright/test'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const fixturePath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixture.html')

test('the native <dialog> element opens and closes', async ({ page }) => {
  await page.goto(`file://${fixturePath}`)
  const dialog = page.locator('#dialog')

  await expect(dialog).not.toBeVisible()
  await page.click('#open')
  await expect(dialog).toBeVisible()
  await page.click('#close')
  await expect(dialog).not.toBeVisible()
})
```

- [ ] **Step 6: Run it across all three browsers**

Run: `pnpm exec playwright test topics/compatibility-tests`
Expected: PASS — 3 passed (1 test × 3 projects: chromium, firefox, webkit),
demonstrating the native `<dialog>` element behaves the same across all
three real browser engines.

- [ ] **Step 7: Write the README**

`topics/compatibility-tests/README.md`:

```markdown
# Compatibility Tests

Verify the same functionality works across different browsers, devices, or
operating systems — anything that behaves subtly differently despite
looking like "the same web platform."

**When to use it:** for any feature that leans on a platform API with a
history of inconsistent support (here, the native `<dialog>` element) —
run it for real in each target browser engine instead of assuming parity.

**Example:** `fixture.html` uses the native `<dialog>` element;
`example.spec.ts` runs the same scenario against Chromium, Firefox, and
WebKit via Playwright's `projects` config (`playwright.config.ts`, shared
with [E2E Tests](../e2e-tests/README.md), which now also runs cross-browser
for free).

**Run it:** `pnpm exec playwright test topics/compatibility-tests`.

## References

- [Playwright: Projects](https://playwright.dev/docs/test-projects)
- [Can I use: <dialog>](https://caniuse.com/dialog)
- [BrowserStack (a common commercial cross-browser/device testing service)](https://www.browserstack.com/)
```

- [ ] **Step 8: Add the topic to the root README**

In `README.md`, under `### Non-Functional Testing`, add:

```markdown
- [Compatibility Tests](topics/compatibility-tests/README.md)
```

- [ ] **Step 9: Commit**

```bash
git add topics/compatibility-tests playwright.config.ts README.md
git commit -m "Add Compatibility Tests topic"
```

---

### Task 10: Usability Tests topic (reference-only)

**Files:**
- Create: `topics/usability-tests/README.md`
- Modify: `README.md`

**Interfaces:**
- None — reference-only topic, no code.

- [ ] **Step 1: Write the README**

`topics/usability-tests/README.md`:

```markdown
# Usability Tests

Watch real users attempt real tasks with the product, and observe where
they struggle, hesitate, or fail — a human-observation practice, not
something a script can stand in for. Reference-only here.

**When to use it:** before or after shipping a significant UI/flow change,
when you need to know not just "does it work" but "can people actually use
it" — a question automated tests structurally can't answer.

## References

- [Nielsen Norman Group: Usability Testing 101](https://www.nngroup.com/articles/usability-testing-101/)
- [Usability.gov: Usability Testing](https://www.usability.gov/how-to-and-tools/methods/usability-testing.html)
```

- [ ] **Step 2: Add the topic to the root README**

In `README.md`, under `### Non-Functional Testing`, add:

```markdown
- [Usability Tests](topics/usability-tests/README.md)
```

- [ ] **Step 3: Commit**

```bash
git add topics/usability-tests README.md
git commit -m "Add Usability Tests topic"
```

---

## End-of-plan verification

- [ ] Run `pnpm test` — expected: all Vitest topics pass (Localization, Security, Chaos Engineering, Accessibility added this plan, plus all from prior plans).
- [ ] Run `pnpm run bench topics/performance-tests` — expected: benchmark table prints for both implementations.
- [ ] Run `pnpm run loadtest`, `pnpm run stresstest`, `pnpm run soaktest` — expected: each prints results with no crash.
- [ ] Run `pnpm exec playwright test` (no path filter, runs all `.spec.ts` topics) — expected: E2E and Compatibility topics both pass across chromium/firefox/webkit.
- [ ] Run `pnpm exec tsc --noEmit` — expected: no type errors.
- [ ] Confirm `README.md`'s "Non-Functional Testing" section lists all 10 topics.
