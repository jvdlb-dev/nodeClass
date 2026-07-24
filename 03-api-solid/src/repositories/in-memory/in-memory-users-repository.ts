import type { User, Prisma } from '../../../generated/prisma/browser'
import type { UsersRepository } from '../users-repository'

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []

  async findByEmail(email: string) {
    const user = this.items.find((item) => item.email === email)
    if (!user) {
      return null
    }

    return user
  }

  async create(data: Prisma.UserCreateInput) {
    const user = {
      id: 'user-1',
      name: data.name as string,
      email: data.email as string,
      password_hash: data.password_hash as string,
      created_at: new Date(),
    }

    this.items.push(user)
    return user
  }
}
