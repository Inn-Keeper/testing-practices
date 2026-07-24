# Scaffold + Test Levels Topics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold the testing-practices repo and build out the "Test Levels by Scope" category (9 topics: Unit, Integration, Component, Contract, E2E, System, Smoke, Regression, Acceptance/UAT), each as a self-contained `topics/<name>/` folder.

**Architecture:** Single pnpm package, Vitest + TypeScript (strict) at the root. `topics/**/*.test.ts` run under Vitest (`pnpm test`); `topics/**/*.spec.ts` run under Playwright (`pnpm exec playwright test`) — the two extensions keep the runners from colliding, since Vitest's include glob only matches `.test.ts`. Each topic folder has a `README.md` with links, plus example code where a code example is meaningful (per the design spec).

**Tech Stack:** TypeScript, Vitest, @testing-library/dom + jsdom, zod, @playwright/test, pnpm.

This is the first of several plans covering the full spec in
`docs/superpowers/specs/2026-07-24-testing-practices-repo-design.md`. Later
plans cover BDD & Specification, Non-Functional, Quality Techniques, and
Methodologies/QA Procedures — each is independently runnable once landed.

## Global Constraints

- Package manager: **pnpm** (confirmed with user).
- TypeScript strict mode; no `any`.
- Vitest test files: `topics/<name>/example.test.ts`, imported with no file extension (e.g. `from './example'`).
- Playwright test files: `topics/<name>/example.spec.ts` (kept out of Vitest's glob by extension alone).
- Every code-example topic's `README.md` includes: one-paragraph definition, "When to use it", and 2–4 links to authoritative external references.
- Reference-only topics (no code) get `README.md` only — no `example.ts`/`example.test.ts`.
- Root `README.md` lists every topic under its category heading as work lands; this plan only fills in the "Test Levels by Scope" section.

---

### Task 1: Repo scaffold

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `vitest.config.ts`
- Create: `.gitignore`
- Create: `README.md`

**Interfaces:**
- Produces: `pnpm test` → runs Vitest against `topics/**/*.test.ts`. `pnpm exec tsc --noEmit` → typechecks everything under `topics/`. Later tasks rely on both existing and working.

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "testing-practices",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "typecheck": "tsc --noEmit"
  },
  "devDependencies": {
    "typescript": "^5.7.0",
    "vitest": "^3.0.0"
  }
}
```

- [ ] **Step 2: Create `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "noEmit": true
  },
  "include": ["topics"]
}
```

- [ ] **Step 3: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['topics/**/*.test.ts'],
  },
})
```

- [ ] **Step 4: Create `.gitignore`**

```
node_modules/
dist/
coverage/
test-results/
playwright-report/
```

- [ ] **Step 5: Create `README.md`**

```markdown
# Software Testing Practices

A learning repo covering the most important software testing practices in
modern development. Each topic has a short reference write-up with links to
authoritative sources, and — where a code example is meaningful — a small,
runnable TypeScript example under `topics/<name>/`.

Run the Vitest-based examples: `pnpm test`. Some topics use their own
runner (Playwright, Cucumber, Stryker) — see that topic's README for the
exact command.

## Topics

### Test Levels by Scope

### BDD & Specification Styles

### Non-Functional Testing

### Test Quality & Robustness Techniques

### Approaches & Methodologies

### QA Procedures & Processes

## Quality Metrics

_Added once all topic categories are in place._
```

- [ ] **Step 6: Install dependencies**

Run: `pnpm install`
Expected: lockfile `pnpm-lock.yaml` created, `node_modules/` populated, no errors.

- [ ] **Step 7: Verify the toolchain works**

Run: `pnpm exec vitest --version`
Expected: prints a version number (e.g. `vitest/3.x.x ...`), confirming Vitest is installed and runnable.

- [ ] **Step 8: Commit**

```bash
git add package.json pnpm-lock.yaml tsconfig.json vitest.config.ts .gitignore README.md
git commit -m "Scaffold repo: pnpm + TypeScript + Vitest"
```

---

### Task 2: Unit Tests topic

**Files:**
- Create: `topics/unit-tests/example.ts`
- Create: `topics/unit-tests/example.test.ts`
- Create: `topics/unit-tests/README.md`
- Modify: `README.md` (add link under "Test Levels by Scope")

**Interfaces:**
- Produces: `calculateDiscount(unitPrice: number, quantity: number): number` — pure function, no dependency on other topics.

- [ ] **Step 1: Write the failing test**

`topics/unit-tests/example.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { calculateDiscount } from './example'

describe('calculateDiscount', () => {
  it('applies no discount below the smallest tier', () => {
    expect(calculateDiscount(10, 9)).toBe(90)
  })

  it('applies the 5% tier at the boundary quantity', () => {
    expect(calculateDiscount(10, 10)).toBe(95)
  })

  it('applies the 10% tier', () => {
    expect(calculateDiscount(10, 50)).toBe(450)
  })

  it('applies the 20% tier', () => {
    expect(calculateDiscount(10, 100)).toBe(800)
  })

  it('rejects a negative quantity', () => {
    expect(() => calculateDiscount(10, -1)).toThrow(RangeError)
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm test topics/unit-tests`
Expected: FAIL — `Cannot find module './example'` (file doesn't exist yet).

- [ ] **Step 3: Write the implementation**

`topics/unit-tests/example.ts`:

```ts
const TIER_THRESHOLDS = [
  { minQuantity: 100, rate: 0.2 },
  { minQuantity: 50, rate: 0.1 },
  { minQuantity: 10, rate: 0.05 },
] as const

export function calculateDiscount(unitPrice: number, quantity: number): number {
  if (unitPrice < 0 || quantity < 0) {
    throw new RangeError('unitPrice and quantity must be non-negative')
  }

  const tier = TIER_THRESHOLDS.find((t) => quantity >= t.minQuantity)
  const rate = tier?.rate ?? 0
  return unitPrice * quantity * (1 - rate)
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm test topics/unit-tests`
Expected: PASS — 5 tests passing.

- [ ] **Step 5: Write the README**

`topics/unit-tests/README.md`:

```markdown
# Unit Tests

Test a single function or class in isolation, with no real dependencies
(database, network, filesystem). Fast, deterministic, and the base of the
testing pyramid.

**When to use it:** for any unit of logic with a clear input/output
contract — the default first test to write for new code.

**Example:** `example.ts` is a tiered discount calculator; `example.test.ts`
covers each tier boundary and an invalid-input case.

## References

- [Vitest: Getting Started](https://vitest.dev/guide/)
- [Martin Fowler: UnitTest](https://martinfowler.com/bliki/UnitTest.html)
- [Kent C. Dodds: Write tests, not too many, mostly integration](https://kentcdodds.com/blog/write-tests)
```

- [ ] **Step 6: Add the topic to the root README**

In `README.md`, under `### Test Levels by Scope`, add:

```markdown
- [Unit Tests](topics/unit-tests/README.md)
```

- [ ] **Step 7: Commit**

```bash
git add topics/unit-tests README.md
git commit -m "Add Unit Tests topic"
```

---

### Task 3: Integration Tests topic

**Files:**
- Create: `topics/integration-tests/userRepository.ts`
- Create: `topics/integration-tests/userService.ts`
- Create: `topics/integration-tests/example.test.ts`
- Create: `topics/integration-tests/README.md`
- Modify: `README.md`

**Interfaces:**
- Produces: `InMemoryUserRepository` with `save(user: User): void` and `findByEmail(email: string): User | undefined`; `UserService` with `register(id: string, email: string): void`, throwing `DuplicateEmailError` on a duplicate.

- [ ] **Step 1: Write the failing test**

`topics/integration-tests/example.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { InMemoryUserRepository } from './userRepository'
import { DuplicateEmailError, UserService } from './userService'

describe('UserService + InMemoryUserRepository integration', () => {
  it('registers a user and makes them findable through the repository', () => {
    const repo = new InMemoryUserRepository()
    const service = new UserService(repo)

    service.register('1', 'a@example.com')

    expect(repo.findByEmail('a@example.com')).toEqual({ id: '1', email: 'a@example.com' })
  })

  it('rejects a duplicate email across the two collaborating units', () => {
    const repo = new InMemoryUserRepository()
    const service = new UserService(repo)
    service.register('1', 'a@example.com')

    expect(() => service.register('2', 'a@example.com')).toThrow(DuplicateEmailError)
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm test topics/integration-tests`
Expected: FAIL — `Cannot find module './userRepository'`.

- [ ] **Step 3: Write the implementation**

`topics/integration-tests/userRepository.ts`:

```ts
export interface User {
  id: string
  email: string
}

export class InMemoryUserRepository {
  private users = new Map<string, User>()

  save(user: User): void {
    this.users.set(user.id, user)
  }

  findByEmail(email: string): User | undefined {
    return [...this.users.values()].find((u) => u.email === email)
  }
}
```

`topics/integration-tests/userService.ts`:

```ts
import type { InMemoryUserRepository } from './userRepository'

export class DuplicateEmailError extends Error {}

export class UserService {
  constructor(private readonly repo: InMemoryUserRepository) {}

  register(id: string, email: string): void {
    if (this.repo.findByEmail(email)) {
      throw new DuplicateEmailError(`Email already registered: ${email}`)
    }
    this.repo.save({ id, email })
  }
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm test topics/integration-tests`
Expected: PASS — 2 tests passing.

- [ ] **Step 5: Write the README**

`topics/integration-tests/README.md`:

```markdown
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
```

- [ ] **Step 6: Add the topic to the root README**

In `README.md`, under `### Test Levels by Scope`, add:

```markdown
- [Integration Tests](topics/integration-tests/README.md)
```

- [ ] **Step 7: Commit**

```bash
git add topics/integration-tests README.md
git commit -m "Add Integration Tests topic"
```

---

### Task 4: Component Tests topic

**Files:**
- Create: `topics/component-tests/counter.ts`
- Create: `topics/component-tests/example.test.ts`
- Create: `topics/component-tests/README.md`
- Modify: `package.json` (add `@testing-library/dom`, `jsdom` devDependencies)
- Modify: `README.md`

**Interfaces:**
- Produces: `createCounter(container: HTMLElement): void` — appends a button that increments its own label on click.
- New dependency: `@testing-library/dom` (framework-agnostic DOM queries/events — avoids pulling in React for a plain-DOM example) and `jsdom` (DOM environment for this one test file, via a per-file `@vitest-environment` pragma so other topics keep the faster default Node environment).

- [ ] **Step 1: Add the dependencies**

Run: `pnpm add -D @testing-library/dom jsdom`
Expected: both added to `package.json` devDependencies and installed.

- [ ] **Step 2: Write the failing test**

`topics/component-tests/example.test.ts`:

```ts
// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { fireEvent, screen } from '@testing-library/dom'
import { createCounter } from './counter'

describe('createCounter', () => {
  it('increments the displayed count on click', () => {
    document.body.innerHTML = ''
    createCounter(document.body)

    const button = screen.getByRole('button', { name: 'Count: 0' })
    fireEvent.click(button)

    expect(screen.getByRole('button', { name: 'Count: 1' })).toBeTruthy()
  })
})
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `pnpm test topics/component-tests`
Expected: FAIL — `Cannot find module './counter'`.

- [ ] **Step 4: Write the implementation**

`topics/component-tests/counter.ts`:

```ts
export function createCounter(container: HTMLElement): void {
  let count = 0
  const button = document.createElement('button')
  button.textContent = `Count: ${count}`
  button.addEventListener('click', () => {
    count += 1
    button.textContent = `Count: ${count}`
  })
  container.appendChild(button)
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `pnpm test topics/component-tests`
Expected: PASS — 1 test passing.

- [ ] **Step 6: Write the README**

`topics/component-tests/README.md`:

```markdown
# Component Tests

Test a UI component in isolation — rendered into a real DOM, driven through
user-facing queries and events, without a browser or the rest of the app.

**When to use it:** for any interactive UI piece (button, form, widget)
where you want confidence in behavior without the cost of a full E2E run.

**Example:** `counter.ts` is a plain-DOM counter button;
`example.test.ts` renders it and clicks through Testing Library.

## References

- [Testing Library: DOM Testing Library docs](https://testing-library.com/docs/dom-testing-library/intro/)
- [Kent C. Dodds: Common mistakes with React Testing Library](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
```

- [ ] **Step 7: Add the topic to the root README**

In `README.md`, under `### Test Levels by Scope`, add:

```markdown
- [Component Tests](topics/component-tests/README.md)
```

- [ ] **Step 8: Commit**

```bash
git add topics/component-tests package.json pnpm-lock.yaml README.md
git commit -m "Add Component Tests topic"
```

---

### Task 5: Contract Tests topic

**Files:**
- Create: `topics/contract-tests/contract.ts`
- Create: `topics/contract-tests/producer.ts`
- Create: `topics/contract-tests/example.test.ts`
- Create: `topics/contract-tests/README.md`
- Modify: `package.json` (add `zod` devDependency)
- Modify: `README.md`

**Interfaces:**
- Produces: `userResponseContract` (a zod schema) and `fetchUserFromProducer(): unknown`.
- New dependency: `zod` — a minimal, code-native way to express and verify a consumer/producer contract without standing up a broker; the production-grade tool (Pact) is linked in the README instead.

- [ ] **Step 1: Add the dependency**

Run: `pnpm add -D zod`
Expected: added to `package.json` devDependencies and installed.

- [ ] **Step 2: Write the failing test**

`topics/contract-tests/example.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { userResponseContract } from './contract'
import { fetchUserFromProducer } from './producer'

describe('user response contract', () => {
  it('accepts a payload that satisfies the agreed contract', () => {
    const result = userResponseContract.safeParse(fetchUserFromProducer())
    expect(result.success).toBe(true)
  })

  it('rejects a payload that breaks the contract (e.g. producer drops a field)', () => {
    const brokenPayload = { id: 'u1', email: 'a@example.com' }
    const result = userResponseContract.safeParse(brokenPayload)
    expect(result.success).toBe(false)
  })
})
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `pnpm test topics/contract-tests`
Expected: FAIL — `Cannot find module './contract'`.

- [ ] **Step 4: Write the implementation**

`topics/contract-tests/contract.ts`:

```ts
import { z } from 'zod'

export const userResponseContract = z.object({
  id: z.string(),
  email: z.string().email(),
  createdAt: z.string().datetime(),
})

export type UserResponse = z.infer<typeof userResponseContract>
```

`topics/contract-tests/producer.ts`:

```ts
export function fetchUserFromProducer(): unknown {
  return {
    id: 'u1',
    email: 'a@example.com',
    createdAt: new Date().toISOString(),
  }
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `pnpm test topics/contract-tests`
Expected: PASS — 2 tests passing.

- [ ] **Step 6: Write the README**

`topics/contract-tests/README.md`:

```markdown
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
```

- [ ] **Step 7: Add the topic to the root README**

In `README.md`, under `### Test Levels by Scope`, add:

```markdown
- [Contract Tests](topics/contract-tests/README.md)
```

- [ ] **Step 8: Commit**

```bash
git add topics/contract-tests package.json pnpm-lock.yaml README.md
git commit -m "Add Contract Tests topic"
```

---

### Task 6: E2E Tests topic

**Files:**
- Create: `topics/e2e-tests/fixture.html`
- Create: `topics/e2e-tests/example.spec.ts`
- Create: `topics/e2e-tests/README.md`
- Create: `playwright.config.ts`
- Modify: `package.json` (add `@playwright/test` devDependency)
- Modify: `README.md`

**Interfaces:**
- Produces: root `playwright.config.ts` with `testDir: './topics'`, `testMatch: '**/*.spec.ts'` — later Playwright-based topics (Compatibility, Visual Regression) reuse this same config, no changes needed.
- New dependency: `@playwright/test` — the tool named in the spec for E2E, Compatibility, and Visual Regression testing.

- [ ] **Step 1: Add the dependency and browsers**

Run: `pnpm add -D @playwright/test && pnpm exec playwright install chromium`
Expected: dependency installed; Chromium browser binary downloaded.

- [ ] **Step 2: Create the Playwright config**

`playwright.config.ts`:

```ts
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './topics',
  testMatch: '**/*.spec.ts',
})
```

- [ ] **Step 3: Create the fixture page**

`topics/e2e-tests/fixture.html`:

```html
<!doctype html>
<html lang="en">
  <body>
    <input id="name" />
    <button id="greet">Greet</button>
    <p id="message"></p>
    <script>
      document.getElementById('greet').addEventListener('click', () => {
        const name = document.getElementById('name').value || 'stranger'
        document.getElementById('message').textContent = `Hello, ${name}!`
      })
    </script>
  </body>
</html>
```

- [ ] **Step 4: Write the test**

`topics/e2e-tests/example.spec.ts`:

```ts
import { test, expect } from '@playwright/test'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const fixturePath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixture.html')

test('greets the name typed into the input', async ({ page }) => {
  await page.goto(`file://${fixturePath}`)
  await page.fill('#name', 'Ada')
  await page.click('#greet')
  await expect(page.locator('#message')).toHaveText('Hello, Ada!')
})
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `pnpm exec playwright test topics/e2e-tests`
Expected: PASS — 1 test passing (this test has no prior failing-state step since it doesn't depend on a separate implementation file — the fixture page itself is the "implementation").

- [ ] **Step 6: Write the README**

`topics/e2e-tests/README.md`:

```markdown
# End-to-End (E2E) Tests

Drive the real UI the way a user would — typing, clicking, reading what's
on screen — through an actual browser engine.

**When to use it:** for the critical user flows that must work end to end
(checkout, login, the primary action of your app). Slower and more brittle
than lower-level tests, so used sparingly.

**Example:** `fixture.html` is a tiny standalone page; `example.spec.ts`
drives it with Playwright.

**Run it:** `pnpm exec playwright test topics/e2e-tests` (not part of
`pnpm test` — Playwright is a separate runner, kept out of Vitest's glob by
using the `.spec.ts` extension).

## References

- [Playwright docs](https://playwright.dev/docs/intro)
- [Martin Fowler: Practical Test Pyramid](https://martinfowler.com/articles/practical-test-pyramid.html)
```

- [ ] **Step 7: Add the topic to the root README**

In `README.md`, under `### Test Levels by Scope`, add:

```markdown
- [E2E Tests](topics/e2e-tests/README.md)
```

- [ ] **Step 8: Commit**

```bash
git add topics/e2e-tests playwright.config.ts package.json pnpm-lock.yaml README.md
git commit -m "Add E2E Tests topic"
```

---

### Task 7: System Tests topic

**Files:**
- Create: `topics/system-tests/server.ts`
- Create: `topics/system-tests/example.test.ts`
- Create: `topics/system-tests/README.md`
- Modify: `README.md`

**Interfaces:**
- Produces: `startServer(): { server: Server; url: string }` — starts an HTTP server on an ephemeral port with `/health`, `POST /users`, `GET /users/:id`. **Task 8 (Smoke Tests) imports `startServer` from this file** — keep this exact name and shape.

- [ ] **Step 1: Write the failing test**

`topics/system-tests/example.test.ts`:

```ts
import { afterEach, describe, expect, it } from 'vitest'
import type { Server } from 'node:http'
import { startServer } from './server'

describe('system test: the whole HTTP surface working together', () => {
  let server: Server

  afterEach(() => {
    server.close()
  })

  it('creates a user and then retrieves it through the full request lifecycle', async () => {
    const started = startServer()
    server = started.server

    const createResponse = await fetch(`${started.url}/users`, {
      method: 'POST',
      body: JSON.stringify({ id: '1', name: 'Ada' }),
    })
    expect(createResponse.status).toBe(201)

    const getResponse = await fetch(`${started.url}/users/1`)
    expect(await getResponse.json()).toEqual({ id: '1', name: 'Ada' })
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm test topics/system-tests`
Expected: FAIL — `Cannot find module './server'`.

- [ ] **Step 3: Write the implementation**

`topics/system-tests/server.ts`:

```ts
import { createServer, type Server } from 'node:http'

interface StoredUser {
  id: string
  name: string
}

export function startServer(): { server: Server; url: string } {
  const users = new Map<string, StoredUser>()

  const server = createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/health') {
      res.writeHead(200).end('ok')
      return
    }

    if (req.method === 'POST' && req.url === '/users') {
      let body = ''
      req.on('data', (chunk) => (body += chunk))
      req.on('end', () => {
        const { id, name } = JSON.parse(body) as StoredUser
        users.set(id, { id, name })
        res.writeHead(201, { 'Content-Type': 'application/json' }).end(JSON.stringify({ id, name }))
      })
      return
    }

    if (req.method === 'GET' && req.url?.startsWith('/users/')) {
      const id = req.url.split('/')[2]
      const user = users.get(id ?? '')
      if (!user) {
        res.writeHead(404).end()
        return
      }
      res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify(user))
      return
    }

    res.writeHead(404).end()
  })

  server.listen(0)
  const address = server.address()
  const port = typeof address === 'object' && address ? address.port : 0
  return { server, url: `http://127.0.0.1:${port}` }
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm test topics/system-tests`
Expected: PASS — 1 test passing.

- [ ] **Step 5: Write the README**

`topics/system-tests/README.md`:

```markdown
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
```

- [ ] **Step 6: Add the topic to the root README**

In `README.md`, under `### Test Levels by Scope`, add:

```markdown
- [System Tests](topics/system-tests/README.md)
```

- [ ] **Step 7: Commit**

```bash
git add topics/system-tests README.md
git commit -m "Add System Tests topic"
```

---

### Task 8: Smoke Tests topic

**Files:**
- Create: `topics/smoke-tests/example.test.ts`
- Create: `topics/smoke-tests/README.md`
- Modify: `README.md`

**Interfaces:**
- Consumes: `startServer(): { server: Server; url: string }` from `topics/system-tests/server.ts` (Task 7).

- [ ] **Step 1: Write the failing test**

`topics/smoke-tests/example.test.ts`:

```ts
import { afterEach, describe, expect, it } from 'vitest'
import type { Server } from 'node:http'
import { startServer } from '../system-tests/server'

describe('smoke test: does the build basically work', () => {
  let server: Server

  afterEach(() => {
    server.close()
  })

  it('responds to a health check', async () => {
    const started = startServer()
    server = started.server

    const response = await fetch(`${started.url}/health`)

    expect(response.status).toBe(200)
  })
})
```

This test should pass immediately since `startServer` already exists from
Task 7 — there's no separate implementation step for this topic.

- [ ] **Step 2: Run the test to verify it passes**

Run: `pnpm test topics/smoke-tests`
Expected: PASS — 1 test passing.

- [ ] **Step 3: Write the README**

`topics/smoke-tests/README.md`:

```markdown
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
```

- [ ] **Step 4: Add the topic to the root README**

In `README.md`, under `### Test Levels by Scope`, add:

```markdown
- [Smoke Tests](topics/smoke-tests/README.md)
```

- [ ] **Step 5: Commit**

```bash
git add topics/smoke-tests README.md
git commit -m "Add Smoke Tests topic"
```

---

### Task 9: Regression Tests topic

**Files:**
- Create: `topics/regression-tests/example.ts`
- Create: `topics/regression-tests/example.test.ts`
- Create: `topics/regression-tests/README.md`
- Modify: `README.md`

**Interfaces:**
- Produces: `formatCurrency(amountInCents: number): string`.

- [ ] **Step 1: Write the failing test**

`topics/regression-tests/example.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { formatCurrency } from './example'

describe('formatCurrency', () => {
  it('formats a positive amount', () => {
    expect(formatCurrency(1050)).toBe('$10.50')
  })

  // Regression test: a past version dropped the minus sign for negative
  // amounts, showing "$5.00" instead of "-$5.00" for a refund.
  it('keeps the minus sign for negative amounts (regression)', () => {
    expect(formatCurrency(-500)).toBe('-$5.00')
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm test topics/regression-tests`
Expected: FAIL — `Cannot find module './example'`.

- [ ] **Step 3: Write the implementation**

`topics/regression-tests/example.ts`:

```ts
export function formatCurrency(amountInCents: number): string {
  const sign = amountInCents < 0 ? '-' : ''
  const absolute = Math.abs(amountInCents)
  const dollars = Math.floor(absolute / 100)
  const cents = String(absolute % 100).padStart(2, '0')
  return `${sign}$${dollars}.${cents}`
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm test topics/regression-tests`
Expected: PASS — 2 tests passing.

- [ ] **Step 5: Write the README**

`topics/regression-tests/README.md`:

```markdown
# Regression Tests

A test pinned to a specific bug that was previously fixed, so the exact
failure can never silently come back.

**When to use it:** every time you fix a bug — write the test that would
have caught it, before or as part of the fix, and keep it in the suite
permanently.

**Example:** `example.ts`'s `formatCurrency` once dropped the minus sign
for negative amounts; `example.test.ts` locks that case in.

## References

- [ISTQB Glossary: Regression Testing](https://glossary.istqb.org/en_US/term/regression-testing-1)
- [Martin Fowler: Test Coverage](https://martinfowler.com/bliki/TestCoverage.html)
```

- [ ] **Step 6: Add the topic to the root README**

In `README.md`, under `### Test Levels by Scope`, add:

```markdown
- [Regression Tests](topics/regression-tests/README.md)
```

- [ ] **Step 7: Commit**

```bash
git add topics/regression-tests README.md
git commit -m "Add Regression Tests topic"
```

---

### Task 10: Acceptance Tests / UAT topic (reference-only)

**Files:**
- Create: `topics/acceptance-tests/README.md`
- Modify: `README.md`

**Interfaces:**
- None — reference-only topic, no code.

- [ ] **Step 1: Write the README**

`topics/acceptance-tests/README.md`:

```markdown
# Acceptance Tests / UAT

Validate the system against business requirements, typically written and
signed off by stakeholders or product owners rather than engineers.
Reference-only here — this is a process/sign-off practice, not a distinct
code technique. See [Gherkin/BDD Tests](../gherkin-bdd/README.md) (added in
a later plan) for how acceptance criteria become executable.

**When to use it:** before a release, to confirm the built feature actually
satisfies the business need it was built for — distinct from confirming the
code works correctly (that's every other topic in this repo).

## References

- [ISTQB Glossary: Acceptance Testing](https://glossary.istqb.org/en_US/term/acceptance-testing-1)
- [Atlassian: User acceptance testing (UAT)](https://www.atlassian.com/software-testing/acceptance-testing)
```

- [ ] **Step 2: Add the topic to the root README**

In `README.md`, under `### Test Levels by Scope`, add:

```markdown
- [Acceptance Tests / UAT](topics/acceptance-tests/README.md)
```

- [ ] **Step 3: Commit**

```bash
git add topics/acceptance-tests README.md
git commit -m "Add Acceptance Tests / UAT topic"
```

---

## End-of-plan verification

- [ ] Run `pnpm test` — expected: all Vitest topics pass (Unit, Integration, Component, Contract, System, Smoke, Regression — 7 topics with `.test.ts` files).
- [ ] Run `pnpm exec playwright test topics/e2e-tests` — expected: E2E test passes.
- [ ] Run `pnpm exec tsc --noEmit` — expected: no type errors.
- [ ] Confirm `README.md`'s "Test Levels by Scope" section lists all 9 topics.
