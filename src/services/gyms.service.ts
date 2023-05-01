import { GymInput } from '@/common/interfaces/gym.interface'
import { GymsRepository } from '@/repositories/gyms.repository'

export class GymsService {
  constructor(private readonly gymsRepository: GymsRepository) {}

  async create(gym: GymInput) {
    return this.gymsRepository.create(gym)
  }
}
