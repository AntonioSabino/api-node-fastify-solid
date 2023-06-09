import { prisma } from '@/lib/prisma'
import { FindManyNearbyGymsParams, GymsRepository } from '../gyms.repository'
import { Gym } from '@/common/interfaces/gym.interface'
import { Prisma } from '@prisma/client'

export class PrismaGymsRepository implements GymsRepository {
  async create(gym: Prisma.GymCreateInput): Promise<Gym> {
    const createdGym = await prisma.gym.create({ data: gym })

    const convertedGym: Gym = {
      ...createdGym,
      latitude: createdGym.latitude.toNumber(),
      longitude: createdGym.longitude.toNumber(),
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
      latitude: gym.latitude.toNumber(),
      longitude: gym.longitude.toNumber(),
    }

    return convertedGym
  }

  async findManyByName(name: string, page: number): Promise<Gym[] | null> {
    const gym = await prisma.gym.findMany({
      where: { name: { contains: name } },
      skip: (page - 1) * 20,
      take: page * 20,
    })

    const convertedGyms = gym.map((gym) => ({
      ...gym,
      latitude: gym.latitude.toNumber(),
      longitude: gym.longitude.toNumber(),
    }))

    return convertedGyms
  }

  async findManyNearby({ latitude, longitude }: FindManyNearbyGymsParams) {
    const gyms = await prisma.$queryRaw<Gym[]>`
      SELECT * from gyms
      WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
    `

    return gyms
  }
}
