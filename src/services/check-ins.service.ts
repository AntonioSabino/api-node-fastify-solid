import { LateCheckInValidationError } from '@/common/errors/late-checkin-validation-error'
import { MaxDistanceError } from '@/common/errors/max-distance-error'
import { MaxNumberOfCheckInsError } from '@/common/errors/max-number-of-check-ins-erro'
import { ResourceNotFoundError } from '@/common/errors/resource-not-found-error'
import { CheckIn, CheckInInput } from '@/common/interfaces/check-ins.interface'
import { CheckInsRepository } from '@/repositories/check-ins.repository'
import { GymsRepository } from '@/repositories/gyms.repository'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'
import dayjs from 'dayjs'

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
      throw new MaxDistanceError()
    }

    const checkInOnSameDay = await this.checkInsRepository.findByUserIdAndDate(
      userId,
      new Date(),
    )

    if (checkInOnSameDay) {
      throw new MaxNumberOfCheckInsError()
    }

    const checkIn = await this.checkInsRepository.create({
      user_id: userId,
      gym_id: gymId,
    })

    return checkIn
  }

  async findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
    const checkIns = await this.checkInsRepository.findManyByUserId(
      userId,
      page,
    )

    return checkIns
  }

  async countByUserId(userId: string): Promise<number> {
    const count = await this.checkInsRepository.countByUserId(userId)

    return count
  }

  async validateCheckIn(checkInId: string) {
    const checkIn = await this.checkInsRepository.findById(checkInId)

    if (!checkIn) {
      throw new ResourceNotFoundError()
    }

    const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
      checkIn.createdAt,
      'minutes',
    )

    const MAX_MINUTES_TO_VALIDATE_CHECK_IN = 20

    if (
      distanceInMinutesFromCheckInCreation > MAX_MINUTES_TO_VALIDATE_CHECK_IN
    ) {
      throw new LateCheckInValidationError()
    }

    checkIn.validated_at = new Date()

    await this.checkInsRepository.save(checkIn)

    return checkIn
  }
}
