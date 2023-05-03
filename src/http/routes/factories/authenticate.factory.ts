import AuthenticateController from '@/http/controllers/authenticate.controller'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users.repository'
import { AuthenticateService } from '@/services/authenticate.service'

export default function makeAuthController() {
  const usersRepository = new PrismaUsersRepository()
  const authenticateService = new AuthenticateService(usersRepository)
  const authenticateController = new AuthenticateController(authenticateService)

  return authenticateController
}
