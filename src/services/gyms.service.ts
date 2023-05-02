import { GymInput } from '@/common/interfaces/gym.interface'
import { GymsRepository } from '@/repositories/gyms.repository'

export class GymsService {
  constructor(private readonly gymsRepository: GymsRepository) {}

  async create(gym: GymInput) {
    return this.gymsRepository.create(gym)
  }

  async findManyByName(name: string, page: number) {
    return this.gymsRepository.findManyByName(name, page)
  }

  async findNearbyGyms(userLat: number, userLng: number) {
    const gyms = await this.gymsRepository.findManyNearby({
      latitude: userLat,
      longitude: userLng,
    })

    return gyms
  }
}
