import { CheckInsController } from '@/http/controllers/check-ins.controller'
import { PrismaCheckinsRepository } from '@/repositories/prisma/prisma-checkins.repository'
import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms.repository'
import CheckInsService from '@/services/check-ins.service'

export default function makeCheckInsController() {
  const checkInsRepository = new PrismaCheckinsRepository()
  const gymsRepository = new PrismaGymsRepository()
  const service = new CheckInsService(checkInsRepository, gymsRepository)
  const controller = new CheckInsController(service)

  return controller
}
