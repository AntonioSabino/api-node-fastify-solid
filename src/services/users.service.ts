import { UsersRepository } from '@/repositories/users.repository'
import { hash } from 'bcryptjs'
import { UserAlreadyExistsError } from '../common/errors/user-already-exists-error'
import { User, UserCreateInput } from '@/common/interfaces/user.interface'

export class UsersService {
  private readonly usersRepository: UsersRepository

  constructor(usersRepository: any) {
    this.usersRepository = usersRepository
  }

  async createUser({ name, email, password }: UserCreateInput): Promise<User> {
    const passwordHash = await hash(password, 8)

    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    return this.usersRepository.create({
      name,
      email,
      password_hash: passwordHash,
    })
  }
}
