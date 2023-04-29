import { prisma } from '@/lib/prisma'
import { GymsRepository } from '../gyms.repository'
import { Gym } from '@prisma/client'

export class PrismaGymsRepository implements GymsRepository {
  async findById(id: string): Promise<Gym | null> {
    const gym = await prisma.gym.findUnique({ where: { id } })

    if (!gym) {
      return null
    }

    return gym
  }
}
