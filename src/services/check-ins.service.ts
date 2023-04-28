import { CheckInsRepository } from '@/repositories/check-ins.repository'

interface CheckInInput {
  userId: string
  gymId: string
}

export default class CheckInsService {
  constructor(private readonly checkInsRepository: CheckInsRepository) {}

  async create({ userId, gymId }: CheckInInput) {
    const checkIn = await this.checkInsRepository.create({
      user_id: userId,
      gym_id: gymId,
    })

    return checkIn
  }
}
