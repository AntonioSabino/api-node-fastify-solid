import { ResourceNotFoundError } from '@/common/errors/resource-not-found-error'
import { CheckInInput } from '@/common/interfaces/check-ins.interface'
import { CheckInsRepository } from '@/repositories/check-ins.repository'
import { GymsRepository } from '@/repositories/gyms.repository'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'

export default class CheckInsService {
  constructor(
    private readonly checkInsRepository: CheckInsRepository,
    private readonly gymsRepository: GymsRepository,
  ) {}

  async create({ userId, gymId, userLatitude, userLongitude }: CheckInInput) {
    const gym = await this.gymsRepository.findById(gymId)

    if (!gym) {
      throw new ResourceNotFoundError()
    }

    const distance = getDistanceBetweenCoordinates(
      { latitude: Number(userLatitude), longitude: Number(userLongitude) },
      { latitude: Number(gym.latitude), longitude: Number(gym.longitude) },
    )

    const MAX_DISTANCE_IN_KILOMETERS = 0.1

    if (distance > MAX_DISTANCE_IN_KILOMETERS) {
      throw new Error()
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
