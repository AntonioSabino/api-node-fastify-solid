import { randomUUID } from 'node:crypto'
import { CheckInsRepository } from '../check-ins.repository'
import {
  CheckIn,
  CheckInUncheckedCreateInput,
} from '@/common/interfaces/check-ins.interface'
import dayjs from 'dayjs'

export class InMemoryCheckInsRepository implements CheckInsRepository {
  private readonly checkIns: CheckIn[] = []

  async countByUserId(userId: string) {
    const count = this.checkIns.filter(
      (checkIn) => checkIn.user_id === userId,
    ).length

    return count
  }

  async findById(id: string): Promise<CheckIn | null> {
    const checkIn = this.checkIns.find((checkIn) => checkIn.user_id === id)

    if (!checkIn) return null

    return checkIn
  }

  async findManyByUserId(userId: string, page: number) {
    const checkIns = this.checkIns
      .filter((checkIn) => checkIn.user_id === userId)
      .slice((page - 1) * 20, page * 20)

    return checkIns
  }

  async findByUserIdAndDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf('date')
    const endOfTheDay = dayjs(date).endOf('date')

    const checkInOnSameDay = this.checkIns.find((checkIn) => {
      const checkInDate = dayjs(checkIn.createdAt)
      const isOnSameDate =
        checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay)

      return checkIn.user_id === userId && isOnSameDate
    })

    if (!checkInOnSameDay) return null

    return checkInOnSameDay
  }

  async create(checkIn: CheckInUncheckedCreateInput) {
    const newCheckIn = {
      id: randomUUID(),
      createdAt: new Date(),
      validated_at: null,
      user_id: checkIn.user_id,
      gym_id: checkIn.gym_id,
    }

    this.checkIns.push(newCheckIn)

    return newCheckIn
  }

  async save(checkIn: CheckIn) {
    const index = this.checkIns.findIndex((c) => c.id === checkIn.id)

    this.checkIns[index] = checkIn

    return checkIn
  }
}
