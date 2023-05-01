import { Gym, GymInput } from '@/common/interfaces/gym.interface'
import { GymsRepository } from '../gyms.repository'
import { randomUUID } from 'crypto'

export class InMemoryGymsRepository implements GymsRepository {
  public gyms: Gym[] = []

  async create(gym: GymInput): Promise<Gym> {
    const newGym = {
      id: randomUUID(),
      ...gym,
    }
    this.gyms.push(newGym)
    return newGym
  }

  async findById(id: string): Promise<Gym | null> {
    const gym = this.gyms.find((gym) => gym.id === id)
    return gym || null
  }
}
