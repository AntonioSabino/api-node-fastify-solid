import { Gym, GymInput } from '@/common/interfaces/gym.interface'

export interface GymsRepository {
  create(gym: GymInput): Promise<Gym>
  findById(id: string): Promise<Gym | null>
  findManyByName(name: string, page: number): Promise<Gym[] | null>
}
