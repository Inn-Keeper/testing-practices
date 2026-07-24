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
