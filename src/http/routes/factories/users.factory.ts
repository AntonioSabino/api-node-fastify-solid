import { UsersController } from '@/http/controllers/users.controller'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users.repository'
import { UsersService } from '@/services/users.service'

export default function makeUsersController() {
  const usersRepository = new PrismaUsersRepository()
  const usersService = new UsersService(usersRepository)
  const usersController = new UsersController(usersService)

  return usersController
}
