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
