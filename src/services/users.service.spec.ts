import { beforeEach, describe, expect, it } from 'vitest'
import { UsersService } from './users.service'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users.repository'
import { UserAlreadyExistsError } from '../common/errors/user-already-exists-error'
import { User } from '@/common/interfaces/user.interface'

describe('User Service', () => {
  let usersService: UsersService

  beforeEach(() => {
    const usersRepository = new InMemoryUsersRepository()
    usersService = new UsersService(usersRepository)
  })

  it('should be able to users', async () => {
    const user = await usersService.createUser({
      name: 'John Doe',
      email: 'john.doe@gmail.com',
      password: '123456',
    })

    expect(user).toMatchObject<User>
  })

  it('should hash user password upon registration', async () => {
    const user = await usersService.createUser({
      name: 'John Doe',
      email: 'john.doe@gmail.com',
      password: '123456',
    })

    const isPasswordHashed = await compare('123456', user.password_hash)

    expect(isPasswordHashed).toBe(true)
  })

  it('should not allow two users with the same email', async () => {
    const email = 'john.doe@gmail.com'

    await usersService.createUser({
      name: 'John Doe',
      email,
      password: '123456',
    })

    await expect(() => {
      return usersService.createUser({
        name: 'John Doe',
        email,
        password: '123456',
      })
    }).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
