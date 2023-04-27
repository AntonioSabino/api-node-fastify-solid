import { AuthenticateInput } from '@/common/interfaces/authenticate.interface'
import { UsersRepository } from '@/repositories/users.repository'
import { InvalidCredentialsError } from '../common/errors/invalid-credentials-error'
import { compare } from 'bcryptjs'
import { User } from '@/common/interfaces/user.interface'

export class AuthenticateService {
  constructor(private readonly userRepository: UsersRepository) {
    this.userRepository = userRepository
  }

  async login({ email, password }: AuthenticateInput): Promise<User> {
    const user = await this.userRepository.findByEmail(email)

    if (!user) {
      throw new InvalidCredentialsError()
    }

    const isPasswordValid = await compare(password, user.password_hash)

    if (!isPasswordValid) {
      throw new InvalidCredentialsError()
    }

    return user
  }
}
