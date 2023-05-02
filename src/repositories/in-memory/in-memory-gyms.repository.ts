import { Gym, GymInput } from '@/common/interfaces/gym.interface'
import { FindManyNearbyGymsParams, GymsRepository } from '../gyms.repository'
import { randomUUID } from 'crypto'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'

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

  async findManyByName(name: string, page: number): Promise<Gym[] | null> {
    const gyms = this.gyms
      .filter((gym) => gym.name.includes(name))
      .slice((page - 1) * 20, page * 20)
    return gyms || null
  }

  async findManyNearby(params: FindManyNearbyGymsParams) {
    return this.gyms.filter((gym) => {
      const distance = getDistanceBetweenCoordinates(
        { latitude: params.latitude, longitude: params.longitude },
        { latitude: Number(gym.latitude), longitude: Number(gym.longitude) },
      )

      return distance < 10
    })
  }
}
