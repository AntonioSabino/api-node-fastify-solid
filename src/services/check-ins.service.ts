import { ResourceNotFoundError } from '@/common/errors/resource-not-found-error'
import { CheckInsRepository } from '@/repositories/check-ins.repository'
import { GymsRepository } from '@/repositories/gyms.repository'

interface CheckInInput {
  userId: string
  gymId: string
  userLatitude: string
  userLongitude: string
}

export default class CheckInsService {
  constructor(
    private readonly checkInsRepository: CheckInsRepository,
    private readonly gymsRepository: GymsRepository,
  ) {}

  async create({ userId, gymId }: CheckInInput) {
    const gym = await this.gymsRepository.findById(gymId)

    if (!gym) {
      throw new ResourceNotFoundError()
    }

    const checkInOnSameDay = await this.checkInsRepository.findByUserIdAndDate(
      userId,
      new Date(),
    )

    if (checkInOnSameDay) {
      throw new Error('User already checked in today')
    }

    const checkIn = await this.checkInsRepository.create({
      user_id: userId,
      gym_id: gymId,
    })

    return checkIn
  }
}
