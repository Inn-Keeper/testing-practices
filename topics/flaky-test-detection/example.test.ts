import { describe, expect, it } from 'vitest'
import { createUnstableOperation } from './example'

describe('createUnstableOperation', () => {
  // Created once, outside the test body, so its internal call count
  // survives across Vitest's retries — mirroring a real flaky dependency,
  // where what changes between retries is the dependency's state, not the
  // test itself.
  const operation = createUnstableOperation()

  it('succeeds within Vitest\'s test-level retry budget', { retry: 3 }, () => {
    // Expected to fail on the first two attempts, which is the whole
    // point of the demo — Vitest's `retry` option re-runs the test body
    // until it passes or the budget runs out.
    expect(operation()).toBe('ok')
  })
})
