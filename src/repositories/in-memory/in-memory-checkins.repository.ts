import { randomUUID } from 'node:crypto'
import { CheckInsRepository } from '../check-ins.repository'
import {
  CheckIn,
  CheckInUncheckedCreateInput,
} from '@/common/interfaces/check-ins.interface'

export class InMemoryCheckInsRepository implements CheckInsRepository {
  private readonly checkIns: CheckIn[] = []

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
}
