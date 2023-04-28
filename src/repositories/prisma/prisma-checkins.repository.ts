import { prisma } from '@/lib/prisma'
import { CheckInsRepository } from '../check-ins.repository'
import { CheckIn, Prisma } from '@prisma/client'
import dayjs from 'dayjs'

export class PrismaUsersRepository implements CheckInsRepository {
  async findByUserIdAndDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf('date')
    const endOfTheDay = dayjs(date).endOf('date')

    const checkInOnSameDay = await prisma.checkIn.findFirst({
      where: {
        user_id: userId,
        createdAt: {
          gte: startOfTheDay.toDate(),
          lte: endOfTheDay.toDate(),
        },
      },
    })

    if (!checkInOnSameDay) return null

    return checkInOnSameDay
  }

  async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
    const checkIn = await prisma.checkIn.create({ data })
    return checkIn
  }
}
