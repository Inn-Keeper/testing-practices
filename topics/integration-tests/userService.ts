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
