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
