import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users.repository'
import { UsersService } from '@/services/users.service'
import { UsersController } from '../controllers/users.controller'

export default function makeUsersController() {
  const usersRepository = new PrismaUsersRepository()
  const usersService = new UsersService(usersRepository)
  const usersController = new UsersController(usersService)

  return usersController
}
