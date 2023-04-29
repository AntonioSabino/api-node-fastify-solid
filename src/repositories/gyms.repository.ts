import { Gym } from '@/common/interfaces/gym.interface'

export interface GymsRepository {
  findById(id: string): Promise<Gym | null>
}
