import { GymsController } from '@/http/controllers/gyms.controller'
import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms.repository'
import { GymsService } from '@/services/gyms.service'

export default function makeGymsController() {
  const repository = new PrismaGymsRepository()
  const service = new GymsService(repository)
  const controller = new GymsController(service)

  return controller
}
