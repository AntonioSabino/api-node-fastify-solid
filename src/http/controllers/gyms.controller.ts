import { GymsService } from '@/services/gyms.service'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export class GymsController {
  constructor(private readonly gymsService: GymsService) {}

  async createGym(request: FastifyRequest, reply: FastifyReply) {
    const createGymBodySchema = z.object({
      name: z.string(),
      description: z.string().nullable(),
      phone: z.string().nullable(),
      latitude: z.number().refine((value) => {
        return Math.abs(value) <= 90
      }),
      longitude: z.number().refine((value) => {
        return Math.abs(value) <= 180
      }),
    })

    const gymInput = createGymBodySchema.parse(request.body)

    const gym = await this.gymsService.create(gymInput)

    reply.status(201).send(gym)
  }

  async findGymsByName(request: FastifyRequest, reply: FastifyReply) {
    const findGymsByNameQuerySchema = z.object({
      name: z.string(),
      page: z.coerce.number().int().positive().default(1),
    })

    const { name, page } = findGymsByNameQuerySchema.parse(request.query)

    const gyms = await this.gymsService.findManyByName(name, page)

    return reply.status(200).send(gyms)
  }

  async findNearbyGyms(request: FastifyRequest, reply: FastifyReply) {
    const nearbyGymsQuerySchema = z.object({
      latitude: z.number().refine((value) => {
        return Math.abs(value) <= 90
      }),
      longitude: z.number().refine((value) => {
        return Math.abs(value) <= 180
      }),
    })

    const { latitude, longitude } = nearbyGymsQuerySchema.parse(request.body)

    const gyms = await this.gymsService.findNearbyGyms(latitude, longitude)

    return reply.status(200).send(gyms)
  }
}
