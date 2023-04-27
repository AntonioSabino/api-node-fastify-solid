import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users.repository'
import { User } from '@/common/interfaces/user.interface'
import { AuthenticateService } from './authenticate.service'
import { hash } from 'bcryptjs'
import { InvalidCredentialsError } from '../common/errors/invalid-credentials-error'

describe('Authenticate Service', () => {
  let usersRepository: InMemoryUsersRepository
  let authenticateService: AuthenticateService

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    authenticateService = new AuthenticateService(usersRepository)
  })

  it('should be able to authenticate', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'john.doe@gmail.com',
      password_hash: await hash('123456', 8),
    })

    const user = await authenticateService.login({
      email: 'john.doe@gmail.com',
      password: '123456',
    })

    expect(user).toMatchObject<User>
  })

  it('should not be able to authenticate with wrong email', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'john.doe@gmail.com',
      password_hash: await hash('123456', 8),
    })

    await expect(() => {
      return authenticateService.login({
        email: 'john.notdoe@gmail.com',
        password: '123456',
      })
    }).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'john.doe@gmail.com',
      password_hash: await hash('123456', 8),
    })

    await expect(() => {
      return authenticateService.login({
        email: 'john.doe@gmail.com',
        password: '654321',
      })
    }).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
