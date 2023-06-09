import { UsersRepository } from '@/repositories/users.repository'
import { hash } from 'bcryptjs'
import { UserAlreadyExistsError } from '../common/errors/user-already-exists-error'
import { User, UserCreateInput } from '@/common/interfaces/user.interface'
import { ResourceNotFoundError } from '@/common/errors/resource-not-found-error'

export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create({
    name,
    email,
    password,
    role,
  }: UserCreateInput): Promise<User> {
    const passwordHash = await hash(password, 8)

    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    return this.usersRepository.create({
      name,
      email,
      role,
      password_hash: passwordHash,
    })
  }

  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findById(id)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    return user
  }
}
