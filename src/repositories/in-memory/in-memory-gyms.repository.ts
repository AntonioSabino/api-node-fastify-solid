import { Gym } from '@/common/interfaces/gym.interface'
import { GymsRepository } from '../gyms.repository'

export class InMemoryGymsRepository implements GymsRepository {
  public gyms: Gym[] = []

  async findById(id: string): Promise<Gym | null> {
    const gym = this.gyms.find((gym) => gym.id === id)
    return gym || null
  }
}
