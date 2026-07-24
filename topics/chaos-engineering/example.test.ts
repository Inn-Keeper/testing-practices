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
