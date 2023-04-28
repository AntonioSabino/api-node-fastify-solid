import { prisma } from '@/lib/prisma'
import { CheckInsRepository } from '../check-ins.repository'
import { CheckIn, Prisma } from '@prisma/client'

export class PrismaUsersRepository implements CheckInsRepository {
  async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
    const checkIn = await prisma.checkIn.create({ data })
    return checkIn
  }
}
