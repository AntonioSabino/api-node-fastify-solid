import { prisma } from '@/lib/prisma'
import { GymsRepository } from '../gyms.repository'
import { Gym } from '@/common/interfaces/gym.interface'

export class PrismaGymsRepository implements GymsRepository {
  async findById(id: string): Promise<Gym | null> {
    const gym = await prisma.gym.findUnique({ where: { id } })

    if (!gym) {
      return null
    }

    const convertedGym: Gym = {
      ...gym,
      latitude: gym.latitude.toString(),
      longitude: gym.longitude.toString(),
    }

    return convertedGym
  }
}
