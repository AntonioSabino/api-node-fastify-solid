import { prisma } from '@/lib/prisma'
import { GymsRepository } from '../gyms.repository'
import { Gym } from '@/common/interfaces/gym.interface'
import { Prisma } from '@prisma/client'

export class PrismaGymsRepository implements GymsRepository {
  async create(gym: Prisma.GymCreateInput): Promise<Gym> {
    const createdGym = await prisma.gym.create({ data: gym })

    const convertedGym: Gym = {
      ...createdGym,
      latitude: createdGym.latitude.toString(),
      longitude: createdGym.longitude.toString(),
    }

    return convertedGym
  }

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
